# Credit Card Default Predictor (Full Stack)

Premium SaaS-style web app that predicts credit-card default risk using a Logistic Regression ML model.

## What you get

- `backend/` Flask API with `POST /predict` (returns `prediction` and probability)
- `model/` trained Logistic Regression model artifact (auto-trained on first run)
- `frontend/` React + Tailwind UI with glassmorphism, dark mode toggle, animations, and charts

## Backend

1. Install Python dependencies:
   - `pip install -r backend/requirements.txt`
2. Run the API:
   - `python backend/app.py`
3. Check:
   - `GET http://localhost:5000/health`

## Frontend

1. Install dependencies (from `frontend/`):
   - `npm install`
2. Start dev server:
   - `npm run dev`
3. Open:
   - `http://localhost:5173`

### Configure API URL (recommended)

Create `frontend/.env` (or copy from the example) with:
- `VITE_API_URL=http://localhost:5000`

If you skip this, the frontend defaults to `http://localhost:5000`.

