import type { LifecycleStatus } from "@/lib/lifecycle";

const statusClass: Record<string, string> = {
  healthy: "green",
  "due-soon": "amber",
  overdue: "red",
  unknown: "",
  retired: "",
  active: "green",
  "expiring soon": "amber",
  expired: "red",
  onboarding: "blue",
  managed: "blue"
};

export function StatusPill({ label, status }: { label: string; status: string | LifecycleStatus }) {
  return (
    <span className={`pill ${statusClass[status] ?? ""}`}>
      <span className="dot" />
      {label}
    </span>
  );
}

