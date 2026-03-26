import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaClock,
  FaCreditCard,
  FaHistory,
  FaMoneyBillWave,
  FaReceipt,
  FaUser,
} from "react-icons/fa";
import ThemeToggle from "./components/ThemeToggle.jsx";
import RippleButton from "./components/RippleButton.jsx";
import FloatingInput from "./components/FloatingInput.jsx";
import CountUp from "./components/CountUp.jsx";
import Charts from "./components/Charts.jsx";
import PredictionResult from "./components/PredictionResult.jsx";

const API_URL = "http://127.0.0.1:5000";
function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function App() {
  const [form, setForm] = useState({
    age: "",
    income: "",
    credit_limit: "",
    bill_amount: "",
    previous_payments: "",
    payment_delay: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [totalPredictions, setTotalPredictions] = useState(() => {
    const v = localStorage.getItem("ccdp_total_predictions");
    return v ? Number(v) : 0;
  });

  const predictBtnRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("ccdp_total_predictions", String(totalPredictions));
  }, [totalPredictions]);

  const riskPercent = useMemo(() => {
    if (!result) return 0;
    return Math.round(Number(result.probability) * 100);
  }, [result]);

  const safePercent = 100 - riskPercent;

  const scrollToPredict = () => {
    const el = document.getElementById("predict");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePredict = async () => {
    setError("");
    setResult(null);

    const payload = {
      age: toNumber(form.age),
      income: toNumber(form.income),
      credit_limit: toNumber(form.credit_limit),
      bill_amount: toNumber(form.bill_amount),
      previous_payments: toNumber(form.previous_payments),
      payment_delay: toNumber(form.payment_delay),
    };

    const missing = Object.entries(payload).find(([, v]) => v === null);
    if (missing) {
      setError(`Please enter a valid number for: ${missing[0].replaceAll("_", " ")}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Prediction failed. Please try again.");
        return;
      }

      setResult(data);
      setTotalPredictions((prev) => prev + 1);
    } catch (err) {
      setError("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-24 left-[-120px] h-[360px] w-[360px] rounded-full blur-3xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(83,155,119,0.40), rgba(192,221,115,0.25))",
          }}
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[20%] right-[-140px] h-[420px] w-[420px] rounded-full blur-3xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(83,155,119,0.25), rgba(192,221,115,0.40))",
          }}
          animate={{ x: [0, -50, 0], y: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(83,155,119,0.20),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(192,221,115,0.18),transparent_50%)]" />
      </div>

      <div className="relative">
        {/* Nav */}
        <header className="max-w-6xl mx-auto px-4 sm:px-6 pt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl glass flex items-center justify-center">
                <div className="h-3.5 w-3.5 rounded-xl bg-gradient-to-br from-brandPrimary to-brandSecondary" />
              </div>
              <div className="leading-tight">
                <div className="font-semibold text-sm text-slate-100/90 dark:text-slate-100/90">
                  Credit Card Risk AI
                </div>
                <div className="text-xs text-slate-400">Predict default risk</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={scrollToPredict}
                className="hidden sm:inline-flex glass items-center gap-2 rounded-2xl px-4 h-11 transition hover:scale-[1.02] active:scale-[0.99]"
                type="button"
              >
                <span className="text-sm text-slate-100/90">Try Prediction</span>
              </button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 glass">
                <span className="h-2 w-2 rounded-full bg-brandPrimary" />
                <span className="text-xs text-slate-300">
                  Premium ML scoring with real-time UX
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                Credit Card Default Predictor
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Predict customer financial risk instantly using AI
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <RippleButton
                  className="h-12 px-5 rounded-2xl bg-gradient-to-r from-brandPrimary to-brandSecondary text-slate-950 font-semibold shadow-glass transition hover:brightness-110 active:brightness-95"
                  onClick={scrollToPredict}
                  disabled={loading}
                >
                  Try Prediction
                </RippleButton>

                <button
                  className="h-12 px-5 rounded-2xl glass text-slate-100/90 font-semibold transition hover:scale-[1.02] active:scale-[0.99]"
                  type="button"
                  onClick={() => {
                    document.getElementById("about")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                >
                  How it works
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-3">
                <span className="text-xs rounded-full px-3 py-1 glass">Logistic Regression</span>
                <span className="text-xs rounded-full px-3 py-1 glass">Glass UI</span>
                <span className="text-xs rounded-full px-3 py-1 glass">Recharts</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="relative"
            >
              <div className="glass rounded-3xl p-5 sm:p-6 shadow-glass">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-100/90">
                      Live Risk Dashboard
                    </div>
                    <div className="text-xs text-slate-400">SaaS-style preview</div>
                  </div>
                  <div className="rounded-2xl px-3 py-1 bg-white/5 border border-white/10 text-xs text-slate-300">
                    Ready
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    { label: "Low Risk", value: "72%", color: "from-brandPrimary" },
                    { label: "High Risk", value: "28%", color: "from-brandSecondary" },
                    { label: "Data Quality", value: "Good", color: "from-brandSecondary" },
                    { label: "Latency", value: "~120ms", color: "from-brandPrimary" },
                  ].map((card, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:scale-[1.01]"
                    >
                      <div className="text-xs text-slate-400">{card.label}</div>
                      <div className="mt-2 font-extrabold text-2xl bg-gradient-to-r from-brandPrimary to-brandSecondary bg-clip-text text-transparent">
                        {card.value}
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full w-1/2 bg-gradient-to-r ${card.color} to-transparent`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-slate-400">Sample score curve</div>
                    <div className="text-xs text-slate-400">Smooth</div>
                  </div>
                  <div className="h-[86px] rounded-xl bg-gradient-to-br from-brandPrimary/15 to-brandSecondary/10 flex items-center justify-center">
                    <svg
                      viewBox="0 0 300 90"
                      className="w-full h-full"
                      aria-hidden
                    >
                      <defs>
                        <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0" stopColor="#539B77" stopOpacity="0.95" />
                          <stop offset="1" stopColor="#C0DD73" stopOpacity="0.95" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,70 C40,55 60,35 100,42 C140,49 150,20 190,26 C230,32 250,12 300,22"
                        fill="none"
                        stroke="url(#g)"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M0,75 C40,60 60,40 100,47 C140,54 150,25 190,31 C230,37 250,17 300,27"
                        fill="none"
                        stroke="url(#g)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-5 h-24 w-24 rounded-full blur-2xl bg-brandPrimary/25" />
              <div className="absolute -top-7 -right-7 h-28 w-28 rounded-full blur-2xl bg-brandSecondary/20" />
            </motion.div>
          </div>
        </section>

        {/* Inputs */}
        <section id="predict" className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-sm text-slate-400">Input your financial details</div>
              <h2 className="text-2xl sm:text-3xl font-bold mt-1">
                Predict customer risk
              </h2>
            </div>
            <div className="hidden md:block glass rounded-2xl px-4 py-3">
              <div className="text-xs text-slate-400">Model output</div>
              <div className="text-sm font-semibold text-slate-100/90">
                0 = Low Risk • 1 = High Risk
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-3 glass rounded-3xl p-5 sm:p-6 shadow-glass"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingInput
                  label="Age"
                  icon={<FaUser size={16} />}
                  name="age"
                  value={form.age}
                  onChange={(v) => setForm((f) => ({ ...f, age: v }))}
                  step="1"
                />
                <FloatingInput
                  label="Income"
                  icon={<FaMoneyBillWave size={16} />}
                  name="income"
                  value={form.income}
                  onChange={(v) => setForm((f) => ({ ...f, income: v }))}
                  step="100"
                />
                <FloatingInput
                  label="Credit Limit"
                  icon={<FaCreditCard size={16} />}
                  name="credit_limit"
                  value={form.credit_limit}
                  onChange={(v) =>
                    setForm((f) => ({ ...f, credit_limit: v }))
                  }
                  step="100"
                />
                <FloatingInput
                  label="Bill Amount"
                  icon={<FaReceipt size={16} />}
                  name="bill_amount"
                  value={form.bill_amount}
                  onChange={(v) =>
                    setForm((f) => ({ ...f, bill_amount: v }))
                  }
                  step="100"
                />
                <FloatingInput
                  label="Previous Payments"
                  icon={<FaHistory size={16} />}
                  name="previous_payments"
                  value={form.previous_payments}
                  onChange={(v) =>
                    setForm((f) => ({ ...f, previous_payments: v }))
                  }
                  step="1"
                  min={0}
                />
                <FloatingInput
                  label="Payment Delay"
                  icon={<FaClock size={16} />}
                  name="payment_delay"
                  value={form.payment_delay}
                  onChange={(v) =>
                    setForm((f) => ({ ...f, payment_delay: v }))
                  }
                  step="1"
                  min={0}
                />
              </div>

              <div className="mt-5">
                <RippleButton
                  ref={predictBtnRef}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-brandPrimary to-brandSecondary text-slate-950 font-semibold shadow-glass transition hover:brightness-110 active:brightness-95 flex items-center justify-center gap-2"
                  onClick={handlePredict}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="h-5 w-5 rounded-full border-2 border-slate-950/40 border-t-slate-950 animate-spin"
                        aria-hidden
                      />
                      Predicting...
                    </span>
                  ) : (
                    "Predict Risk"
                  )}
                </RippleButton>

                <AnimatePresence>
                  {error ? (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="mt-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100"
                    >
                      {error}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs text-slate-400">Try example</div>
                  <button
                    className="mt-2 text-sm font-semibold text-brandSecondary hover:underline"
                    type="button"
                    onClick={() =>
                      setForm({
                        age: "45",
                        income: "80000",
                        credit_limit: "12000",
                        bill_amount: "9800",
                        previous_payments: "7",
                        payment_delay: "12",
                      })
                    }
                  >
                    Low-ish risk sample
                  </button>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs text-slate-400">Try example</div>
                  <button
                    className="mt-2 text-sm font-semibold text-brandSecondary hover:underline"
                    type="button"
                    onClick={() =>
                      setForm({
                        age: "28",
                        income: "42000",
                        credit_limit: "5500",
                        bill_amount: "7000",
                        previous_payments: "2",
                        payment_delay: "45",
                      })
                    }
                  >
                    High risk sample
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Animated Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="lg:col-span-2 space-y-4"
            >
              <div className="glass rounded-3xl p-5 sm:p-6 shadow-glass">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-100/90">
                    Insights
                  </h3>
                  <div className="text-xs text-slate-400">Updated after each prediction</div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-slate-400">Total predictions</div>
                    <div className="text-3xl font-extrabold mt-1 bg-gradient-to-r from-brandPrimary to-brandSecondary bg-clip-text text-transparent">
                      <CountUp target={totalPredictions} decimals={0} />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-slate-400">Risk %</div>
                    <div className="text-3xl font-extrabold mt-1 text-brandSecondary">
                      <CountUp target={riskPercent} decimals={0} suffix="%" />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-slate-400">Safe users %</div>
                    <div className="text-3xl font-extrabold mt-1 text-brandPrimary">
                      <CountUp target={safePercent} decimals={0} suffix="%" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-3xl p-5 sm:p-6 shadow-glass">
                <div className="text-sm font-semibold text-slate-100/90">Legend</div>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <span className="text-slate-300">Low Risk</span>
                    <span className="text-brandPrimary font-semibold">Green ✅</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <span className="text-slate-300">High Risk</span>
                    <span className="text-red-200 font-semibold">Red ❌</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.5 }}
                className="mt-8"
              >
                <PredictionResult result={result} />
                <div className="mt-6">
                  <Charts riskPercent={riskPercent} />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>

        {/* About */}
        <section id="about" className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
          <div className="glass rounded-3xl p-6 sm:p-8 shadow-glass">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold">
                  About this predictor
                </h2>
                <p className="mt-3 text-slate-300 leading-relaxed">
                  This system uses machine learning to identify risky customers before approving credit.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-xs rounded-full px-3 py-1 bg-brandPrimary/10 text-brandSecondary border border-brandPrimary/20">
                    Fast inference
                  </span>
                  <span className="text-xs rounded-full px-3 py-1 bg-brandSecondary/10 text-brandPrimary border border-brandSecondary/20">
                    Transparent probability
                  </span>
                  <span className="text-xs rounded-full px-3 py-1 bg-white/5 text-slate-200 border border-white/10">
                    CORS enabled API
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05 }}
                className="relative"
              >
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-sm font-semibold">Model pipeline</div>
                  <div className="mt-3 space-y-3">
                    {[
                      { title: "Standardize features", sub: "Scaler + stable convergence" },
                      { title: "Logistic Regression", sub: "Probabilistic default risk" },
                      { title: "Return risk score", sub: "0 low risk, 1 high risk" },
                    ].map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 hover:scale-[1.01] transition"
                      >
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brandPrimary/20 to-brandSecondary/20 border border-white/10 flex items-center justify-center font-bold text-brandSecondary">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{step.title}</div>
                          <div className="text-xs text-slate-400 mt-1">{step.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute -top-6 -left-6 h-20 w-20 blur-2xl rounded-full bg-brandSecondary/20" />
                <div className="absolute -bottom-6 -right-6 h-24 w-24 blur-2xl rounded-full bg-brandPrimary/20" />
              </motion.div>
            </div>
          </div>
        </section>

        <footer className="pb-10 text-center text-xs text-slate-400">
          Built with Flask + Logistic Regression + React + Tailwind.
        </footer>
      </div>
    </div>
  );
}

