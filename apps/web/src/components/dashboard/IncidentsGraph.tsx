import React from 'react';
import { Bar } from 'react-chartjs-2';

interface GraphDataPoint {
  time: string;
  value: number;
}

interface IncidentsGraphProps {
  data: GraphDataPoint[];
}

export default function IncidentsGraph({ data }: IncidentsGraphProps) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 p-4 sm:p-6 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white">Incidents (7d)</h2>
        <span className="text-xs text-white/60">Last 7 days</span>
      </div>
      <div className="h-48">
        <Bar
          data={{
            labels: data.map(d => d.time),
            datasets: [
              {
                label: 'Incidents',
                data: data.map(d => d.value),
                backgroundColor: 'rgba(249, 115, 22, 0.8)',
                borderColor: '#f97316',
                borderWidth: 2,
                borderRadius: 4,
                borderSkipped: false,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
              },
            },
            scales: {
              x: {
                ticks: {
                  color: 'rgba(255, 255, 255, 0.6)',
                  font: {
                    size: 11,
                  },
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.05)',
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  color: 'rgba(255, 255, 255, 0.6)',
                  font: {
                    size: 11,
                  },
                  stepSize: 1,
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.05)',
                },
              },
            },
          }}
        />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-white/50">
        <span>Total: {data.reduce((sum, d) => sum + d.value, 0)} incidents</span>
        <span>Peak: {Math.max(...data.map(d => d.value))} incidents</span>
        <span>Days with incidents: {data.filter(d => d.value > 0).length}</span>
      </div>
    </div>
  );
}

