import { PropType, ExtractPropTypes } from 'vue';
type HourToken = "HH" | "H" | "hh" | "h" | "kk" | "k";
type MinuteToken = "mm" | "m";
type SecondToken = `:${"ss" | "s"}`;
type AmPmToken = ` ${"A" | "a" | "P" | "p"}`;
type Base = `${HourToken}:${MinuteToken}`;
type WithSeconds = `${Base}${SecondToken}`;
type WithAmPM = `${Base}${AmPmToken}`;
type WithSecondsAmPM = `${WithSeconds}${AmPmToken}`;
export type TimeFormat = Base | WithSeconds | WithAmPM | WithSecondsAmPM;
export type InternalFormat = {
    h: number;
    m: number;
    s: number;
};
export type DisabledTimeInput = string | [string, string];
export type ValidationState = "valid" | "invalid" | "out-of-range";
export type ValidationReason = "BAD_TIME" | "OUT_OF_RANGE" | "DISABLED";
export declare const FORMAT_SHAPE: RegExp;
export declare const TIME_SHAPE: RegExp;
export declare const timePickerProps: {
    readonly modelValue: {
        readonly type: PropType<string | [string, string] | null>;
        readonly default: undefined;
        readonly validator: (v: any) => boolean;
    };
    readonly range: {
        readonly type: BooleanConstructor;
        readonly default: false;
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: false;
    };
    readonly hourStep: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly minuteStep: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly secondStep: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly minTime: {
        readonly type: PropType<string | undefined>;
        readonly default: undefined;
        readonly validator: (v?: string) => boolean;
    };
    readonly maxTime: {
        readonly type: PropType<string | undefined>;
        readonly default: undefined;
        readonly validator: (v?: string) => boolean;
    };
    readonly disabledTimes: {
        readonly type: PropType<ReadonlyArray<DisabledTimeInput> | undefined>;
        readonly default: undefined;
        readonly validator: (v?: ReadonlyArray<DisabledTimeInput>) => boolean;
    };
    readonly isTimeDisabled: {
        readonly type: PropType<(time: InternalFormat) => boolean>;
        readonly default: undefined;
    };
    readonly format: {
        readonly type: PropType<TimeFormat>;
        readonly default: "HH:mm";
        readonly validator: (fmt: string) => boolean;
    };
    readonly size: {
        readonly type: PropType<"xs" | "sm" | "md" | "lg" | "xl">;
        readonly default: "md";
        readonly validator: (v: string) => v is "xs" | "sm" | "md" | "lg" | "xl";
    };
};
export type TimePickerProps = ExtractPropTypes<typeof timePickerProps>;
export declare const TimeSelectionProps: {
    readonly modelValue: {
        readonly type: PropType<string | [string, string] | null>;
        readonly default: null;
        readonly validator: (v: any) => boolean;
    };
    readonly range: {
        readonly type: BooleanConstructor;
        readonly default: false;
    };
    readonly hourStep: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly minuteStep: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly secondStep: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly format: {
        readonly type: PropType<TimeFormat>;
        readonly default: "HH:mm";
        readonly validator: (fmt: string) => boolean;
    };
};
export type TimeSelectionProps = ExtractPropTypes<typeof TimeSelectionProps>;
export interface TimePickerEmits {
    (e: "update:modelValue", v: string | [string, string] | null): void;
    (e: "update:validationState", v: ValidationState): void;
    (e: "validate", payload: {
        target: "first" | "second";
        state: ValidationState;
        reason?: ValidationReason;
        value: string | null;
    }): void;
    (e: "open"): void;
    (e: "close"): void;
    (e: "error", payload: {
        code: ValidationReason;
        message: string;
    }): void;
}
export type Item = {
    key: number | string;
    value: number | string;
    text: string;
    disabled?: boolean;
};
export {};
