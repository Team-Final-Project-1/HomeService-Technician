type Props = {
  status: "pending" | "in_progress" | "completed";
};

const STATUS_MAP = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-700",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-700",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-700",
  },
};

export default function StatusBadge({ status }: Props) {

  const config = STATUS_MAP[status];

  if (!config) return null;

  return (
    <span
      className={`${config.className} px-3 py-1 rounded-full text-xs`}
    >
      {config.label}
    </span>
  );
}