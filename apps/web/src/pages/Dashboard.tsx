import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Monitor {
  _id: string;
  name: string;
  url: string;
  status: 'up' | 'down';
  lastChecked?: string;
  uptime?: number;
}

interface Incident {
  _id: string;
  monitorId: string;
  status: 'open' | 'resolved';
  startedAt: string;
  resolvedAt?: string;
}

interface GraphDataPoint {
  time: string;
  value: number;
}

const Dashboard = () => {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMonitors: 0,
    activeMonitors: 0,
    downMonitors: 0,
    openIncidents: 0,
  });

  // Example graph data - Response Time over last 24 hours
  const responseTimeData: GraphDataPoint[] = [
    { time: '00:00', value: 120 },
    { time: '04:00', value: 95 },
    { time: '08:00', value: 150 },
    { time: '12:00', value: 180 },
    { time: '16:00', value: 140 },
    { time: '20:00', value: 110 },
    { time: '24:00', value: 125 },
  ];

  // Example graph data - Uptime percentage over last 7 days
  const uptimeData: GraphDataPoint[] = [
    { time: 'Mon', value: 99.8 },
    { time: 'Tue', value: 99.9 },
    { time: 'Wed', value: 99.5 },
    { time: 'Thu', value: 100 },
    { time: 'Fri', value: 99.7 },
    { time: 'Sat', value: 99.9 },
    { time: 'Sun', value: 100 },
  ];

  // Example graph data - Incidents per day
  const incidentsData: GraphDataPoint[] = [
    { time: 'Mon', value: 2 },
    { time: 'Tue', value: 0 },
    { time: 'Wed', value: 3 },
    { time: 'Thu', value: 0 },
    { time: 'Fri', value: 1 },
    { time: 'Sat', value: 0 },
    { time: 'Sun', value: 0 },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const [monitorsRes, incidentsRes] = await Promise.all([
        fetch('http://localhost:3000/api/v1/monitors/get', { headers }),
        fetch('http://localhost:3000/api/v1/incidents?limit=5', { headers }),
      ]);

      if (monitorsRes.ok) {
        const monitorsData = await monitorsRes.json();
        setMonitors(monitorsData || []);
        setStats(prev => ({
          ...prev,
          totalMonitors: monitorsData?.length || 0,
          activeMonitors: monitorsData?.filter((m: Monitor) => m.status === 'up')?.length || 0,
          downMonitors: monitorsData?.filter((m: Monitor) => m.status === 'down')?.length || 0,
        }));
      }

      if (incidentsRes.ok) {
        const incidentsData = await incidentsRes.json();
        setIncidents(incidentsData?.data || []);
        setStats(prev => ({
          ...prev,
          openIncidents: incidentsData?.data?.filter((i: Incident) => i.status === 'open')?.length || 0,
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-xl border border-white/15 bg-white/5 p-4 sm:p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs sm:text-sm text-white/70 font-medium">Total Monitors</h3>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{loading ? '...' : stats.totalMonitors}</p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/5 p-4 sm:p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs sm:text-sm text-white/70 font-medium">Active</h3>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{loading ? '...' : stats.activeMonitors}</p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/5 p-4 sm:p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs sm:text-sm text-white/70 font-medium">Down</h3>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{loading ? '...' : stats.downMonitors}</p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/5 p-4 sm:p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs sm:text-sm text-white/70 font-medium">Open Incidents</h3>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{loading ? '...' : stats.openIncidents}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Monitors List */}
          <div className="rounded-xl border border-white/15 bg-white/5 p-4 sm:p-6 backdrop-blur">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white">Monitors</h2>
              <button className="px-3 sm:px-4 py-2 rounded-lg bg-red-600 text-white text-xs sm:text-sm font-medium hover:bg-red-500 transition-all duration-200 whitespace-nowrap">
                + Add Monitor
              </button>
            </div>
            {loading ? (
              <div className="text-center py-6 sm:py-8 text-white/50 text-sm">Loading monitors...</div>
            ) : monitors.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-white/50">
                <p className="mb-3 sm:mb-4 text-sm sm:text-base">No monitors yet</p>
                <button className="px-3 sm:px-4 py-2 rounded-lg bg-red-600 text-white text-xs sm:text-sm font-medium hover:bg-red-500 transition-all duration-200">
                  Create your first monitor
                </button>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {monitors.slice(0, 5).map((monitor) => (
                  <div
                    key={monitor._id}
                    className="rounded-lg border border-white/10 bg-white/5 p-3 sm:p-4 hover:border-white/20 transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate text-sm sm:text-base">{monitor.name}</h3>
                        <p className="text-xs sm:text-sm text-white/60 truncate mt-1">{monitor.url}</p>
                      </div>
                      <div className="flex items-center sm:ml-4">
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            monitor.status === 'up'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {monitor.status === 'up' ? 'Up' : 'Down'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Incidents */}
          <div className="rounded-xl border border-white/15 bg-white/5 p-4 sm:p-6 backdrop-blur">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Recent Incidents</h2>
            {loading ? (
              <div className="text-center py-6 sm:py-8 text-white/50 text-sm">Loading incidents...</div>
            ) : incidents.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-white/50 text-sm sm:text-base">
                <p>No incidents yet</p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {incidents.map((incident) => (
                  <div
                    key={incident._id}
                    className="rounded-lg border border-white/10 bg-white/5 p-3 sm:p-4 hover:border-white/20 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              incident.status === 'open'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-green-500/20 text-green-400'
                            }`}
                          >
                            {incident.status === 'open' ? 'Open' : 'Resolved'}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-white/60">
                          {new Date(incident.startedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Graphs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Response Time Graph */}
          <div className="rounded-xl border border-white/15 bg-white/5 p-4 sm:p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-white">Response Time (24h)</h2>
              <span className="text-xs text-white/60">Last 24 hours</span>
            </div>
            <div className="h-48">
              <Line
                data={{
                  labels: responseTimeData.map(d => d.time),
                  datasets: [
                    {
                      label: 'Response Time (ms)',
                      data: responseTimeData.map(d => d.value),
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
              <span>Min: {Math.min(...responseTimeData.map(d => d.value))}ms</span>
              <span>Max: {Math.max(...responseTimeData.map(d => d.value))}ms</span>
              <span>Avg: {Math.round(responseTimeData.reduce((sum, d) => sum + d.value, 0) / responseTimeData.length)}ms</span>
            </div>
          </div>

          {/* Uptime Graph */}
          <div className="rounded-xl border border-white/15 bg-white/5 p-4 sm:p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-white">Uptime (7d)</h2>
              <span className="text-xs text-white/60">Last 7 days</span>
            </div>
            <div className="h-48">
              <Line
                data={{
                  labels: uptimeData.map(d => d.time),
                  datasets: [
                    {
                      label: 'Uptime (%)',
                      data: uptimeData.map(d => d.value),
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
              <span>Min: {Math.min(...uptimeData.map(d => d.value)).toFixed(1)}%</span>
              <span>Max: {Math.max(...uptimeData.map(d => d.value)).toFixed(1)}%</span>
              <span>Avg: {(uptimeData.reduce((sum, d) => sum + d.value, 0) / uptimeData.length).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Incidents Graph */}
        <div className="rounded-xl border border-white/15 bg-white/5 p-4 sm:p-6 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white">Incidents (7d)</h2>
            <span className="text-xs text-white/60">Last 7 days</span>
          </div>
          <div className="h-48">
            <Bar
              data={{
                labels: incidentsData.map(d => d.time),
                datasets: [
                  {
                    label: 'Incidents',
                    data: incidentsData.map(d => d.value),
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
            <span>Total: {incidentsData.reduce((sum, d) => sum + d.value, 0)} incidents</span>
            <span>Peak: {Math.max(...incidentsData.map(d => d.value))} incidents</span>
            <span>Days with incidents: {incidentsData.filter(d => d.value > 0).length}</span>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
