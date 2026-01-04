type Props = {
  status: string;
};

export default function StatusBadge({ status }: Props) {
  const styles =
    status === "OPEN" || status === "DOWN"
      ? "bg-red-600"
      : status === "RESOLVED" || status === "UP"
      ? "bg-green-600"
      : "bg-yellow-600";

  return (
    <span
      className={`px-2 py-1 text-xs rounded text-white ${styles}`}
    >
      {status}
    </span>
  );
}
