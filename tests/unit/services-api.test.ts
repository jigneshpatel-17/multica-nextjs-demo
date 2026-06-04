import { describe, expect, it } from "vitest";
import { buildQuery } from "@/services/api";

describe("buildQuery", () => {
  it("returns empty string when all values are empty", () => {
    expect(buildQuery({ a: undefined, b: null, c: "" })).toBe("");
  });

  it("encodes string and number values", () => {
    expect(buildQuery({ page: 2, q: "hi" })).toBe("?page=2&q=hi");
  });

  it("skips null/undefined/empty keys", () => {
    expect(buildQuery({ a: 1, b: null, c: undefined, d: "" })).toBe("?a=1");
  });

  it("preserves boolean as string", () => {
    expect(buildQuery({ flag: true })).toBe("?flag=true");
  });
});
