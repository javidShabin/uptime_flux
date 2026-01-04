import { useState } from "react";
import { createMonitor } from "../../api/monitor.api";
import toast from "react-hot-toast";

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateMonitorModal({
  onClose,
  onCreated,
}: Props) {
  const [url, setUrl] = useState("");
  const [interval, setInterval] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createMonitor({ url, interval });
        toast.success("New monitor added")
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create monitor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-6 rounded-lg w-full max-w-md"
      >
        <h2 className="text-lg font-semibold mb-4">Create Monitor</h2>

        <input
          className="w-full mb-3 p-2 rounded bg-slate-800"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />

        <input
          type="number"
          className="w-full mb-3 p-2 rounded bg-slate-800"
          value={interval}
          onChange={(e) => setInterval(Number(e.target.value))}
          min={30}
        />

        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose}>
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 px-4 py-2 rounded"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
