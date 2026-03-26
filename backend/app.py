import os
from typing import Any

import joblib
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS

from train_model import FEATURES, train_and_save_model


def _abspath(path: str) -> str:
    return os.path.abspath(os.path.expanduser(path))


ROOT_DIR = _abspath(os.path.join(os.path.dirname(__file__), ".."))
MODEL_PATH = _abspath(os.path.join(ROOT_DIR, "model", "credit_card_lr.joblib"))


def _get_first_key(data: dict[str, Any], keys: list[str]) -> Any:
    for k in keys:
        if k in data:
            return data[k]
    return None


def _coerce_number(v: Any, field_name: str) -> float:
    try:
        if v is None:
            raise ValueError("missing")
        return float(v)
    except Exception:
        raise ValueError(f"Invalid value for '{field_name}': {v}")


def load_model() -> Any:
    if not os.path.exists(MODEL_PATH):
        print("⚠️ Model not found. Training new model...")
        train_and_save_model(MODEL_PATH)

    blob = joblib.load(MODEL_PATH)
    return blob


# Load model once
MODEL_BLOB = load_model()
PIPELINE = MODEL_BLOB["pipeline"]
MODEL_FEATURES = MODEL_BLOB.get("features", FEATURES)


# Flask app
app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False
CORS(app)


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/predict")
def predict():
    try:
        # ✅ Check JSON
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400

        data = request.get_json(silent=True) or {}

        if not isinstance(data, dict):
            return jsonify({"error": "Invalid JSON format"}), 400

        # ✅ Map input keys
        key_map = {
            "age": ["age", "Age"],
            "income": ["income", "Income"],
            "credit_limit": ["credit_limit", "creditLimit", "Credit Limit"],
            "bill_amount": ["bill_amount", "billAmount", "Bill Amount"],
            "previous_payments": ["previous_payments", "previousPayments"],
            "payment_delay": ["payment_delay", "paymentDelay"],
        }

        payload = {}
        for feature in FEATURES:
            payload[feature] = _coerce_number(
                _get_first_key(data, key_map[feature]), feature
            )

        # ✅ Convert to numpy
        X = np.array([[payload[f] for f in MODEL_FEATURES]], dtype=float)

        # ✅ Predict
        proba = PIPELINE.predict_proba(X)[0]
        p_high = float(proba[1])
        prediction = int(p_high >= 0.5)

        return jsonify({
            "prediction": prediction,
            "probability": p_high,
            "probabilities": {
                "low_risk": float(1 - p_high),
                "high_risk": p_high
            }
        })

    except Exception as e:
        print("❌ ERROR:", str(e))  # shows in terminal
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    debug = True  # 👈 enable debug for development
    app.run(host="0.0.0.0", port=port, debug=debug)