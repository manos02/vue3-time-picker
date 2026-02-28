import { StoryObj } from '@storybook/vue3-vite';
declare const meta: {
    title: string;
    component: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
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
            readonly type: import('vue').PropType<ReadonlyArray<import('../index').DisabledTimeInput> | undefined>;
            readonly default: undefined;
            readonly validator: (v?: ReadonlyArray<import('../index').DisabledTimeInput>) => boolean;
        };
        readonly isTimeDisabled: {
            readonly type: import('vue').PropType<(time: import('../index').InternalFormat) => boolean>;
            readonly default: undefined;
        };
        readonly format: {
            readonly type: import('vue').PropType<import('../index').TimeFormat>;
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
        "update:validationState": (v: import('../index').ValidationState) => any;
        validate: (payload: {
            target: "first" | "second";
            state: import('../index').ValidationState;
            reason?: import('../index').ValidationReason;
            value: string | null;
        }) => any;
        open: () => any;
        close: () => any;
        error: (payload: {
            code: import('../index').ValidationReason;
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
            readonly type: import('vue').PropType<ReadonlyArray<import('../index').DisabledTimeInput> | undefined>;
            readonly default: undefined;
            readonly validator: (v?: ReadonlyArray<import('../index').DisabledTimeInput>) => boolean;
        };
        readonly isTimeDisabled: {
            readonly type: import('vue').PropType<(time: import('../index').InternalFormat) => boolean>;
            readonly default: undefined;
        };
        readonly format: {
            readonly type: import('vue').PropType<import('../index').TimeFormat>;
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
        "onUpdate:validationState"?: ((v: import('../index').ValidationState) => any) | undefined;
        onValidate?: ((payload: {
            target: "first" | "second";
            state: import('../index').ValidationState;
            reason?: import('../index').ValidationReason;
            value: string | null;
        }) => any) | undefined;
        onOpen?: (() => any) | undefined;
        onClose?: (() => any) | undefined;
        onError?: ((payload: {
            code: import('../index').ValidationReason;
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
        readonly disabledTimes: readonly import('../index').DisabledTimeInput[] | undefined;
        readonly isTimeDisabled: (time: import('../index').InternalFormat) => boolean;
        readonly format: import('../index').TimeFormat;
        readonly size: "xs" | "sm" | "md" | "lg" | "xl";
    }, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {
        secondInputRef: HTMLInputElement;
    }, any>;
    tags: string[];
    args: {
        format: "HH:mm:ss";
        range: false;
        size: "md";
        disabled: false;
        hourStep: number;
        minuteStep: number;
        secondStep: number;
        minTime: undefined;
        maxTime: undefined;
        disabledTimes: undefined;
    };
    argTypes: {
        modelValue: {
            table: {
                disable: true;
            };
        };
        isTimeDisabled: {
            table: {
                disable: true;
            };
        };
        onValidate: {
            action: string;
        };
        onError: {
            action: string;
        };
        "onUpdate:validationState": {
            action: string;
        };
    };
    render: (args: import('@storybook/vue3').ComponentPropsAndSlots<import('vue').DefineComponent<import('vue').ExtractPropTypes<{
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
            readonly type: import('vue').PropType<ReadonlyArray<import('../index').DisabledTimeInput> | undefined>;
            readonly default: undefined;
            readonly validator: (v?: ReadonlyArray<import('../index').DisabledTimeInput>) => boolean;
        };
        readonly isTimeDisabled: {
            readonly type: import('vue').PropType<(time: import('../index').InternalFormat) => boolean>;
            readonly default: undefined;
        };
        readonly format: {
            readonly type: import('vue').PropType<import('../index').TimeFormat>;
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
        "update:validationState": (v: import('../index').ValidationState) => any;
        validate: (payload: {
            target: "first" | "second";
            state: import('../index').ValidationState;
            reason?: import('../index').ValidationReason;
            value: string | null;
        }) => any;
        open: () => any;
        close: () => any;
        error: (payload: {
            code: import('../index').ValidationReason;
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
            readonly type: import('vue').PropType<ReadonlyArray<import('../index').DisabledTimeInput> | undefined>;
            readonly default: undefined;
            readonly validator: (v?: ReadonlyArray<import('../index').DisabledTimeInput>) => boolean;
        };
        readonly isTimeDisabled: {
            readonly type: import('vue').PropType<(time: import('../index').InternalFormat) => boolean>;
            readonly default: undefined;
        };
        readonly format: {
            readonly type: import('vue').PropType<import('../index').TimeFormat>;
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
        "onUpdate:validationState"?: ((v: import('../index').ValidationState) => any) | undefined;
        onValidate?: ((payload: {
            target: "first" | "second";
            state: import('../index').ValidationState;
            reason?: import('../index').ValidationReason;
            value: string | null;
        }) => any) | undefined;
        onOpen?: (() => any) | undefined;
        onClose?: (() => any) | undefined;
        onError?: ((payload: {
            code: import('../index').ValidationReason;
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
        readonly disabledTimes: readonly import('../index').DisabledTimeInput[] | undefined;
        readonly isTimeDisabled: (time: import('../index').InternalFormat) => boolean;
        readonly format: import('../index').TimeFormat;
        readonly size: "xs" | "sm" | "md" | "lg" | "xl";
    }, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {
        secondInputRef: HTMLInputElement;
    }, any>>) => {
        components: {
            TimePicker: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
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
                    readonly type: import('vue').PropType<ReadonlyArray<import('../index').DisabledTimeInput> | undefined>;
                    readonly default: undefined;
                    readonly validator: (v?: ReadonlyArray<import('../index').DisabledTimeInput>) => boolean;
                };
                readonly isTimeDisabled: {
                    readonly type: import('vue').PropType<(time: import('../index').InternalFormat) => boolean>;
                    readonly default: undefined;
                };
                readonly format: {
                    readonly type: import('vue').PropType<import('../index').TimeFormat>;
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
                "update:validationState": (v: import('../index').ValidationState) => any;
                validate: (payload: {
                    target: "first" | "second";
                    state: import('../index').ValidationState;
                    reason?: import('../index').ValidationReason;
                    value: string | null;
                }) => any;
                open: () => any;
                close: () => any;
                error: (payload: {
                    code: import('../index').ValidationReason;
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
                    readonly type: import('vue').PropType<ReadonlyArray<import('../index').DisabledTimeInput> | undefined>;
                    readonly default: undefined;
                    readonly validator: (v?: ReadonlyArray<import('../index').DisabledTimeInput>) => boolean;
                };
                readonly isTimeDisabled: {
                    readonly type: import('vue').PropType<(time: import('../index').InternalFormat) => boolean>;
                    readonly default: undefined;
                };
                readonly format: {
                    readonly type: import('vue').PropType<import('../index').TimeFormat>;
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
                "onUpdate:validationState"?: ((v: import('../index').ValidationState) => any) | undefined;
                onValidate?: ((payload: {
                    target: "first" | "second";
                    state: import('../index').ValidationState;
                    reason?: import('../index').ValidationReason;
                    value: string | null;
                }) => any) | undefined;
                onOpen?: (() => any) | undefined;
                onClose?: (() => any) | undefined;
                onError?: ((payload: {
                    code: import('../index').ValidationReason;
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
                readonly disabledTimes: readonly import('../index').DisabledTimeInput[] | undefined;
                readonly isTimeDisabled: (time: import('../index').InternalFormat) => boolean;
                readonly format: import('../index').TimeFormat;
                readonly size: "xs" | "sm" | "md" | "lg" | "xl";
            }, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {
                secondInputRef: HTMLInputElement;
            }, any>;
        };
        setup(this: void): {
            args: import('@storybook/vue3').ComponentPropsAndSlots<import('vue').DefineComponent<import('vue').ExtractPropTypes<{
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
                    readonly type: import('vue').PropType<ReadonlyArray<import('../index').DisabledTimeInput> | undefined>;
                    readonly default: undefined;
                    readonly validator: (v?: ReadonlyArray<import('../index').DisabledTimeInput>) => boolean;
                };
                readonly isTimeDisabled: {
                    readonly type: import('vue').PropType<(time: import('../index').InternalFormat) => boolean>;
                    readonly default: undefined;
                };
                readonly format: {
                    readonly type: import('vue').PropType<import('../index').TimeFormat>;
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
                "update:validationState": (v: import('../index').ValidationState) => any;
                validate: (payload: {
                    target: "first" | "second";
                    state: import('../index').ValidationState;
                    reason?: import('../index').ValidationReason;
                    value: string | null;
                }) => any;
                open: () => any;
                close: () => any;
                error: (payload: {
                    code: import('../index').ValidationReason;
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
                    readonly type: import('vue').PropType<ReadonlyArray<import('../index').DisabledTimeInput> | undefined>;
                    readonly default: undefined;
                    readonly validator: (v?: ReadonlyArray<import('../index').DisabledTimeInput>) => boolean;
                };
                readonly isTimeDisabled: {
                    readonly type: import('vue').PropType<(time: import('../index').InternalFormat) => boolean>;
                    readonly default: undefined;
                };
                readonly format: {
                    readonly type: import('vue').PropType<import('../index').TimeFormat>;
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
                "onUpdate:validationState"?: ((v: import('../index').ValidationState) => any) | undefined;
                onValidate?: ((payload: {
                    target: "first" | "second";
                    state: import('../index').ValidationState;
                    reason?: import('../index').ValidationReason;
                    value: string | null;
                }) => any) | undefined;
                onOpen?: (() => any) | undefined;
                onClose?: (() => any) | undefined;
                onError?: ((payload: {
                    code: import('../index').ValidationReason;
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
                readonly disabledTimes: readonly import('../index').DisabledTimeInput[] | undefined;
                readonly isTimeDisabled: (time: import('../index').InternalFormat) => boolean;
                readonly format: import('../index').TimeFormat;
                readonly size: "xs" | "sm" | "md" | "lg" | "xl";
            }, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {
                secondInputRef: HTMLInputElement;
            }, any>>;
            single: import('vue').Ref<string, string>;
            range: import('vue').Ref<[string, string], [string, string]>;
            valueLabel: import('vue').ComputedRef<string>;
            validationState: import('vue').Ref<"valid" | "invalid" | "out-of-range", "valid" | "invalid" | "out-of-range">;
        };
        template: string;
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const Range: Story;
export declare const WithConstraints: Story;
export declare const Disabled: Story;
