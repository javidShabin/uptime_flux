import React from "react";
import { Line } from "react-chartjs-2";
import { baseChartOptions } from "../../charts/baseOptions"

interface GraphDataPoint {
  time: string;
  value: number;
}

interface ResponseTimeGraphProps {
  data: GraphDataPoint[];
}

export default function ResponseTimeGraph({ data }: ResponseTimeGraphProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-white/15 bg-white/5 p-6 text-white/60">
        No response time data available
      </div>
    );
  }

  const chartData = React.useMemo(
    () => ({
      labels: data.map(d => d.time),
      datasets: [
        {
          label: "Response Time (ms)",
          data: data.map(d => d.value),
          borderColor: "#ef4444",
          backgroundColor: "rgba(239,68,68,0.1)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "#ef4444",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
        },
      ],
    }),
    [data]
  );

  const options: any = {
    ...baseChartOptions,
    scales: {
      x: {
        ticks: { color: "rgba(255,255,255,0.6)", font: { size: 11 } },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "rgba(255,255,255,0.6)",
          font: { size: 11 },
          callback: function(value: number | string) {
            return typeof value === 'number' ? `${value}ms` : value;
          },
        },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  const min = Math.min(...data.map(d => d.value));
  const max = Math.max(...data.map(d => d.value));
  const avg = Math.round(data.reduce((s, d) => s + d.value, 0) / data.length);

  return (
    <div className="rounded-xl border border-white/15 bg-white/5 p-4 sm:p-6 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          Response Time (24h)
        </h2>
        <span className="text-xs text-white/60">Last 24 hours</span>
      </div>

      <div className="h-48">
        <Line data={chartData} options={options} />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-white/50">
        <span>Min: {min}ms</span>
        <span>Max: {max}ms</span>
        <span>Avg: {avg}ms</span>
      </div>
    </div>
  );
}
