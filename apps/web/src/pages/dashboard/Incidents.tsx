import { useEffect, useState } from "react";
import { getIncidents } from "../../api/incident.api";
import StatusBadge from "../../components/ui/StatusBadge";

export default function Incidents() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIncidents()
      .then((response) => {
        // Handle response structure: could be array directly or { data: [...] }
        const incidentsArray = Array.isArray(response) ? response : (response?.data || []);
        setIncidents(incidentsArray);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading incidents...</p>;

  if (incidents.length === 0) {
    return <p>No incidents recorded 🎉</p>;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Incidents</h1>

      <ul className="space-y-3">
        {incidents.map((i) => (
          <li key={i.id} className="border border-slate-800 p-4 rounded">
            <div className="flex justify-between">
              <span className="font-medium">{i.monitorUrl}</span>
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
