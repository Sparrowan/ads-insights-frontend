"use client"; // 🔥 This ensures it runs on the client side

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { date_start:string; impressions: number }[];
}

const AdsBarChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date_start" tick={{ fill: "#8884d8" }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="impressions"
          fill="#4A90E2"
          barSize={40}
          radius={[5, 5, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AdsBarChart;
