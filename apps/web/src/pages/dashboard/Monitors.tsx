import { useEffect, useState } from "react";
import { getMonitors } from "../../api/monitor.api";
import CreateMonitorModal from "../../components/monitors/CreateMonitorModal";
import MonitorCard from "../../components/monitors/MonitorCard";

export default function Monitors() {
  const [monitors, setMonitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  async function loadMonitors() {
    setLoading(true);
    const data = await getMonitors();
    // Handle response structure: could be array directly or { data: [...] }
    const monitorsArray = Array.isArray(data) ? data : data?.data || [];
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
          <p className="text-white/70 text-sm sm:text-base mb-4">
            No monitors yet
          </p>
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
            <MonitorCard
              key={monitor._id}
              monitor={monitor}
              refetch={loadMonitors}
            />
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
