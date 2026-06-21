import { describe, expect, it } from "vitest";

import {
  formatCompactNumber,
  formatCurrency,
  formatDate,
  formatDateShort,
  formatPercent,
} from "@/lib/format";

describe("formatters", () => {
  it("formats NGN currency", () => {
    expect(formatCurrency(125000, "NGN")).toMatch(/125/);
  });

  it("formats USD currency", () => {
    expect(formatCurrency(1500.5, "USD")).toMatch(/1,500/);
  });

  it("formats GBP currency", () => {
    expect(formatCurrency(2500, "GBP")).toMatch(/2,500/);
  });

  it("formats percent values", () => {
    expect(formatPercent(97.3)).toBe("97.3%");
  });

  it("formats compact numbers", () => {
    expect(formatCompactNumber(1_250_000)).toMatch(/1\.\dM/i);
  });

  it("formats ISO dates with time", () => {
    expect(formatDate("2026-06-19T14:30:00.000Z")).toMatch(/Jun 19, 2026/);
  });

  it("formats short dates without time", () => {
    expect(formatDateShort("2026-06-19T14:30:00.000Z")).toBe("Jun 19, 2026");
  });
});
