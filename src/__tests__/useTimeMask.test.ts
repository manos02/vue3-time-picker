import { describe, it, expect, beforeEach, vi } from "vitest";
import { ref, nextTick } from "vue";
import { useTimeMask } from "../TimePicker/useTimeMask";

/* ─────────────────────────────────────────────────
 * Helper: simulate keyboard interaction on a mock input
 * ───────────────────────────────────────────────── */

function createMockInput(value = ""): HTMLInputElement {
  const el = document.createElement("input");
  el.value = value;
  el.selectionStart = 0;
  el.selectionEnd = 0;
  // Focus the element so activeElement checks work
  document.body.appendChild(el);
  el.focus();
  return el;
}

function pressKey(
  mask: ReturnType<typeof useTimeMask>,
  el: HTMLInputElement,
  key: string,
) {
  const event = new KeyboardEvent("keydown", {
    key,
    bubbles: true,
    cancelable: true,
  });
  Object.defineProperty(event, "target", { value: el, writable: false });
  mask.handleKeydown(event);
}

function typeDigits(
  mask: ReturnType<typeof useTimeMask>,
  el: HTMLInputElement,
  digits: string,
) {
  for (const ch of digits) {
    pressKey(mask, el, ch);
  }
}

/* ─────────────────────────────────────────────────
 * Tests
 * ───────────────────────────────────────────────── */

