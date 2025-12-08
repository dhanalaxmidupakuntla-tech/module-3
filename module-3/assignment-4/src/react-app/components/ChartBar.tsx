import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { Activity } from "@/shared/types";

interface ChartBarProps {
  activities: Activity[];
}

const COLORS = [
  "#4F46E5", // Indigo
  "#7C3AED", // Purple
  "#2563EB", // Blue
  "#059669", // Green
  "#D97706", // Yellow
  "#DC2626", // Red
  "#EC4899", // Pink
  "#6B7280", // Gray
  "#0891B2", // Cyan
];

export default function ChartBar({ activities }: ChartBarProps) {
  const chartData = activities
    .map((activity) => ({
      name: activity.title.length > 20 ? activity.title.substring(0, 20) + "..." : activity.title,
      minutes: activity.minutes,
      hours: +(activity.minutes / 60).toFixed(1),
    }))
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 10); // Show top 10 activities

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={100}
        />
        <YAxis
          label={{ value: "Minutes", angle: -90, position: "insideLeft" }}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          formatter={(value: number) => `${value} min (${(value / 60).toFixed(1)}h)`}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey="minutes" radius={[8, 8, 0, 0]}>
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
