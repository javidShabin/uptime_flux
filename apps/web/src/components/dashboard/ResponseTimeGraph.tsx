import React from 'react';
import { Line } from 'react-chartjs-2';

interface GraphDataPoint {
  time: string;
  value: number;
}

interface ResponseTimeGraphProps {
  data: GraphDataPoint[];
}

export default function ResponseTimeGraph({ data }: ResponseTimeGraphProps) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 p-4 sm:p-6 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white">Response Time (24h)</h2>
        <span className="text-xs text-white/60">Last 24 hours</span>
      </div>
      <div className="h-48">
        <Line
          data={{
            labels: data.map(d => d.time),
            datasets: [
              {
                label: 'Response Time (ms)',
                data: data.map(d => d.value),
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#ef4444',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
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
                },
              },
              y: {
                ticks: {
                  color: 'rgba(255, 255, 255, 0.6)',
                  font: {
                    size: 11,
                  },
                  callback: function(value) {
                    return value + 'ms';
                  },
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
        <span>Min: {Math.min(...data.map(d => d.value))}ms</span>
        <span>Max: {Math.max(...data.map(d => d.value))}ms</span>
        <span>Avg: {Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length)}ms</span>
      </div>
    </div>
  );
}

