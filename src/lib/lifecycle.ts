export type LifecycleStatus = "healthy" | "due-soon" | "overdue" | "unknown" | "retired";

export function addMonths(date: Date, months: number) {
  const next = new Date(date);
  const day = next.getDate();
  next.setMonth(next.getMonth() + months);

  if (next.getDate() !== day) {
    next.setDate(0);
  }

  return next;
}

export function getReplacementDate(
  installedDate?: string,
  replacementIntervalMonths?: number,
  manualReplacementDate?: string
) {
  if (manualReplacementDate) {
    return new Date(`${manualReplacementDate}T00:00:00`);
  }

  if (!installedDate || !replacementIntervalMonths) {
    return null;
  }

  return addMonths(new Date(`${installedDate}T00:00:00`), replacementIntervalMonths);
}

export function getLifecycleStatus(params: {
  status?: string;
  installedDate?: string;
  replacementIntervalMonths?: number;
  manualReplacementDate?: string;
  dueSoonDays?: number;
  today?: Date;
}): LifecycleStatus {
  if (params.status === "retired") {
    return "retired";
  }

  const dueSoonDays = params.dueSoonDays ?? 90;
  const today = startOfDay(params.today ?? new Date());
  const replacementDate = getReplacementDate(
    params.installedDate,
    params.replacementIntervalMonths,
    params.manualReplacementDate
  );

  if (!replacementDate) {
    return "unknown";
  }

  const replacementDay = startOfDay(replacementDate);
  const dueSoon = new Date(today);
  dueSoon.setDate(today.getDate() + dueSoonDays);

  if (replacementDay < today) {
    return "overdue";
  }

  if (replacementDay <= dueSoon) {
    return "due-soon";
  }

  return "healthy";
}

export function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function formatDate(date?: Date | null) {
  if (!date) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

