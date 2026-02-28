import { describe, it, expect } from "vitest";
import {
  clampTimeToBounds,
  compareTimes,
  is12h,
  isTimeInRanges,
  isTimeWithinBounds,
  isPm,
  hasK,
  parseFromModel,
  to12,
  to24,
  hasSeconds,
  formatTime,
} from "../helpers";
import type { InternalFormat } from "../TimePicker/types";

/* ─────────────────── is12h ─────────────────── */

describe("is12h", () => {
  it("returns true for formats with A/a/P/p", () => {
    expect(is12h("hh:mm A")).toBe(true);
    expect(is12h("h:mm a")).toBe(true);
    expect(is12h("hh:mm:ss P")).toBe(true);
    expect(is12h("hh:mm p")).toBe(true);
  });

  it("returns false for 24-hour formats", () => {
    expect(is12h("HH:mm")).toBe(false);
    expect(is12h("H:mm:ss")).toBe(false);
    expect(is12h("kk:mm")).toBe(false);
  });
});

/* ─────────────────── isPm ─────────────────── */

describe("isPm", () => {
  it("returns true for P/p tokens", () => {
    expect(isPm("hh:mm P")).toBe(true);
    expect(isPm("hh:mm p")).toBe(true);
  });

  it("returns false for A/a tokens", () => {
    expect(isPm("hh:mm A")).toBe(false);
    expect(isPm("hh:mm a")).toBe(false);
  });

  it("returns false for 24-hour formats", () => {
    expect(isPm("HH:mm")).toBe(false);
  });
});

/* ─────────────────── hasK ─────────────────── */

describe("hasK", () => {
  it("detects k and kk tokens", () => {
    expect(hasK("kk:mm")).toBe(true);
    expect(hasK("k:mm")).toBe(true);
    expect(hasK("kk:mm:ss")).toBe(true);
  });

  it("returns false for H/h formats", () => {
    expect(hasK("HH:mm")).toBe(false);
    expect(hasK("hh:mm A")).toBe(false);
  });
});

/* ─────────────────── parseFromModel ─────────────────── */

describe("parseFromModel", () => {
  it("extracts h, m, s from a standard time string", () => {
    expect(parseFromModel("14:30:00", "HH:mm:ss")).toEqual({
      h: 14,
      m: 30,
      s: 0,
    });
  });

  it("handles time without seconds", () => {
    expect(parseFromModel("09:15", "HH:mm")).toEqual({ h: 9, m: 15, s: 0 });
  });

  it("returns zeroes for null/undefined", () => {
    expect(parseFromModel(null, "HH:mm")).toEqual({ h: 0, m: 0, s: 0 });
    expect(parseFromModel(undefined, "HH:mm")).toEqual({ h: 0, m: 0, s: 0 });
  });

  it("returns zeroes for empty string", () => {
    expect(parseFromModel("", "HH:mm")).toEqual({ h: 0, m: 0, s: 0 });
  });

  it("parses midnight correctly", () => {
    expect(parseFromModel("00:00:00", "HH:mm:ss")).toEqual({
      h: 0,
      m: 0,
      s: 0,
    });
  });

  it("parses end-of-day correctly", () => {
    expect(parseFromModel("23:59:59", "HH:mm:ss")).toEqual({
      h: 23,
      m: 59,
      s: 59,
    });
  });
});

/* ─────────────────── to12 ─────────────────── */

describe("to12", () => {
  it("converts 0 (midnight) to 12", () => {
    expect(to12(0)).toBe(12);
  });

  it("converts 12 (noon) to 12", () => {
    expect(to12(12)).toBe(12);
  });

  it("converts afternoon hours", () => {
    expect(to12(13)).toBe(1);
    expect(to12(23)).toBe(11);
  });

  it("morning hours stay the same", () => {
    expect(to12(1)).toBe(1);
    expect(to12(11)).toBe(11);
  });
});

/* ─────────────────── to24 ─────────────────── */

describe("to24", () => {
  it("converts 12 AM to 0", () => {
    expect(to24(12, false)).toBe(0);
  });

  it("converts 12 PM to 12", () => {
    expect(to24(12, true)).toBe(12);
  });

  it("converts PM hours", () => {
    expect(to24(1, true)).toBe(13);
    expect(to24(11, true)).toBe(23);
  });

  it("keeps AM hours as-is", () => {
    expect(to24(1, false)).toBe(1);
    expect(to24(11, false)).toBe(11);
  });
});

/* ─────────────────── hasSeconds ─────────────────── */

describe("hasSeconds", () => {
  it("detects ss/s in format strings", () => {
    expect(hasSeconds("HH:mm:ss")).toBe(true);
    expect(hasSeconds("hh:mm:s A")).toBe(true);
  });

  it("returns false when no seconds token", () => {
    expect(hasSeconds("HH:mm")).toBe(false);
    expect(hasSeconds("hh:mm A")).toBe(false);
  });
});

/* ─────────────────── formatTime ─────────────────── */

