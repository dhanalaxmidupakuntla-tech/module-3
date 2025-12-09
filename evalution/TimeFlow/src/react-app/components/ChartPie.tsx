import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { CategoryData } from "@/shared/types";

interface ChartPieProps {
  data: CategoryData[];
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

export default function ChartPie({ data }: ChartPieProps) {
  const chartData = data.map((item) => ({
    name: item.category,
    value: item.minutes,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => `${value} min (${(value / 60).toFixed(1)}h)`}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
