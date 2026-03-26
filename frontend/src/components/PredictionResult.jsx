import { motion } from "framer-motion";

export default function PredictionResult({ result }) {
  if (!result) return null;

  const isHigh = result.prediction === 1;
  const riskProb = Number(result.probability) * 100; // P(high risk)
  const safeProb = (1 - Number(result.probability)) * 100;
  const riskPercent = Math.round(riskProb);
  const pHigh = Number(result.probability);

  const tone = isHigh
    ? {
        border: "border-red-500/30",
        ring: "ring-red-500/20",
        title: "High Risk",
        desc: "This customer is more likely to default.",
        badgeBg: "bg-red-500/15",
        badgeText: "text-red-200",
        barFrom: "from-red-500",
        barTo: "to-brandSecondary",
      }
    : {
        border: "border-brandPrimary/35",
        ring: "ring-brandPrimary/20",
        title: "Low Risk",
        desc: "This customer looks safer based on the model.",
        badgeBg: "bg-brandPrimary/15",
        badgeText: "text-brandSecondary",
        barFrom: "from-brandPrimary",
        barTo: "to-brandSecondary",
      };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className={`glass rounded-2xl p-5 md:p-6 shadow-glass border ${tone.border} ${tone.ring}`}
      style={{
        boxShadow: isHigh
          ? "0 0 0 1px rgba(244,63,94,0.12), 0 12px 44px rgba(244,63,94,0.18)"
          : "0 0 0 1px rgba(83,155,119,0.12), 0 12px 44px rgba(83,155,119,0.16)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${tone.badgeBg} ${tone.badgeText}`}>
            <span className="font-semibold">{tone.title}</span>
          </div>
          <h3 className="mt-3 text-xl md:text-2xl font-bold">
            {isHigh ? (
              <span className="text-red-200">High likelihood of default</span>
            ) : (
              <span className="text-brandSecondary">Low likelihood of default</span>
            )}
          </h3>
          <p className="mt-2 text-sm text-slate-400">{tone.desc}</p>
        </div>

        <div className="text-right">
          <div className="text-3xl font-extrabold tracking-tight">
            {riskPercent}%
          </div>
          <div className="text-xs text-slate-400">High-risk probability</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Risk progress</span>
          <span>
            Safe: {Math.round(safeProb)}% • Risk: {riskPercent}%
          </span>
        </div>
        <div className="h-3.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${tone.barFrom} ${tone.barTo} transition-all`}
            initial={{ width: "0%" }}
            animate={{ width: `${Math.max(0, Math.min(100, riskProb))}%` }}
            transition={{ duration: 1.05, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="text-xs text-slate-400">Prediction</div>
          <div className="font-semibold mt-1 text-slate-100">
            {isHigh ? "1 → High Risk" : "0 → Low Risk"}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="text-xs text-slate-400">Probability</div>
          <div className="font-semibold mt-1 text-slate-100">
            {pHigh.toFixed(2)}{" "}
            <span className="text-slate-400 text-xs font-medium">
              ({riskPercent}% high risk)
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

