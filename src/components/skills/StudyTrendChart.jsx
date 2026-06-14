import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function StudyTrendChart({ data = [] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#E2E8F0]">
      <h5 className="text-sm font-bold text-[#0F172A] mb-4 uppercase tracking-wide">
        Study Hours Trend
      </h5>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#0F172A", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }}
            cursor={{ stroke: "#00C853", strokeWidth: 1 }}
          />
          <Line
            type="monotone"
            dataKey="hours"
            stroke="#00C853"
            strokeWidth={2.5}
            dot={{ fill: "#00C853", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}