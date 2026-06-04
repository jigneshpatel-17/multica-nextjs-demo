import { describe, expect, it } from "vitest";
import {
  EMPTY_FILTERS,
  filtersToQuery,
} from "@/components/tasks/TaskFilters";

describe("filtersToQuery", () => {
  it("returns sort only when no filters set", () => {
    expect(filtersToQuery(EMPTY_FILTERS)).toEqual({ sort: "latest" });
  });

  it("trims q and category", () => {
    const q = filtersToQuery({
      ...EMPTY_FILTERS,
      q: "  hello  ",
      category: "  work ",
    });
    expect(q.q).toBe("hello");
    expect(q.category).toBe("work");
  });

  it("converts dueBefore date input to ISO end-of-day UTC", () => {
    const q = filtersToQuery({ ...EMPTY_FILTERS, dueBefore: "2026-06-01" });
    expect(q.dueBefore).toBe("2026-06-01T23:59:59.999Z");
  });

  it("omits blank q/category and empty enums", () => {
    const q = filtersToQuery({
      ...EMPTY_FILTERS,
      q: "   ",
      category: "  ",
      status: "",
      priority: "",
    });
    expect(q).toEqual({ sort: "latest" });
  });
});
