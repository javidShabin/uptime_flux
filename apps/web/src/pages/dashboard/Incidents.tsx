import { useEffect, useState } from "react";
import { getIncidents } from "../../api/incident.api";
import StatusBadge from "../../components/ui/StatusBadge";

export default function Incidents() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    setLoading(true);

    getIncidents(status ? { status: status as any } : undefined)
      .then((response) => {
        const incidentsArray = Array.isArray(response)
          ? response
          : response?.data || [];

        setIncidents(incidentsArray);
      })
      .finally(() => setLoading(false));
  }, [status]);

  if (loading) return <p>Loading incidents...</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Incidents</h1>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded px-3 py-2"
        >
          <option value="">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="RESOLVED">Resolved</option>
        </select>

        {status && (
          <button
            onClick={() => setStatus("")}
            className="text-sm text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {incidents.length === 0 && (
        <p className="text-slate-400">No incidents found.</p>
      )}

      <ul className="space-y-3">
        {incidents.map((i) => (
          <li key={i.id} className="border border-slate-800 p-4 rounded">
            <div className="flex justify-between">
              <span className="font-medium">
                {i.monitorUrl || i.monitorId}
              </span>
              <StatusBadge status={i.status} />
            </div>

            <p className="text-sm text-slate-400 mt-1">
              Started: {new Date(i.startedAt).toLocaleString()}
            </p>

            {i.resolvedAt && (
              <p className="text-sm text-slate-400">
                Resolved: {new Date(i.resolvedAt).toLocaleString()}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
