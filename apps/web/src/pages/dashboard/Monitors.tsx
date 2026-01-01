import { useEffect, useState } from "react";
import { getMonitors } from "../../api/monitor.api";
import CreateMonitorModal from "../../components/monitors/CreateMonitorModal";

export default function Monitors() {
  const [monitors, setMonitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  async function loadMonitors() {
    setLoading(true);
    const data = await getMonitors();
    // Handle response structure: could be array directly or { data: [...] }
    const monitorsArray = Array.isArray(data) ? data : (data?.data || []);
    setMonitors(monitorsArray);
    setLoading(false);
  }

  useEffect(() => {
    loadMonitors();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const formatInterval = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Monitors</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-red-600 text-white text-sm sm:text-base font-semibold hover:bg-red-500 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] whitespace-nowrap"
        >
          + Add Monitor
        </button>
      </div>

      {loading && (
        <div className="text-center py-12 text-white/50">
          <p className="text-sm sm:text-base">Loading monitors...</p>
        </div>
      )}

      {!loading && monitors.length === 0 && (
        <div className="rounded-xl border border-white/15 bg-white/5 p-8 sm:p-12 backdrop-blur-md text-center">
          <p className="text-white/70 text-sm sm:text-base mb-4">No monitors yet</p>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-red-600 text-white text-sm sm:text-base font-semibold hover:bg-red-500 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
          >
            Create your first monitor
          </button>
        </div>
      )}

      {!loading && monitors.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {monitors.map((monitor) => (
            <div
              key={monitor._id || monitor.id}
              className="rounded-xl border border-white/15 bg-white/5 p-4 sm:p-6 backdrop-blur-md hover:border-white/25 hover:bg-white/10 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-base sm:text-lg mb-1 truncate">
                    {monitor.url}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                        monitor.lastStatus === "UP"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                          : monitor.lastStatus === "DOWN"
                          ? "bg-red-500/25 text-red-400 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      }`}
                    >
                      {monitor.lastStatus || "UNKNOWN"}
                    </span>
                    {monitor.isActive ? (
                      <span className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                        Active
                      </span>
                    ) : (
                      <span className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-400 border border-slate-500/30">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-3 flex-shrink-0">
                  {monitor.lastStatus === "UP" ? (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  ) : monitor.lastStatus === "DOWN" ? (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-red-500/25 flex items-center justify-center border border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.35)]">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/40">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-white/60">Last Checked</span>
                  <span className="text-white/80 font-medium">
                    {monitor.lastCheckedAt ? formatTime(monitor.lastCheckedAt) : "Never"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-white/60">Check Interval</span>
                  <span className="text-white/80 font-medium">
                    {monitor.interval ? formatInterval(monitor.interval) : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-white/60">Created</span>
                  <span className="text-white/80 font-medium">
                    {monitor.createdAt ? formatTime(monitor.createdAt) : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateMonitorModal
          onClose={() => setShowCreate(false)}
          onCreated={loadMonitors}
        />
      )}
    </div>
  );
}
