import { useEffect, useState } from "react";
import { getMonitors } from "../../api/monitor.api";

export default function Monitors() {
  const [monitors, setMonitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMonitors()
      .then(setMonitors)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading monitors...</p>;

  if (monitors.length === 0)
    return <p>No monitors yet.</p>;

  return (
    <ul>
      {monitors.map((m) => (
        <li key={m.id}>{m.url}</li>
      ))}
    </ul>
  );
}
