/// <reference types="vite/client" />
import type { PropType, ExtractPropTypes } from "vue";

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

export const FORMAT_SHAPE =
  /^(HH|H|hh|h|kk|k):(mm|m)(?::(ss|s))?(?:\s*(A|a|P|p))?$/;
export const TIME_SHAPE = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;

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
      if (!ok && import.meta.env.DEV) {
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
      if (!ok && import.meta.env.DEV) {
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
  (e: "open"): void;
  (e: "close"): void;
  (
    e: "error",
    payload: { code: "BAD_TIME" | "OUT_OF_RANGE"; message: string },
  ): void;
}

export type Item = {
  key: number | string;
  value: number | string;
  text: string;
  disabled?: boolean;
};
