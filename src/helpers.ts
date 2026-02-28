// helpers.ts

import { InternalFormat } from "./TimePicker/types";

function toSeconds(time: InternalFormat): number {
  return time.h * 3600 + time.m * 60 + time.s;
}

/** Check if format uses 12-hour clock (h or hh) */
export function is12h(fmt: string): boolean {
  return /(a|A|p|P)/.test(fmt);
}

export function isPm(fmt: string): boolean {
  return /(p|P)/.test(fmt);
}

export function hasK(fmt: string): boolean {
  return /k{1,2}/.test(fmt);
}

/** Parse time string into { h, m, s } numbers */
export function parseFromModel(
  str: string | null | undefined,
  fmt: string,
): { h: number; m: number; s: number } {
  if (!str || typeof str !== "string") return { h: 0, m: 0, s: 0 };

  const nums = str.match(/\d+/g) || []; // extract numbers

  let h = nums[0] !== undefined ? +nums[0] : 0;
  const m = +nums[1] || 0;
  const s = +nums[2] || 0;
  return { h, m, s };
}

export function to12(h24: number) {
  const v = h24 % 12;
  return v === 0 ? 12 : v;
}

export function to24(h12: number, isPM: boolean) {
  return isPM ? (h12 % 12) + 12 : h12 % 12;
}

export function hasSeconds(fmt: string) {
  return /(s|ss)/.test(fmt);
}

export function formatTime(fmt: string, time: InternalFormat) {
  let { h, m, s } = time;

  const is12hFormat = is12h(fmt);

  const apm = h >= 12 ? "PM" : "AM";
  if (is12hFormat) {
    h = to12(h);
  }

  const kVal = h === 0 ? 24 : h;

  const map: Record<string, string> = {
    HH: String(h).padStart(2, "0"),
    H: String(h),
    hh: String(h).padStart(2, "0"),
    h: String(h),
    kk: String(kVal).padStart(2, "0"),
    k: String(kVal),
    mm: String(m).padStart(2, "0"),
    m: String(m),
    ss: String(s).padStart(2, "0"),
    s: String(s),
    A: apm,
    a: apm.toLowerCase(),
    P: apm,
    p: apm.toLowerCase(),
  };
  return fmt.replace(/HH|hh|kk|mm|ss|H|h|k|m|s|A|a|P|p/g, (t) => map[t] ?? t);
}

export function compareTimes(a: InternalFormat, b: InternalFormat): number {
  return toSeconds(a) - toSeconds(b);
}

export function clampTimeToBounds(
  time: InternalFormat,
  minTime?: InternalFormat | null,
  maxTime?: InternalFormat | null,
): InternalFormat {
  if (minTime && compareTimes(time, minTime) < 0) return { ...minTime };
  if (maxTime && compareTimes(time, maxTime) > 0) return { ...maxTime };
  return { ...time };
}

export function isTimeWithinBounds(
  time: InternalFormat,
  minTime?: InternalFormat | null,
  maxTime?: InternalFormat | null,
): boolean {
  if (minTime && compareTimes(time, minTime) < 0) return false;
  if (maxTime && compareTimes(time, maxTime) > 0) return false;
  return true;
}

export function isTimeInRanges(
  time: InternalFormat,
  ranges: Array<[InternalFormat, InternalFormat]>,
): boolean {
  return ranges.some(([start, end]) => {
    return compareTimes(time, start) >= 0 && compareTimes(time, end) <= 0;
  });
}
