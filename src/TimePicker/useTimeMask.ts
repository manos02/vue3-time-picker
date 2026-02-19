/**
 * useTimeMask – composable that turns a plain <input> into a formatted
 * time-entry field.  As the user types digits the mask auto-inserts ":"
 * separators, clamps each segment to valid ranges, and handles AM/PM
 * toggling via the "a" / "p" keys.
 *
 * Supports every format accepted by FORMAT_SHAPE:
 *   HH:mm  H:mm  hh:mm  h:mm  kk:mm  k:mm   (and with :ss / :s)
 *   …plus optional  A | a | P | p  suffix for 12-hour display
 */

import { ref, computed, nextTick, type Ref, type ComputedRef } from "vue";
import { FORMAT_SHAPE } from "./types";
import type { InternalFormat } from "./types";
import { is12h, hasK } from "../helpers";

/* ──────────────────────────────────────────────────────────
 * Internal types
 * ────────────────────────────────────────────────────────── */

interface DigitGroup {
  token: string;
  min: number;
  max: number;
}

interface ParsedMaskFormat {
  digitGroups: DigitGroup[];
  hasAmPm: boolean;
  ampmLowercase: boolean;
}

/* ──────────────────────────────────────────────────────────
 * Format parsing
 * ────────────────────────────────────────────────────────── */

function parseMaskFormat(fmt: string): ParsedMaskFormat {
  const match = FORMAT_SHAPE.exec(fmt);
  if (!match) throw new Error(`[useTimeMask] Invalid format: ${fmt}`);

  const [, hourToken, minuteToken, secondToken, ampmToken] = match;
  const digitGroups: DigitGroup[] = [];

  // Hour range depends on 12h / k / 24h mode
  const use12h = !!ampmToken;
  const useK = /^k{1,2}$/.test(hourToken);

  let hourMin = 0;
  let hourMax = 23;
  if (use12h) {
    hourMin = 1;
    hourMax = 12;
  } else if (useK) {
    hourMin = 1;
    hourMax = 24;
  }

  digitGroups.push({ token: hourToken, min: hourMin, max: hourMax });
  digitGroups.push({ token: minuteToken, min: 0, max: 59 });

  if (secondToken) {
    digitGroups.push({ token: secondToken, min: 0, max: 59 });
  }

  return {
    digitGroups,
    hasAmPm: !!ampmToken,
    ampmLowercase: ampmToken === 'a' || ampmToken === 'p',
  };
}

/* ──────────────────────────────────────────────────────────
 * Composable
 * ────────────────────────────────────────────────────────── */

