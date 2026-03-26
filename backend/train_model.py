import os
from dataclasses import dataclass
from typing import Optional, Tuple

import joblib
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


FEATURES = [
    "age",
    "income",
    "credit_limit",
    "bill_amount",
    "previous_payments",
    "payment_delay",
]


@dataclass(frozen=True)
class ModelConfig:
    n_samples: int = 6000
    random_seed: int = 42
    test_size: float = 0.2


def _sigmoid(x: np.ndarray) -> np.ndarray:
    return 1.0 / (1.0 + np.exp(-x))


def make_synthetic_dataset(n: int, seed: int) -> Tuple[np.ndarray, np.ndarray]:
    """
    Generates a synthetic dataset with a realistic-ish signal:
    higher payment_delay, high bills relative to credit_limit, and low income increase risk.
    """
    rng = np.random.default_rng(seed)

    age = np.clip(rng.normal(40, 12, n), 18, 75)
    income = rng.uniform(20_000, 200_000, n)
    credit_limit = rng.uniform(1_000, 20_000, n)
    bill_amount = np.clip(
        rng.normal(0.85, 0.25, n) * credit_limit + rng.uniform(0, 2_000, n),
        500,
        60_000,
    )
    previous_payments = rng.integers(0, 21, n)
    payment_delay = np.clip(
        rng.poisson(6, n) + (previous_payments < 6).astype(int) * rng.integers(0, 12, n),
        0,
        90,
    )

    # Linear score -> probability -> label.
    # Coefficients are intentionally chosen to create meaningful separability.
    ratio = bill_amount / np.maximum(credit_limit, 1)
    score = (
        (payment_delay - 10) * 0.08
        + previous_payments * 0.04
        + (ratio - 0.9) * 3.0
        + (income - 60_000) / 100_000 * (-1.1)
        + (age - 40) * 0.015
        + rng.normal(0, 1.2, n)
    )
    proba = _sigmoid(score)
    y = (proba > 0.5).astype(int)  # 1 = high risk

    X = np.column_stack(
        [age, income, credit_limit, bill_amount, previous_payments, payment_delay]
    ).astype(float)
    return X, y


def train_and_save_model(model_path: str, cfg: Optional[ModelConfig] = None) -> None:
    cfg = cfg or ModelConfig()

    X, y = make_synthetic_dataset(cfg.n_samples, cfg.random_seed)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=cfg.test_size, random_state=cfg.random_seed, stratify=y
    )

    pipeline = Pipeline(
        steps=[
            ("scaler", StandardScaler()),
            (
                "clf",
                LogisticRegression(
                    max_iter=4000,
                    class_weight="balanced",
                    solver="lbfgs",
                ),
            ),
        ]
    )

    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)

    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump({"pipeline": pipeline, "features": FEATURES, "accuracy": acc}, model_path)


if __name__ == "__main__":
    # Allows running: python backend/train_model.py
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    out_path = os.path.join(root_dir, "model", "credit_card_lr.joblib")
    train_and_save_model(out_path)
    print(f"Model saved to: {out_path}")

