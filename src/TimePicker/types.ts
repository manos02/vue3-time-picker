/// <reference types="vite/client" />
import type { PropType, ExtractPropTypes } from "vue";

declare const __DEV__: boolean | undefined;

type HourToken = "HH" | "H" | "hh" | "h" | "kk" | "k";
type MinuteToken = "mm" | "m";
type SecondToken = `:${"ss" | "s"}`;
type AmPmToken = ` ${"A" | "a" | "P" | "p"}`;

// Hours and minutes
type Base = `${HourToken}:${MinuteToken}`;

// With optional seconds
type WithSeconds = `${Base}${SecondToken}`;

// With optional AM/PM
type WithAmPM = `${Base}${AmPmToken}`;
type WithSecondsAmPM = `${WithSeconds}${AmPmToken}`;

// Final type: all combinations
export type TimeFormat = Base | WithSeconds | WithAmPM | WithSecondsAmPM;

export type InternalFormat = { h: number; m: number; s: number }; // internal time
export type DisabledTimeInput = string | [string, string];
export type ValidationState = "valid" | "invalid" | "out-of-range";
export type ValidationReason = "BAD_TIME" | "OUT_OF_RANGE" | "DISABLED";

function isValidDisabledTimeEntry(entry: DisabledTimeInput): boolean {
  if (typeof entry === "string") return TIME_SHAPE.test(entry);
  if (Array.isArray(entry)) {
    return (
      entry.length === 2 &&
      TIME_SHAPE.test(entry[0] ?? "") &&
      TIME_SHAPE.test(entry[1] ?? "")
    );
  }
  return false;
}

export const FORMAT_SHAPE =
  /^(HH|H|hh|h|kk|k):(mm|m)(?::(ss|s))?(?:\s*(A|a|P|p))?$/;
export const TIME_SHAPE = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;

const isDev =
  typeof __DEV__ !== "undefined"
    ? __DEV__
    : typeof process !== "undefined" &&
      process.env &&
      process.env.NODE_ENV !== "production";

export const timePickerProps = {
  modelValue: {
    type: [String, Array] as PropType<string | [string, string] | null>,
    default: undefined,
    validator: (v: any) => {
      let ok;
      if (Array.isArray(v)) {
        ok = v.length === 2 && v.every((item) => TIME_SHAPE.test(item));
      } else {
        ok = v == undefined || TIME_SHAPE.test(v);
      }
      if (!ok && isDev) {
        console.error(
          `[VueTimepicker] \`modelValue\` is wrong. Received: ${v}`,
        );
      }
      return ok;
    },
  },
  range: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hourStep: { type: Number, default: 1 },
  minuteStep: { type: Number, default: 1 },
  secondStep: { type: Number, default: 1 },
  minTime: {
    type: String as PropType<string | undefined>,
    default: undefined,
    validator: (v?: string) => {
      const ok = v == undefined || TIME_SHAPE.test(v);
      if (!ok && isDev) {
        console.error(`[VueTimepicker] \`minTime\` is wrong. Received: ${v}`);
      }
      return ok;
    },
  },
  maxTime: {
    type: String as PropType<string | undefined>,
    default: undefined,
    validator: (v?: string) => {
      const ok = v == undefined || TIME_SHAPE.test(v);
      if (!ok && isDev) {
        console.error(`[VueTimepicker] \`maxTime\` is wrong. Received: ${v}`);
      }
      return ok;
    },
  },
  disabledTimes: {
    type: Array as PropType<ReadonlyArray<DisabledTimeInput> | undefined>,
    default: undefined,
    validator: (v?: ReadonlyArray<DisabledTimeInput>) => {
      const ok = v == undefined || v.every(isValidDisabledTimeEntry);
      if (!ok && isDev) {
        console.error(
          `[VueTimepicker] \`disabledTimes\` is wrong. Received: ${JSON.stringify(v)}`,
        );
      }
      return ok;
    },
  },
  isTimeDisabled: {
    type: Function as PropType<(time: InternalFormat) => boolean>,
    default: undefined,
  },
  format: {
    type: String as PropType<TimeFormat>,
    default: "HH:mm",
    validator: (fmt: string) => {
      const ok = FORMAT_SHAPE.test(fmt);
      if (!ok && isDev) {
        console.error(
          `[VueTimepicker] \`format\` format is wrong. Received: ${fmt}`,
        );
      }
      return ok;
    },
  },
  placeholder: {
    type: String,
    default: "Select time",
  },
  size: {
    type: String as PropType<"xs" | "sm" | "md" | "lg" | "xl">,
    default: "md",
    validator: (v: string) => {
      const ok =
        v === "xs" || v === "sm" || v === "md" || v === "lg" || v === "xl";
      if (!ok && isDev) {
        console.error(`[VueTimepicker] \`size\` is wrong. Received: ${v}`);
      }
      return ok;
    },
  },
} as const;

export type TimePickerProps = ExtractPropTypes<typeof timePickerProps>;

export const TimeSelectionProps = {
  modelValue: {
    type: [String, Array] as PropType<string | [string, string] | null>,
    default: null,
    validator: (v: any) => {
      let ok;
      if (Array.isArray(v)) {
        ok = v.length === 2 && v.every((item) => TIME_SHAPE.test(item));
      } else {
        ok = v == null || TIME_SHAPE.test(v);
      }
      if (!ok && isDev) {
        console.error(
          `[VueTimepicker] \`modelValue\` is wrong. Received: ${v}`,
        );
      }
      return ok;
    },
  },
  range: {
    type: Boolean,
    default: false,
  },
  hourStep: { type: Number, default: 1 },
  minuteStep: { type: Number, default: 1 },
  secondStep: { type: Number, default: 1 },
  format: {
    type: String as PropType<TimeFormat>,
    default: "HH:mm",
    validator: (fmt: string) => {
      const ok = FORMAT_SHAPE.test(fmt);
      if (!ok && import.meta.env.DEV) {
        console.error(
          `[VueTimepicker] \`format\` format is wrong. Received: ${fmt}`,
        );
      }
      return ok;
    },
  },
} as const;

export type TimeSelectionProps = ExtractPropTypes<typeof TimeSelectionProps>;

export interface TimePickerEmits {
  (e: "update:modelValue", v: string | [string, string] | null): void;
  (e: "update:validationState", v: ValidationState): void;
  (
    e: "validate",
    payload: {
      target: "first" | "second";
      state: ValidationState;
      reason?: ValidationReason;
      value: string | null;
    },
  ): void;
  (e: "open"): void;
  (e: "close"): void;
  (e: "error", payload: { code: ValidationReason; message: string }): void;
}

export type Item = {
  key: number | string;
  value: number | string;
  text: string;
  disabled?: boolean;
};
