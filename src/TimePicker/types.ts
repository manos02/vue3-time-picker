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

function isValidCssSizeValue(value: unknown): boolean {
  return (
    value == undefined || typeof value === "string" || typeof value === "number"
  );
}

function isValidInputClassValue(value: unknown): boolean {
  return (
    value == undefined ||
    typeof value === "string" ||
    Array.isArray(value) ||
    (typeof value === "object" && value !== null)
  );
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

/** Wrap a check so it logs a dev-only error when the value is rejected. */
function withDevError<T>(
  check: (v: T) => boolean,
  message: (v: T) => string,
): (v: T) => boolean {
  return (v: T) => {
    const ok = check(v);
    if (!ok && isDev) console.error(`[VueTimepicker] ${message(v)}`);
    return ok;
  };
}

const isOptionalTime = (v?: string) => v == undefined || TIME_SHAPE.test(v);

const isValidModelValue = (v: any) =>
  Array.isArray(v)
    ? v.length === 2 && v.every((item) => TIME_SHAPE.test(item))
    : v == undefined || TIME_SHAPE.test(v);

export const timePickerProps = {
  modelValue: {
    type: [String, Array] as PropType<string | [string, string] | null>,
    default: undefined,
    validator: withDevError(
      isValidModelValue,
      (v) => `\`modelValue\` is wrong. Received: ${v}`,
    ),
  },
  range: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hideDropdown: {
    type: Boolean,
    default: false,
  },
  hourStep: { type: Number, default: 1 },
  minuteStep: { type: Number, default: 1 },
  secondStep: { type: Number, default: 1 },
  minTime: {
    type: String as PropType<string | undefined>,
    default: undefined,
    validator: withDevError(
      isOptionalTime,
      (v) => `\`minTime\` is wrong. Received: ${v}`,
    ),
  },
  maxTime: {
    type: String as PropType<string | undefined>,
    default: undefined,
    validator: withDevError(
      isOptionalTime,
      (v) => `\`maxTime\` is wrong. Received: ${v}`,
    ),
  },
  disabledTimes: {
    type: Array as PropType<ReadonlyArray<DisabledTimeInput> | undefined>,
    default: undefined,
    validator: withDevError(
      (v?: ReadonlyArray<DisabledTimeInput>) =>
        v == undefined || v.every(isValidDisabledTimeEntry),
      (v) => `\`disabledTimes\` is wrong. Received: ${JSON.stringify(v)}`,
    ),
  },
  isTimeDisabled: {
    type: Function as PropType<(time: InternalFormat) => boolean>,
    default: undefined,
  },
  format: {
    type: String as PropType<TimeFormat>,
    default: "HH:mm",
    validator: withDevError(
      (fmt: string) => FORMAT_SHAPE.test(fmt),
      (fmt) => `\`format\` format is wrong. Received: ${fmt}`,
    ),
  },
  placeholder: {
    type: String,
    default: "Select time",
  },
  id: {
    type: String as PropType<string | undefined>,
    default: undefined,
    validator: withDevError(
      (v?: string) => v == undefined || typeof v === "string",
      (v) => `\`id\` must be a string. Received: ${v}`,
    ),
  },
  name: {
    type: String as PropType<string | undefined>,
    default: undefined,
    validator: withDevError(
      (v?: string) => v == undefined || typeof v === "string",
      (v) => `\`name\` must be a string. Received: ${v}`,
    ),
  },
  tabindex: {
    type: Number,
    default: 0,
    validator: withDevError(
      (v: number) => Number.isInteger(v),
      (v) => `\`tabindex\` must be an integer. Received: ${v}`,
    ),
  },
  autocomplete: {
    type: String,
    default: "off",
    validator: withDevError(
      (v: string) => typeof v === "string",
      (v) => `\`autocomplete\` must be a string. Received: ${v}`,
    ),
  },
  inputClass: {
    type: [String, Array, Object] as PropType<
      string | string[] | Record<string, boolean> | undefined
    >,
    default: undefined,
    validator: withDevError(
      isValidInputClassValue,
      (v) => `\`inputClass\` must be a string, array, or object. Received: ${v}`,
    ),
  },
  inputWidth: {
    type: [String, Number] as PropType<string | number | undefined>,
    default: undefined,
    validator: withDevError(
      isValidCssSizeValue,
      (v) => `\`inputWidth\` must be a string or number. Received: ${v}`,
    ),
  },
  componentWidth: {
    type: [String, Number] as PropType<string | number | undefined>,
    default: undefined,
    validator: withDevError(
      isValidCssSizeValue,
      (v) => `\`componentWidth\` must be a string or number. Received: ${v}`,
    ),
  },
  minInputWidth: {
    type: [String, Number] as PropType<string | number | undefined>,
    default: undefined,
    validator: withDevError(
      isValidCssSizeValue,
      (v) => `\`minInputWidth\` must be a string or number. Received: ${v}`,
    ),
  },
  maxInputWidth: {
    type: [String, Number] as PropType<string | number | undefined>,
    default: undefined,
    validator: withDevError(
      isValidCssSizeValue,
      (v) => `\`maxInputWidth\` must be a string or number. Received: ${v}`,
    ),
  },
  size: {
    type: String as PropType<"xs" | "sm" | "md" | "lg" | "xl">,
    default: "md",
    validator: withDevError(
      (v: string) => ["xs", "sm", "md", "lg", "xl"].includes(v),
      (v) => `\`size\` is wrong. Received: ${v}`,
    ),
  },
} as const;

export type TimePickerProps = ExtractPropTypes<typeof timePickerProps>;

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
