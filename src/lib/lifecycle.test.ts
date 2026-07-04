import { describe, expect, it } from "vitest";
import { getCompletionPercent } from "./completeness";
import { getLifecycleStatus, getReplacementDate } from "./lifecycle";

describe("lifecycle calculations", () => {
  it("calculates replacement dates from installed date and interval", () => {
    expect(getReplacementDate("2023-06-12", 36)?.toISOString().slice(0, 10)).toBe("2026-06-12");
  });

  it("marks overdue assets", () => {
    expect(
      getLifecycleStatus({
        installedDate: "2023-06-12",
        replacementIntervalMonths: 36,
        today: new Date("2026-07-04T00:00:00")
      })
    ).toBe("overdue");
  });

  it("marks due soon assets", () => {
    expect(
      getLifecycleStatus({
        installedDate: "2022-08-01",
        replacementIntervalMonths: 48,
        today: new Date("2026-07-04T00:00:00"),
        dueSoonDays: 90
      })
    ).toBe("due-soon");
  });

  it("hides retired assets from normal lifecycle urgency", () => {
    expect(getLifecycleStatus({ status: "retired", installedDate: "2020-01-01", replacementIntervalMonths: 36 })).toBe(
      "retired"
    );
  });
});

describe("documentation completeness", () => {
  it("computes a rounded completion percentage", () => {
    expect(
      getCompletionPercent([
        { key: "contacts", label: "Contacts", completed: 1, required: 1 },
        { key: "hardware", label: "Hardware", completed: 1, required: 3 }
      ])
    ).toBe(50);
  });
});
