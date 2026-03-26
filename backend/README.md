## Flask API (ML Backend)

### Endpoints
- `GET /health` returns `{ "status": "ok" }`
- `POST /predict`
  - Content-Type: `application/json`
  - Body example:
    ```json
    {
      "age": 45,
      "income": 75000,
      "credit_limit": 12000,
      "bill_amount": 9800,
      "previous_payments": 6,
      "payment_delay": 18
    }
    ```
  - Response example:
    ```json
    {
      "prediction": 1,
      "probability": 0.78,
      "probabilities": { "low_risk": 0.22, "high_risk": 0.78 },
      "features_used": ["age", ...]
    }
    ```

### Run locally
1. Install Python dependencies:
   - `pip install -r backend/requirements.txt`
2. Start the server:
   - `python backend/app.py`
3. (Optional) Train model explicitly before starting:
   - `python backend/train_model.py`

