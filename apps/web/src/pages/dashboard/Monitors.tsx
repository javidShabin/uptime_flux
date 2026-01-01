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
    setMonitors(data);
    setLoading(false);
  }

  useEffect(() => {
    loadMonitors();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Monitors</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-indigo-600 px-4 py-2 rounded"
        >
          Add Monitor
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && monitors.length === 0 && (
        <p>No monitors yet.</p>
      )}

      {!loading && monitors.length > 0 && (
        <ul>
          {monitors.map((m) => (
            <li key={m.id}>{m.url}</li>
          ))}
        </ul>
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
