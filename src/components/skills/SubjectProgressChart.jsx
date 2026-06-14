import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

const BAR_COLORS = ["#2563EB", "#00C853", "#7C3AED", "#F59E0B", "#EF4444", "#06B6D4"];

export default function SubjectProgressChart({ data = [] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#E2E8F0]">
      <h5 className="text-sm font-bold text-[#0F172A] mb-4 uppercase tracking-wide">
        Subject Progress
      </h5>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barSize={28}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="subject" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#0F172A", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }}
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
          />
          <Bar dataKey="progress" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}