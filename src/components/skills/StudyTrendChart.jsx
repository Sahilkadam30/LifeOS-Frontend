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

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[280px] text-[#94A3B8]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m6 0h6m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v10m6 0v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4" />
          </svg>
          <p className="text-sm font-medium">No study data yet</p>
          <p className="text-xs mt-1">Log study sessions to see your weekly trend</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis
              dataKey="week"
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
              cursor={{ stroke: "#00C853", strokeWidth: 1 }}
              formatter={(value) => [`${value} hrs`, "Study Hours"]}
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
      )}
    </div>
  );
}