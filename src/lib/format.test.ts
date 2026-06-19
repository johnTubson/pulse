import { describe, expect, it } from "vitest";

import { formatCurrency, formatPercent } from "@/lib/format";

describe("formatters", () => {
  it("formats NGN currency", () => {
    expect(formatCurrency(125000, "NGN")).toMatch(/125/);
  });

  it("formats percent values", () => {
    expect(formatPercent(97.3)).toBe("97.3%");
  });
});