describe("formatTime", () => {
  it("formats 24-hour with zero-padding", () => {
    expect(formatTime("HH:mm", { h: 9, m: 5, s: 0 })).toBe("09:05");
    expect(formatTime("HH:mm:ss", { h: 14, m: 30, s: 7 })).toBe("14:30:07");
  });

  it("formats 24-hour without zero-padding", () => {
    expect(formatTime("H:m", { h: 9, m: 5, s: 0 })).toBe("9:5");
  });

  it("formats 12-hour with AM", () => {
    expect(formatTime("hh:mm A", { h: 9, m: 30, s: 0 })).toBe("09:30 AM");
  });

  it("formats 12-hour with PM", () => {
    expect(formatTime("hh:mm A", { h: 14, m: 30, s: 0 })).toBe("02:30 PM");
  });

  it("formats midnight in 12-hour as 12 AM", () => {
    expect(formatTime("hh:mm A", { h: 0, m: 0, s: 0 })).toBe("12:00 AM");
  });

  it("formats noon in 12-hour as 12 PM", () => {
    expect(formatTime("hh:mm A", { h: 12, m: 0, s: 0 })).toBe("12:00 PM");
  });

  it("formats lowercase am/pm", () => {
    expect(formatTime("hh:mm a", { h: 14, m: 0, s: 0 })).toBe("02:00 pm");
  });

  it("formats k-format (1-24)", () => {
    expect(formatTime("kk:mm", { h: 0, m: 0, s: 0 })).toBe("24:00");
    expect(formatTime("kk:mm", { h: 1, m: 30, s: 0 })).toBe("01:30");
    expect(formatTime("kk:mm", { h: 23, m: 59, s: 0 })).toBe("23:59");
  });

  it("formats with seconds and AM/PM", () => {
    expect(formatTime("hh:mm:ss A", { h: 15, m: 45, s: 30 })).toBe(
      "03:45:30 PM",
    );
  });
});

/* ─────────────────── compareTimes ─────────────────── */

describe("compareTimes", () => {
  it("returns 0 for equal times", () => {
    expect(compareTimes({ h: 9, m: 30, s: 0 }, { h: 9, m: 30, s: 0 })).toBe(0);
  });

  it("returns negative when first time is earlier", () => {
    expect(compareTimes({ h: 9, m: 29, s: 59 }, { h: 9, m: 30, s: 0 })).toBe(
      -1,
    );
  });

  it("returns positive when first time is later", () => {
    expect(compareTimes({ h: 18, m: 0, s: 0 }, { h: 17, m: 59, s: 59 })).toBe(
      1,
    );
  });
});

/* ─────────────────── clampTimeToBounds ─────────────────── */

describe("clampTimeToBounds", () => {
  const min = { h: 9, m: 15, s: 0 };
  const max = { h: 17, m: 45, s: 30 };

  it("clamps times below min to min", () => {
    expect(clampTimeToBounds({ h: 8, m: 0, s: 0 }, min, max)).toEqual(min);
  });

  it("clamps times above max to max", () => {
    expect(clampTimeToBounds({ h: 23, m: 0, s: 0 }, min, max)).toEqual(max);
  });

  it("keeps in-range times unchanged", () => {
    expect(clampTimeToBounds({ h: 12, m: 30, s: 0 }, min, max)).toEqual({
      h: 12,
      m: 30,
      s: 0,
    });
  });

  it("works with only min bound", () => {
    expect(clampTimeToBounds({ h: 7, m: 0, s: 0 }, min, null)).toEqual(min);
  });

  it("works with only max bound", () => {
    expect(clampTimeToBounds({ h: 19, m: 0, s: 0 }, null, max)).toEqual(max);
  });
});

/* ─────────────────── isTimeWithinBounds ─────────────────── */

describe("isTimeWithinBounds", () => {
  const min = { h: 9, m: 15, s: 0 };
  const max = { h: 17, m: 45, s: 30 };

  it("returns false below min", () => {
    expect(isTimeWithinBounds({ h: 9, m: 14, s: 59 }, min, max)).toBe(false);
  });

  it("returns false above max", () => {
    expect(isTimeWithinBounds({ h: 17, m: 45, s: 31 }, min, max)).toBe(false);
  });

  it("returns true at boundaries", () => {
    expect(isTimeWithinBounds(min, min, max)).toBe(true);
    expect(isTimeWithinBounds(max, min, max)).toBe(true);
  });

  it("returns true with no bounds", () => {
    expect(isTimeWithinBounds({ h: 2, m: 0, s: 0 }, null, null)).toBe(true);
  });
});

/* ─────────────────── isTimeInRanges ─────────────────── */

describe("isTimeInRanges", () => {
  const ranges: Array<[InternalFormat, InternalFormat]> = [
    [
      { h: 9, m: 0, s: 0 },
      { h: 10, m: 30, s: 0 },
    ],
    [
      { h: 14, m: 0, s: 0 },
      { h: 15, m: 0, s: 0 },
    ],
  ] as const;

  it("returns true when time is inside a disabled range", () => {
    expect(isTimeInRanges({ h: 9, m: 45, s: 0 }, ranges)).toBe(true);
    expect(isTimeInRanges({ h: 15, m: 0, s: 0 }, ranges)).toBe(true);
  });

  it("returns false when time is outside all ranges", () => {
    expect(isTimeInRanges({ h: 12, m: 0, s: 0 }, ranges as any)).toBe(false);
  });
});
