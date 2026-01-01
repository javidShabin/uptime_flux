import { useEffect, useState } from "react";
import { getMonitors } from "../../api/monitor.api";
import CreateMonitorModal from "../../components/monitors/CreateMonitorModal";

interface Monitor {
  _id: string;
  url: string;
  interval: number;
  isActive: boolean;
  lastStatus: "UP" | "DOWN" | "UNKNOWN";
  lastCheckedAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export default function Monitors() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  async function loadMonitors() {
    setLoading(true);
    const data = await getMonitors();
    setMonitors(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    loadMonitors();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  const formatInterval = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  };

  const getStatusColor = (status: string) => {
    if (status === "UP") return "bg-red-500/20 text-red-400 border-red-500/30";
    if (status === "DOWN") return "bg-red-500/30 text-red-300 border-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.4)]";
    return "bg-white/10 text-white/60 border-white/20";
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
          <p>Loading monitors...</p>
        </div>
      )}

      {!loading && monitors.length === 0 && (
        <div className="rounded-xl border border-white/15 bg-white/5 p-8 sm:p-12 backdrop-blur-md text-center">
          <p className="text-white/70 mb-4 text-sm sm:text-base">No monitors yet</p>
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
              key={monitor._id}
              className="rounded-xl border border-white/15 bg-white/5 p-4 sm:p-6 backdrop-blur-md hover:border-white/25 hover:bg-white/10 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(monitor.lastStatus)}`}
                    >
                      {monitor.lastStatus}
                    </span>
                    {monitor.isActive ? (
                      <span className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                        Active
                      </span>
                    ) : (
                      <span className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/60 border border-white/20">
                        Inactive
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-base sm:text-lg truncate">
                    {monitor.url}
                  </h3>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4">
                <div>
                  <p className="text-xs text-white/50 mb-1">Interval</p>
                  <p className="text-sm sm:text-base text-white font-medium">
                    {formatInterval(monitor.interval)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">Last Checked</p>
                  <p className="text-xs sm:text-sm text-white/70">
                    {formatDate(monitor.lastCheckedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">Created</p>
                  <p className="text-xs sm:text-sm text-white/70">
                    {new Date(monitor.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">Updated</p>
                  <p className="text-xs sm:text-sm text-white/70">
                    {new Date(monitor.updatedAt).toLocaleDateString()}
                  </p>
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
