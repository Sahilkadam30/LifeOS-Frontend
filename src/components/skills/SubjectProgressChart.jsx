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

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[280px] text-[#94A3B8]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-sm font-medium">No subjects found</p>
          <p className="text-xs mt-1">Add subjects and log study sessions to see progress</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="subject"
              tick={{ fontSize: 12, fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "#0F172A",
                border: "none",
                borderRadius: 8,
                color: "#fff",
                fontSize: 12,
              }}
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
              formatter={(value) => [`${value} hrs`, "Total Hours"]}
            />
            <Bar dataKey="progress" radius={[6, 6, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}