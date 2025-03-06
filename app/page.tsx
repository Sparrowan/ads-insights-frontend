"use client";
import { useAdsInsights } from "./hooks/useAdsInsights";
import { useSocket } from "./hooks/useSocket";
import AdsBarChart from "./components/BarChart";
import AdsLineChart from "./components/LineChart";
import D3LineChart from "./components/D3LineChart";

export default function Home() {
  const { adsData } = useAdsInsights();
  const { realTimeData } = useSocket();
  const chartData = realTimeData || adsData;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">📊 Ads Insights Dashboard</h1>

      <h2 className="mt-4 text-lg font-semibold">D3.js Line Chart</h2>
      <D3LineChart data={chartData} />

      <h2 className="mt-4 text-lg font-semibold">Recharts Bar Chart</h2>
      <AdsBarChart data={chartData} />

      <h2 className="mt-4 text-lg font-semibold">Chart.js Line Chart</h2>
      <AdsLineChart data={chartData} />
    </div>
  );
}
