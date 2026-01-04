interface Props {
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteMonitorModal({
  onConfirm,
  onCancel,
  loading,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-slate-900 border border-white/15 rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-white mb-2">
          Delete Monitor
        </h2>

        <p className="text-sm text-white/70 mb-6">
          Are you sure? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
