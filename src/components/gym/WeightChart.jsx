import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export default function WeightChart({
  data
}) {

  return (

    <div className="bg-white p-4 rounded-[20px] shadow-sm">

      <h5>Weight Progress</h5>

      <ResponsiveContainer
        width="100%"
        height={300}>

        <LineChart data={data}>

          <XAxis dataKey="recordedDate" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="weight"
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}