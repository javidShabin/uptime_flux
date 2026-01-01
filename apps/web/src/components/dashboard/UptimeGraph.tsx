import React from 'react';
import { Line } from 'react-chartjs-2';

interface GraphDataPoint {
  time: string;
  value: number;
}

interface UptimeGraphProps {
  data: GraphDataPoint[];
}

export default function UptimeGraph({ data }: UptimeGraphProps) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 p-4 sm:p-6 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white">Uptime (7d)</h2>
        <span className="text-xs text-white/60">Last 7 days</span>
      </div>
      <div className="h-48">
        <Line
          data={{
            labels: data.map(d => d.time),
            datasets: [
              {
                label: 'Uptime (%)',
                data: data.map(d => d.value),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#10b981',
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
                callbacks: {
                  label: function(context) {
                    return (context.parsed.y || 0).toFixed(1) + '%';
                  },
                },
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
                min: 99,
                max: 100.5,
                ticks: {
                  color: 'rgba(255, 255, 255, 0.6)',
                  font: {
                    size: 11,
                  },
                  callback: function(value) {
                    return value + '%';
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
        <span>Min: {Math.min(...data.map(d => d.value)).toFixed(1)}%</span>
        <span>Max: {Math.max(...data.map(d => d.value)).toFixed(1)}%</span>
        <span>Avg: {(data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1)}%</span>
      </div>
    </div>
  );
}

