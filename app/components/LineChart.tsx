"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

interface Props {
  data: { date_start:string; impressions: number }[];
}

const AdsLineChart: React.FC<Props> = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.date_start),
    datasets: [
      {
        label: "Daily Impressions",
        data: data.map((item) => item.impressions),
        borderColor: "blue",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default AdsLineChart;
