import {
  Pie,
  PieChart,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";

export default function Charts({ riskPercent = 0 }) {
  const high = Math.max(0, Math.min(100, Number(riskPercent)));
  const low = 100 - high;

  const barData = [{ name: "High Risk", value: high }];
  const pieData = [
    { name: "Safe", value: low },
    { name: "Risk", value: high },
  ];

  const BAR_COLOR = "#C0DD73"; // secondary used for low-risk accents
  const RISK_COLOR = "#F43F5E";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass rounded-2xl p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-100/90 dark:text-slate-100/90">
            Risk Percentage Bar
          </h3>
          <div className="text-xs text-slate-400">Animated</div>
        </div>
        <div className="h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              layout="vertical"
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              animateNewValues
            >
              <Tooltip />
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" hide />
              <Bar dataKey="value" barSize={28} isAnimationActive fill={RISK_COLOR} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-xs text-slate-400 flex justify-between">
          <span>0%</span>
          <span>{Math.round(high)}%</span>
          <span>100%</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="glass rounded-2xl p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-100/90 dark:text-slate-100/90">
            Safe vs Risk
          </h3>
          <div className="text-xs text-slate-400">Animated</div>
        </div>
        <div className="h-[190px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={78}
                paddingAngle={2}
                isAnimationActive
              >
                <Cell key="Safe" fill={BAR_COLOR} />
                <Cell key="Risk" fill={RISK_COLOR} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: BAR_COLOR }} />
            <span>Safe: {Math.round(low)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: RISK_COLOR }} />
            <span>Risk: {Math.round(high)}%</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

