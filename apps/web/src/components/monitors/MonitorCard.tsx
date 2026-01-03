import { useState } from "react";
import EditMonitorModal from "./EditMonitorModal";

const MonitorCard = ({ monitor, refetch }: any) => {
  const [openEdit, setOpenEdit] = useState(false);

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "Never";
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UP":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "DOWN":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <>
      <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur-md p-5 sm:p-6 hover:border-white/25 hover:bg-white/8 transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-lg mb-1 truncate">
              {monitor.url}
            </h3>
            <div className="flex items-center gap-2 flex-wrap mt-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  monitor.lastStatus
                )}`}
              >
                {monitor.lastStatus}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  monitor.isActive
                    ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                    : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                }`}
              >
                {monitor.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          <button
            onClick={() => setOpenEdit(true)}
            className="ml-4 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
          >
            Edit
          </button>
        </div>

        <div className="space-y-3 mt-4 pt-4 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-white/60 text-xs mb-1">Interval</p>
              <p className="text-white font-medium">
                {formatInterval(monitor.interval)}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">Last Checked</p>
              <p className="text-white font-medium">
                {formatTime(monitor.lastCheckedAt)}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">Created</p>
              <p className="text-white font-medium">
                {formatDate(monitor.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">Updated</p>
              <p className="text-white font-medium">
                {formatDate(monitor.updatedAt)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-white/60 text-xs mb-2">Expected Status Codes</p>
            <div className="flex flex-wrap gap-2">
              {monitor.expectedStatusCodes?.map((code: number, idx: number) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-white/10 text-white text-xs font-mono border border-white/20"
                >
                  {code}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {openEdit && (
        <EditMonitorModal
          monitor={monitor}
          onClose={() => setOpenEdit(false)}
          onUpdated={refetch}
        />
      )}
    </>
  );
};

export default MonitorCard;
