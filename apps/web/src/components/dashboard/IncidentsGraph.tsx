import React from "react";
import { Bar } from "react-chartjs-2";
import { baseChartOptions } from "../../charts/baseOptions";

interface GraphDataPoint {
  time: string;
  value: number;
}

interface IncidentsGraphProps {
  data: GraphDataPoint[];
}

export default function IncidentsGraph({ data }: IncidentsGraphProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-white/15 bg-white/5 p-6 text-white/60">
        No incident data available
      </div>
    );
  }

  const chartData = React.useMemo(
    () => ({
      labels: data.map(d => d.time),
      datasets: [
        {
          label: "Incidents",
          data: data.map(d => d.value),
          backgroundColor: "rgba(249, 115, 22, 0.8)",
          borderColor: "#f97316",
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    }),
    [data]
  );

  const options = {
    ...baseChartOptions,
    scales: {
      x: {
        ticks: { color: "rgba(255,255,255,0.6)", font: { size: 11 } },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: "rgba(255,255,255,0.6)",
          font: { size: 11 },
        },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  const total = data.reduce((s, d) => s + d.value, 0);
  const peak = Math.max(...data.map(d => d.value));
  const daysWithIncidents = data.filter(d => d.value > 0).length;

  return (
    <div className="rounded-xl border border-white/15 bg-white/5 p-4 sm:p-6 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white">Incidents (7d)</h2>
        <span className="text-xs text-white/60">Last 7 days</span>
      </div>

      <div className="h-48">
        <Bar data={chartData} options={options} />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-white/50">
        <span>Total: {total}</span>
        <span>Peak: {peak}</span>
        <span>Days: {daysWithIncidents}</span>
      </div>
    </div>
  );
}
