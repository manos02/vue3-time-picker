import { InternalFormat, DisabledTimeInput, ValidationReason, ValidationState } from './types';
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    readonly modelValue: {
        readonly type: import('vue').PropType<string | [string, string] | null>;
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
        readonly type: import('vue').PropType<string | undefined>;
        readonly default: undefined;
        readonly validator: (v?: string) => boolean;
    };
    readonly maxTime: {
        readonly type: import('vue').PropType<string | undefined>;
        readonly default: undefined;
        readonly validator: (v?: string) => boolean;
    };
    readonly disabledTimes: {
        readonly type: import('vue').PropType<ReadonlyArray<DisabledTimeInput> | undefined>;
        readonly default: undefined;
        readonly validator: (v?: ReadonlyArray<DisabledTimeInput>) => boolean;
    };
    readonly isTimeDisabled: {
        readonly type: import('vue').PropType<(time: InternalFormat) => boolean>;
        readonly default: undefined;
    };
    readonly format: {
        readonly type: import('vue').PropType<import('./types').TimeFormat>;
        readonly default: "HH:mm";
        readonly validator: (fmt: string) => boolean;
    };
    readonly size: {
        readonly type: import('vue').PropType<"xs" | "sm" | "md" | "lg" | "xl">;
        readonly default: "md";
        readonly validator: (v: string) => v is "xs" | "sm" | "md" | "lg" | "xl";
    };
}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    "update:modelValue": (v: string | [string, string] | null) => any;
    "update:validationState": (v: ValidationState) => any;
    validate: (payload: {
        target: "first" | "second";
        state: ValidationState;
        reason?: ValidationReason;
        value: string | null;
    }) => any;
    open: () => any;
    close: () => any;
    error: (payload: {
        code: ValidationReason;
        message: string;
    }) => any;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    readonly modelValue: {
        readonly type: import('vue').PropType<string | [string, string] | null>;
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
        readonly type: import('vue').PropType<string | undefined>;
        readonly default: undefined;
        readonly validator: (v?: string) => boolean;
    };
    readonly maxTime: {
        readonly type: import('vue').PropType<string | undefined>;
        readonly default: undefined;
        readonly validator: (v?: string) => boolean;
    };
    readonly disabledTimes: {
        readonly type: import('vue').PropType<ReadonlyArray<DisabledTimeInput> | undefined>;
        readonly default: undefined;
        readonly validator: (v?: ReadonlyArray<DisabledTimeInput>) => boolean;
    };
    readonly isTimeDisabled: {
        readonly type: import('vue').PropType<(time: InternalFormat) => boolean>;
        readonly default: undefined;
    };
    readonly format: {
        readonly type: import('vue').PropType<import('./types').TimeFormat>;
        readonly default: "HH:mm";
        readonly validator: (fmt: string) => boolean;
    };
    readonly size: {
        readonly type: import('vue').PropType<"xs" | "sm" | "md" | "lg" | "xl">;
        readonly default: "md";
        readonly validator: (v: string) => v is "xs" | "sm" | "md" | "lg" | "xl";
    };
}>> & Readonly<{
    "onUpdate:modelValue"?: ((v: string | [string, string] | null) => any) | undefined;
    "onUpdate:validationState"?: ((v: ValidationState) => any) | undefined;
    onValidate?: ((payload: {
        target: "first" | "second";
        state: ValidationState;
        reason?: ValidationReason;
        value: string | null;
    }) => any) | undefined;
    onOpen?: (() => any) | undefined;
    onClose?: (() => any) | undefined;
    onError?: ((payload: {
        code: ValidationReason;
        message: string;
    }) => any) | undefined;
}>, {
    readonly modelValue: string | [string, string] | null;
    readonly range: boolean;
    readonly disabled: boolean;
    readonly hourStep: number;
    readonly minuteStep: number;
    readonly secondStep: number;
    readonly minTime: string | undefined;
    readonly maxTime: string | undefined;
    readonly disabledTimes: readonly DisabledTimeInput[] | undefined;
    readonly isTimeDisabled: (time: InternalFormat) => boolean;
    readonly format: import('./types').TimeFormat;
    readonly size: "xs" | "sm" | "md" | "lg" | "xl";
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {
    secondInputRef: HTMLInputElement;
}, any>;
export default _default;