describe("useTimeMask", () => {
  let el: HTMLInputElement;

  beforeEach(() => {
    el = createMockInput();
  });

  /* ── Basic digit entry ──────────────────────── */

  describe("digit entry (HH:mm)", () => {
    it("builds the display value as digits are typed", () => {
      const format = ref("HH:mm");
      const mask = useTimeMask(format);

      typeDigits(mask, el, "1");
      expect(mask.inputValue.value).toBe("1");

      typeDigits(mask, el, "4");
      expect(mask.inputValue.value).toBe("14:");

      typeDigits(mask, el, "3");
      expect(mask.inputValue.value).toBe("14:3");

      typeDigits(mask, el, "0");
      expect(mask.inputValue.value).toBe("14:30");
    });

    it("marks isComplete when all digits are entered", () => {
      const format = ref("HH:mm");
      const mask = useTimeMask(format);

      expect(mask.isComplete.value).toBe(false);
      typeDigits(mask, el, "1430");
      expect(mask.isComplete.value).toBe(true);
    });

    it("reports totalDigits correctly", () => {
      expect(useTimeMask(ref("HH:mm")).totalDigits.value).toBe(4);
      expect(useTimeMask(ref("HH:mm:ss")).totalDigits.value).toBe(6);
      expect(useTimeMask(ref("hh:mm A")).totalDigits.value).toBe(4);
      expect(useTimeMask(ref("hh:mm:ss A")).totalDigits.value).toBe(6);
    });
  });

  /* ── Clamping ───────────────────────────────── */

  describe("clamping", () => {
    it("clamps hours to 0-23 in HH:mm format", () => {
      const mask = useTimeMask(ref("HH:mm"));
      typeDigits(mask, el, "2930");
      // 29 should be clamped to 23
      expect(mask.inputValue.value).toBe("23:30");
    });

    it("clamps minutes to 0-59", () => {
      const mask = useTimeMask(ref("HH:mm"));
      typeDigits(mask, el, "1275");
      // 75 → 59
      expect(mask.inputValue.value).toBe("12:59");
    });

    it("clamps 12h hours to 1-12", () => {
      const mask = useTimeMask(ref("hh:mm A"));
      typeDigits(mask, el, "0030");
      // 00 → 01 (minimum is 1)
      expect(mask.inputValue.value).toMatch(/^01:30/);
    });

    it("clamps 12h hours max at 12", () => {
      const mask = useTimeMask(ref("hh:mm A"));
      typeDigits(mask, el, "1530");
      // 15 → 12
      expect(mask.inputValue.value).toMatch(/^12:30/);
    });

    it("clamps kk hours to 1-24", () => {
      const mask = useTimeMask(ref("kk:mm"));
      typeDigits(mask, el, "0030");
      // 00 → 01
      expect(mask.inputValue.value).toBe("01:30");
    });

    it("clamps kk hours max at 24", () => {
      const mask = useTimeMask(ref("kk:mm"));
      typeDigits(mask, el, "2800");
      // 28 → 24
      expect(mask.inputValue.value).toBe("24:00");
    });

    it("clamps seconds to 0-59", () => {
      const mask = useTimeMask(ref("HH:mm:ss"));
      typeDigits(mask, el, "123065");
      // 65 → 59
      expect(mask.inputValue.value).toBe("12:30:59");
    });
  });

  /* ── AM/PM toggle ───────────────────────────── */

  describe("AM/PM", () => {
    it("defaults to AM", () => {
      const mask = useTimeMask(ref("hh:mm A"));
      expect(mask.ampm.value).toBe("AM");
    });

    it("appends AM after all digits entered", () => {
      const mask = useTimeMask(ref("hh:mm A"));
      typeDigits(mask, el, "1230");
      expect(mask.inputValue.value).toBe("12:30 AM");
    });

    it("toggles to PM with the p key", () => {
      const mask = useTimeMask(ref("hh:mm A"));
      typeDigits(mask, el, "1230");
      pressKey(mask, el, "p");
      expect(mask.ampm.value).toBe("PM");
      expect(mask.inputValue.value).toBe("12:30 PM");
    });

    it("toggles back to AM with the a key", () => {
      const mask = useTimeMask(ref("hh:mm A"));
      typeDigits(mask, el, "1230");
      pressKey(mask, el, "p");
      pressKey(mask, el, "a");
      expect(mask.ampm.value).toBe("AM");
      expect(mask.inputValue.value).toBe("12:30 AM");
    });
  });

  /* ── Overwrite mode ─────────────────────────── */

  describe("overwrite mode", () => {
    it("overwrites digits at cursor position", () => {
      const mask = useTimeMask(ref("HH:mm"));
      typeDigits(mask, el, "1430");
      // Move cursor to start
      el.selectionStart = el.selectionEnd = 0;
      typeDigits(mask, el, "09");
      // Hours should now be 09
      expect(mask.inputValue.value).toBe("09:30");
    });

    it("does not erase on Backspace, only moves cursor", () => {
      const mask = useTimeMask(ref("HH:mm"));
      typeDigits(mask, el, "1430");
      pressKey(mask, el, "Backspace");
      // Value unchanged, cursor moved left
      expect(mask.inputValue.value).toBe("14:30");
    });

    it("ignores Delete key", () => {
      const mask = useTimeMask(ref("HH:mm"));
      typeDigits(mask, el, "1430");
      pressKey(mask, el, "Delete");
      expect(mask.inputValue.value).toBe("14:30");
    });
  });

  /* ── setFromTime ────────────────────────────── */

  describe("setFromTime", () => {
    it("populates mask from InternalFormat (24h)", () => {
      const mask = useTimeMask(ref("HH:mm"));
      mask.setFromTime({ h: 14, m: 30, s: 0 });
      expect(mask.inputValue.value).toBe("14:30");
      expect(mask.isComplete.value).toBe(true);
    });

    it("populates mask with seconds", () => {
      const mask = useTimeMask(ref("HH:mm:ss"));
      mask.setFromTime({ h: 9, m: 5, s: 7 });
      expect(mask.inputValue.value).toBe("09:05:07");
    });

    it("populates mask in 12h format and sets AM/PM", () => {
      const mask = useTimeMask(ref("hh:mm A"));
      mask.setFromTime({ h: 14, m: 30, s: 0 });
      expect(mask.inputValue.value).toBe("02:30 PM");
      expect(mask.ampm.value).toBe("PM");
    });

    it("handles midnight in 12h format", () => {
      const mask = useTimeMask(ref("hh:mm A"));
      mask.setFromTime({ h: 0, m: 0, s: 0 });
      expect(mask.inputValue.value).toBe("12:00 AM");
      expect(mask.ampm.value).toBe("AM");
    });

    it("handles noon in 12h format", () => {
      const mask = useTimeMask(ref("hh:mm A"));
      mask.setFromTime({ h: 12, m: 0, s: 0 });
      expect(mask.inputValue.value).toBe("12:00 PM");
      expect(mask.ampm.value).toBe("PM");
    });

    it("populates mask in k-format", () => {
      const mask = useTimeMask(ref("kk:mm"));
      mask.setFromTime({ h: 0, m: 0, s: 0 });
      expect(mask.inputValue.value).toBe("24:00");
    });

    it("populates mask in k-format for non-midnight", () => {
      const mask = useTimeMask(ref("kk:mm"));
      mask.setFromTime({ h: 13, m: 45, s: 0 });
      expect(mask.inputValue.value).toBe("13:45");
    });
  });

  /* ── getParsedTime ──────────────────────────── */

  describe("getParsedTime", () => {
    it("returns null when incomplete", () => {
      const mask = useTimeMask(ref("HH:mm"));
      typeDigits(mask, el, "14");
      expect(mask.getParsedTime()).toBeNull();
    });

    it("parses 24h format correctly", () => {
      const mask = useTimeMask(ref("HH:mm"));
      typeDigits(mask, el, "1430");
      expect(mask.getParsedTime()).toEqual({ h: 14, m: 30, s: 0 });
    });

    it("parses with seconds", () => {
      const mask = useTimeMask(ref("HH:mm:ss"));
      typeDigits(mask, el, "143015");
      expect(mask.getParsedTime()).toEqual({ h: 14, m: 30, s: 15 });
    });

    it("converts 12h AM to 24h correctly", () => {
      const mask = useTimeMask(ref("hh:mm A"));
      typeDigits(mask, el, "0930");
      // Default is AM
      expect(mask.getParsedTime()).toEqual({ h: 9, m: 30, s: 0 });
    });

    it("converts 12h PM to 24h correctly", () => {
      const mask = useTimeMask(ref("hh:mm A"));
      typeDigits(mask, el, "0230");
      pressKey(mask, el, "p");
      expect(mask.getParsedTime()).toEqual({ h: 14, m: 30, s: 0 });
    });

    it("converts 12 AM to 0 (midnight)", () => {
      const mask = useTimeMask(ref("hh:mm A"));
      typeDigits(mask, el, "1200");
      // AM → h=12 → should become 0
      expect(mask.getParsedTime()).toEqual({ h: 0, m: 0, s: 0 });
    });

    it("keeps 12 PM as 12 (noon)", () => {
      const mask = useTimeMask(ref("hh:mm A"));
      typeDigits(mask, el, "1200");
      pressKey(mask, el, "p");
      expect(mask.getParsedTime()).toEqual({ h: 12, m: 0, s: 0 });
    });

    it("converts k-format 24 to midnight (0)", () => {
      const mask = useTimeMask(ref("kk:mm"));
      typeDigits(mask, el, "2400");
      expect(mask.getParsedTime()).toEqual({ h: 0, m: 0, s: 0 });
    });
  });

  /* ── displayPosToDigitIndex ─────────────────── */

  describe("displayPosToDigitIndex", () => {
    it("maps display positions correctly for HH:mm", () => {
      const mask = useTimeMask(ref("HH:mm"));
      typeDigits(mask, el, "1430");

      expect(mask.displayPosToDigitIndex(0)).toBe(0); // before first digit
      expect(mask.displayPosToDigitIndex(1)).toBe(1); // after "1"
      expect(mask.displayPosToDigitIndex(2)).toBe(2); // after "4" (before ":")
      expect(mask.displayPosToDigitIndex(3)).toBe(2); // on ":" → still 2 digits seen
      expect(mask.displayPosToDigitIndex(4)).toBe(3); // after "3"
      expect(mask.displayPosToDigitIndex(5)).toBe(4); // after "0"
    });
  });

  /* ── Paste handling ─────────────────────────── */

  describe("handlePaste", () => {
    it("pastes a full time string", () => {
      const mask = useTimeMask(ref("HH:mm"));
      const pasteEvent = new ClipboardEvent("paste", {
        clipboardData: new DataTransfer(),
        cancelable: true,
      });
      pasteEvent.clipboardData!.setData("text", "14:30");
      Object.defineProperty(pasteEvent, "target", {
        value: el,
        writable: false,
      });
      el.selectionStart = 0;
      mask.handlePaste(pasteEvent);
      expect(mask.inputValue.value).toBe("14:30");
    });

    it("pastes digits without separator", () => {
      const mask = useTimeMask(ref("HH:mm"));
      const pasteEvent = new ClipboardEvent("paste", {
        clipboardData: new DataTransfer(),
        cancelable: true,
      });
      pasteEvent.clipboardData!.setData("text", "0915");
      Object.defineProperty(pasteEvent, "target", {
        value: el,
        writable: false,
      });
      el.selectionStart = 0;
      mask.handlePaste(pasteEvent);
      expect(mask.inputValue.value).toBe("09:15");
    });

    it("detects PM from pasted text in 12h mode", () => {
      const mask = useTimeMask(ref("hh:mm A"));
      const pasteEvent = new ClipboardEvent("paste", {
        clipboardData: new DataTransfer(),
        cancelable: true,
      });
      pasteEvent.clipboardData!.setData("text", "02:30 PM");
      Object.defineProperty(pasteEvent, "target", {
        value: el,
        writable: false,
      });
      el.selectionStart = 0;
      mask.handlePaste(pasteEvent);
      expect(mask.ampm.value).toBe("PM");
      expect(mask.inputValue.value).toBe("02:30 PM");
    });
  });

  /* ── Format with seconds ────────────────────── */

  describe("HH:mm:ss format", () => {
    it("inserts colons correctly", () => {
      const mask = useTimeMask(ref("HH:mm:ss"));
      typeDigits(mask, el, "143015");
      expect(mask.inputValue.value).toBe("14:30:15");
    });

    it("setFromTime + getParsedTime roundtrip", () => {
      const mask = useTimeMask(ref("HH:mm:ss"));
      const time = { h: 8, m: 5, s: 42 };
      mask.setFromTime(time);
      expect(mask.getParsedTime()).toEqual(time);
    });
  });

  /* ── 12h + seconds roundtrip ────────────────── */

  describe("hh:mm:ss A format", () => {
    it("roundtrips PM time correctly", () => {
      const mask = useTimeMask(ref("hh:mm:ss A"));
      mask.setFromTime({ h: 15, m: 45, s: 30 });
      expect(mask.inputValue.value).toBe("03:45:30 PM");
      expect(mask.getParsedTime()).toEqual({ h: 15, m: 45, s: 30 });
    });

    it("roundtrips AM time correctly", () => {
      const mask = useTimeMask(ref("hh:mm:ss A"));
      mask.setFromTime({ h: 3, m: 10, s: 5 });
      expect(mask.inputValue.value).toBe("03:10:05 AM");
      expect(mask.getParsedTime()).toEqual({ h: 3, m: 10, s: 5 });
    });
  });

  /* ── Navigation keys ────────────────────────── */

  describe("navigation keys", () => {
    it("allows Tab through without prevention", () => {
      const mask = useTimeMask(ref("HH:mm"));
      typeDigits(mask, el, "1430");
      const tabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        cancelable: true,
      });
      Object.defineProperty(tabEvent, "target", {
        value: el,
        writable: false,
      });
      mask.handleKeydown(tabEvent);
      // Tab should NOT be prevented
      expect(tabEvent.defaultPrevented).toBe(false);
    });

    it("allows Escape through without prevention", () => {
      const mask = useTimeMask(ref("HH:mm"));
      const escEvent = new KeyboardEvent("keydown", {
        key: "Escape",
        cancelable: true,
      });
      Object.defineProperty(escEvent, "target", {
        value: el,
        writable: false,
      });
      mask.handleKeydown(escEvent);
      expect(escEvent.defaultPrevented).toBe(false);
    });
  });
});
