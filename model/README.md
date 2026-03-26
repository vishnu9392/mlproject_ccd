## Credit Card Default Predictor Model

This folder stores the trained ML artifact used by the Flask API.

### Model file
- `credit_card_lr.joblib` (trained Logistic Regression pipeline)

### Train (optional)
The Flask app auto-trains the model on first run if `credit_card_lr.joblib` does not exist.

To train manually:
1. Install backend dependencies (`backend/requirements.txt`)
2. Run:
   - `python backend/train_model.py`