export function useTimeMask(format: Ref<string> | ComputedRef<string>) {
  const parsed = computed(() => parseMaskFormat(format.value));
  const totalDigits = computed(() => parsed.value.digitGroups.length * 2);

  /** Individual entered digits (always slot-width 2 per group) */
  const rawDigits = ref<number[]>([]);
  const ampm = ref<"AM" | "PM">("AM");
  /** Reactive display value – bind with  :value="inputValue"  */
  const inputValue = ref("");

  /* ── Rendering ─────────────────────────────────────── */

  function render(): string {
    const { digitGroups, hasAmPm: showAmPm } = parsed.value;
    let out = "";
    let di = 0; // index into rawDigits

    for (let g = 0; g < digitGroups.length; g++) {
      for (let d = 0; d < 2; d++) {
        if (di < rawDigits.value.length) {
          out += String(rawDigits.value[di]);
          di++;
        }
      }
      // Colon after a fully-entered group (except the last digit-group)
      if (di === (g + 1) * 2 && g < digitGroups.length - 1) {
        out += ":";
      }
    }

    // AM/PM suffix once every digit slot has been filled
    if (showAmPm && di >= totalDigits.value) {
      const label = parsed.value.ampmLowercase
        ? ampm.value.toLowerCase()
        : ampm.value;
      out += " " + label;
    }

    return out;
  }

  /* ── Validation / clamping ─────────────────────────── */

  function clampGroup(groupIndex: number): void {
    const offset = groupIndex * 2;
    if (rawDigits.value.length < offset + 2) return;

    const val = rawDigits.value[offset] * 10 + rawDigits.value[offset + 1];
    const { min, max } = parsed.value.digitGroups[groupIndex];
    const clamped = Math.max(min, Math.min(max, val));

    if (clamped !== val) {
      rawDigits.value[offset] = Math.floor(clamped / 10);
      rawDigits.value[offset + 1] = clamped % 10;
    }
  }

  function clampAllGroups(): void {
    for (let g = 0; g < parsed.value.digitGroups.length; g++) {
      clampGroup(g);
    }
  }

  /* ── Cursor ↔ digit-index mapping ────────────────── */

  /** How many digits appear before a given display-string position */
  function displayPosToDigitIndex(pos: number): number {
    const rendered = render();
    let di = 0;
    for (let i = 0; i < Math.min(pos, rendered.length); i++) {
      if (/\d/.test(rendered[i])) di++;
    }
    return di;
  }

  /** Display-string position of the Nth digit (0-based) */
  function digitIndexToDisplayPos(di: number): number {
    // Each 2-digit group is followed by a ":" except the last one.
    // digit 0→pos 0, 1→1, 2→3, 3→4, 4→6, 5→7 …
    return di + Math.floor(di / 2);
  }

  /* ── Smart digit replacement (overwrite-only) ─────── */

  function replaceDigitAt(pos: number, digit: number): number {
    if (pos >= totalDigits.value) return totalDigits.value;
    const next = [...rawDigits.value];
    next[pos] = digit;
    rawDigits.value = next;
    const groupIdx = Math.floor(pos / 2);
    clampGroup(groupIdx);
    // Skip past colon positions — advance to next digit
    return Math.min(pos + 1, totalDigits.value);
  }

  /* ── DOM helpers ───────────────────────────────────── */

  function syncDom(el: HTMLInputElement, cursorDigitIndex?: number): void {
    const s = render();
    inputValue.value = s;
    el.value = s;

    // Place cursor at the display position of the given digit index,
    // or at the end if not specified.
    const pos =
      cursorDigitIndex !== undefined
        ? Math.min(digitIndexToDisplayPos(cursorDigitIndex), s.length)
        : s.length;

    el.selectionStart = el.selectionEnd = pos;

    nextTick(() => {
      if (document.activeElement === el) {
        el.selectionStart = el.selectionEnd = pos;
      }
    });
  }

  /* ── Event handlers ────────────────────────────────── */

  function handleKeydown(e: KeyboardEvent): void {
    const key = e.key;
    const el = e.target as HTMLInputElement;

    // Let through navigation & system shortcuts
    if (
      ["Tab", "Escape", "ArrowLeft", "ArrowRight", "Home", "End"].includes(
        key,
      ) ||
      e.metaKey ||
      e.ctrlKey
    )
      return;

    e.preventDefault();

    const cursorPos = el.selectionStart ?? 0;
    const digitAtCursor = displayPosToDigitIndex(cursorPos);

    // ── Backspace → move cursor left (no erasing) ──
    if (key === "Backspace") {
      if (digitAtCursor > 0) {
        syncDom(el, digitAtCursor - 1);
      }
      return;
    }

    // ── Delete → ignore (no erasing) ──
    if (key === "Delete") {
      return;
    }

    // ── AM / PM toggle ──
    if (parsed.value.hasAmPm) {
      const lower = key.toLowerCase();
      if (lower === "a") {
        ampm.value = "AM";
        syncDom(el, digitAtCursor);
        return;
      }
      if (lower === "p") {
        ampm.value = "PM";
        syncDom(el, digitAtCursor);
        return;
      }
    }

    // ── Digit → overwrite at cursor position ──
    if (/^\d$/.test(key)) {
      const newIdx = replaceDigitAt(digitAtCursor, +key);
      syncDom(el, newIdx);
      return;
    }

    // Everything else → ignore
  }

  /** Safety-net: normalise whatever ended up in the input (autocomplete,
   *  voice input, IME, etc.) */
  function handleInput(e: Event): void {
    const el = e.target as HTMLInputElement;
    const digits = el.value
      .replace(/\D/g, "")
      .split("")
      .map(Number)
      .slice(0, totalDigits.value);

    rawDigits.value = digits;
    clampAllGroups();

    if (parsed.value.hasAmPm) {
      if (/p/i.test(el.value)) ampm.value = "PM";
      else if (/a/i.test(el.value)) ampm.value = "AM";
    }

    syncDom(el);
  }

  function handlePaste(e: ClipboardEvent): void {
    e.preventDefault();
    const text = e.clipboardData?.getData("text") ?? "";
    const el = e.target as HTMLInputElement;
    const cursorPos = el.selectionStart ?? 0;

    const digits = text.replace(/\D/g, "").split("").map(Number);
    let pos = displayPosToDigitIndex(cursorPos);
    for (const d of digits) {
      if (pos >= totalDigits.value) break;
      pos = replaceDigitAt(pos, d);
    }

    if (parsed.value.hasAmPm) {
      if (/p\.?m\.?/i.test(text)) ampm.value = "PM";
      else if (/a\.?m\.?/i.test(text)) ampm.value = "AM";
    }

    syncDom(el, pos);
  }

  /* ── External sync ─────────────────────────────────── */

  /** Populate the mask from an InternalFormat (e.g. when the column
   *  picker updates the selected time). */
  function setFromTime(time: InternalFormat): void {
    const { digitGroups, hasAmPm: showAmPm } = parsed.value;
    const digits: number[] = [];

    let hourVal = time.h;

    if (showAmPm) {
      ampm.value = time.h >= 12 ? "PM" : "AM";
      hourVal = time.h % 12;
      if (hourVal === 0) hourVal = 12;
    } else if (hasK(format.value)) {
      hourVal = time.h === 0 ? 24 : time.h;
    }

    digits.push(Math.floor(hourVal / 10), hourVal % 10);
    digits.push(Math.floor(time.m / 10), time.m % 10);

    if (digitGroups.length > 2) {
      digits.push(Math.floor(time.s / 10), time.s % 10);
    }

    rawDigits.value = digits;
    inputValue.value = render();
  }

  /** Parse the current mask state back to an InternalFormat.
   *  Returns `null` when the input is incomplete. */
  function getParsedTime(): InternalFormat | null {
    if (rawDigits.value.length < totalDigits.value) return null;

    const values: number[] = [];
    for (let g = 0; g < parsed.value.digitGroups.length; g++) {
      const off = g * 2;
      values.push(rawDigits.value[off] * 10 + rawDigits.value[off + 1]);
    }

    let h = values[0];
    const m = values[1];
    const s = values[2] ?? 0;

    // 12-h → 24-h conversion
    if (parsed.value.hasAmPm) {
      h = ampm.value === "PM" ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h;
    }

    // k-format: 24 → midnight
    if (hasK(format.value) && h === 24) h = 0;

    return { h, m, s };
  }

  /** True when every digit slot is filled */
  const isComplete = computed(
    () => rawDigits.value.length >= totalDigits.value,
  );

  /** Whether the format uses lowercase a/p tokens */
  const ampmLowercase = computed(() => parsed.value.ampmLowercase);

  return {
    inputValue,
    handleKeydown,
    handleInput,
    handlePaste,
    setFromTime,
    getParsedTime,
    isComplete,
    totalDigits,
    displayPosToDigitIndex,
    ampm,
    ampmLowercase,
  };
}
