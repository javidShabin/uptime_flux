type Props = {
    status: string
    onStatusChange: (v:string) => void
    onClear: () => void
}

export default function IncidentFilters({
  status,
  onStatusChange,
  onClear,
}: Props) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="bg-slate-900 border border-slate-700 rounded px-3 py-2"
      >
        <option value="">All statuses</option>
        <option value="OPEN">Open</option>
        <option value="RESOLVED">Resolved</option>
      </select>

      <button
        onClick={onClear}
        className="text-sm text-slate-400 hover:text-white"
      >
        Clear
      </button>
    </div>
  );
}