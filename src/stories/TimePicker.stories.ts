import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { TimePicker } from "../index";

const meta = {
  title: "Components/TimePicker",
  component: TimePicker,
  tags: ["autodocs"],
  args: {
    format: "HH:mm:ss",
    range: false,
    size: "md",
    disabled: false,
    hourStep: 1,
    minuteStep: 1,
    secondStep: 1,
    minTime: undefined,
    maxTime: undefined,
    disabledTimes: undefined,
  },
  argTypes: {
    modelValue: { table: { disable: true } },
    isTimeDisabled: { table: { disable: true } },
    onValidate: { action: "validate" },
    onError: { action: "error" },
    "onUpdate:validationState": { action: "update:validationState" },
  },
  render: (args) => ({
    components: { TimePicker },
    setup() {
      const single = ref("12:30:00");
      const range = ref<[string, string]>(["09:00:00", "17:00:00"]);
      const valueLabel = computed(() =>
        args.range ? JSON.stringify(range.value) : single.value,
      );
      const validationState = ref<"valid" | "invalid" | "out-of-range">(
        "valid",
      );

      return {
        args,
        single,
        range,
        valueLabel,
        validationState,
      };
    },
    template: `
      <div style="min-width: 420px; padding: 12px;">
        <TimePicker
          v-if="!args.range"
          v-bind="args"
          v-model="single"
          v-model:validationState="validationState"
        />
        <TimePicker
          v-else
          v-bind="args"
          v-model="range"
          v-model:validationState="validationState"
        />

        <p style="margin: 12px 0 0; font-size: 12px; opacity: 0.8;">Value: {{ valueLabel }}</p>
        <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.8;">Validation: {{ validationState }}</p>
      </div>
    `,
  }),
} satisfies Meta<typeof TimePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => ({
    components: { TimePicker },
    setup() {
      const single = ref("12:30:00");
      const range = ref<[string, string]>(["09:00:00", "17:00:00"]);
      const valueLabel = computed(() =>
        args.range ? JSON.stringify(range.value) : single.value,
      );
      const validationState = ref<"valid" | "invalid" | "out-of-range">(
        "valid",
      );

      return {
        args,
        single,
        range,
        valueLabel,
        validationState,
      };
    },
    template: `
      <div style="min-width: 420px; padding: 12px;">
        <div style="margin-bottom:10px;padding:10px;border:1px dashed #cbd5e1;border-radius:8px;background:#f8fafc;">
          <p style="margin:0 0 4px;font-size:12px;font-weight:600;">How to use Playground</p>
          <p style="margin:0;font-size:12px;opacity:.85;line-height:1.4;">
            Use the Controls panel to change props (format, range, size, steps, min/max, disabled rules).
            Interact with the picker below and inspect validation/events in the Actions panel.
          </p>
        </div>

        <TimePicker
          v-if="!args.range"
          v-bind="args"
          v-model="single"
          v-model:validationState="validationState"
        />
        <TimePicker
          v-else
          v-bind="args"
          v-model="range"
          v-model:validationState="validationState"
        />

        <p style="margin: 12px 0 0; font-size: 12px; opacity: 0.8;">Value: {{ valueLabel }}</p>
        <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.8;">Validation: {{ validationState }}</p>
      </div>
    `,
  }),
};

export const FeatureGallery: Story = {
  render: () => ({
    components: { TimePicker },
    setup() {
      const time24 = ref("12:30:00");
      const time12 = ref("08:45:00");
      const timeK = ref("23:00:00");
      const stepped = ref("10:00:00");
      const constrained = ref("09:00:00");
      const callbackBlocked = ref("09:15:00");
      const disabledValue = ref("16:30:00");
      const range = ref<[string, string]>(["09:30:00", "17:00:00"]);
      const validationState = ref<"valid" | "invalid" | "out-of-range">(
        "valid",
      );

      return {
        time24,
        time12,
        timeK,
        stepped,
        constrained,
        callbackBlocked,
        disabledValue,
        range,
        validationState,
        isDisabled: (value: { h: number; m: number }) =>
          value.m === 45 || (value.h >= 11 && value.h <= 12),
      };
    },
    template: `
      <div style="display:grid;grid-template-columns:repeat(2,minmax(280px,1fr));gap:12px;min-width:700px;padding:12px;">
        <div style="grid-column:1 / -1;padding:12px;border:1px dashed #cbd5e1;border-radius:8px;background:#f8fafc;">
          <p style="margin:0 0 6px;font-size:13px;font-weight:600;">How to use this playground</p>
          <p style="margin:0;font-size:12px;line-height:1.45;opacity:.85;">
            Try typing directly in each picker and open dropdowns to select values. Compare formats (24h/12h/k), test constraints
            (minTime/maxTime), blocked ranges (disabledTimes), callback rules, disabled mode, and range behavior.
            Check Storybook actions/events to inspect validation updates.
          </p>
        </div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">24h + seconds</p><TimePicker v-model="time24" format="HH:mm:ss" /></div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">12h format</p><TimePicker v-model="time12" format="hh:mm:ss A" /></div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">k-format (1-24)</p><TimePicker v-model="timeK" format="kk:mm" /></div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">Step intervals</p><TimePicker v-model="stepped" format="HH:mm:ss" :hour-step="2" :minute-step="15" :second-step="10" /></div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">Min/Max + disabledTimes</p><TimePicker v-model="constrained" format="HH:mm" minTime="09:00:00" maxTime="18:00:00" :disabled-times="[['12:00:00','13:00:00'], ['15:30:00','16:00:00']]" /></div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">Callback disabled rule</p><TimePicker v-model="callbackBlocked" format="HH:mm" :is-time-disabled="isDisabled" v-model:validationState="validationState" /></div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">Disabled state</p><TimePicker v-model="disabledValue" format="HH:mm:ss" :disabled="true" /></div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">Range + validation</p><TimePicker v-model="range" :range="true" format="HH:mm" :minute-step="15" v-model:validationState="validationState" /></div>
      </div>
    `,
  }),
};

export const ThemedWithCssVariables: Story = {
  render: () => ({
    components: { TimePicker },
    setup() {
      const light = ref("08:30:00");
      const dark = ref("19:45:00");
      const mint = ref("10:15:00");
      const rose = ref("14:20:00");
      const mono = ref("21:05:00");
      return { light, dark, mint, rose, mono };
    },
    template: `
      <div style="display: grid; gap: 16px; min-width: 520px; padding: 12px;">
        <div
          style="padding: 12px; border-radius: 10px; background: #fff7ed; --vtp-bg: #fff7ed; --vtp-color: #7c2d12; --vtp-border: #fb923c; --vtp-focus-border: #f97316; --vtp-option-active-bg: #f97316; --vtp-option-active-color: #fff7ed;"
        >
          <p style="margin: 0 0 8px; font-size: 12px; opacity: 0.8;">Warm Theme</p>
          <TimePicker v-model="light" format="hh:mm A" size="lg" />
        </div>

        <div
          style="padding: 12px; border-radius: 10px; background: #0f172a; color: #e2e8f0; --vtp-bg: #0f172a; --vtp-color: #e2e8f0; --vtp-border: #334155; --vtp-focus-border: #38bdf8; --vtp-dropdown-bg: #0b1220; --vtp-dropdown-border: #1e293b; --vtp-option-hover-bg: #1e293b; --vtp-option-active-bg: #38bdf8; --vtp-option-active-color: #082f49;"
        >
          <p style="margin: 0 0 8px; font-size: 12px; opacity: 0.85;">Night Theme</p>
          <TimePicker v-model="dark" format="HH:mm:ss" size="md" />
        </div>

        <div
          style="padding: 12px; border-radius: 10px; background: #ecfdf5; --vtp-bg: #ecfdf5; --vtp-color: #065f46; --vtp-border: #34d399; --vtp-focus-border: #10b981; --vtp-dropdown-bg: #f0fdf4; --vtp-option-hover-bg: #d1fae5; --vtp-option-active-bg: #10b981; --vtp-option-active-color: #ecfdf5;"
        >
          <p style="margin: 0 0 8px; font-size: 12px; opacity: 0.8;">Mint Theme</p>
          <TimePicker v-model="mint" format="HH:mm" size="sm" />
        </div>

        <div
          style="padding: 12px; border-radius: 10px; background: #fff1f2; --vtp-bg: #fff1f2; --vtp-color: #881337; --vtp-border: #fb7185; --vtp-focus-border: #f43f5e; --vtp-dropdown-bg: #ffe4e6; --vtp-option-hover-bg: #fecdd3; --vtp-option-active-bg: #f43f5e; --vtp-option-active-color: #fff1f2;"
        >
          <p style="margin: 0 0 8px; font-size: 12px; opacity: 0.8;">Rose Theme</p>
          <TimePicker v-model="rose" format="hh:mm A" size="md" />
        </div>

        <div
          style="padding: 12px; border-radius: 10px; background: #f8fafc; --vtp-font-family: 'Roboto Mono', monospace; --vtp-bg: #f8fafc; --vtp-color: #0f172a; --vtp-border: #cbd5e1; --vtp-focus-border: #64748b; --vtp-dropdown-bg: #ffffff; --vtp-option-hover-bg: #e2e8f0; --vtp-option-active-bg: #334155; --vtp-option-active-color: #f8fafc;"
        >
          <p style="margin: 0 0 8px; font-size: 12px; opacity: 0.8;">Monochrome Theme</p>
          <TimePicker v-model="mono" format="kk:mm" size="xs" />
        </div>
      </div>
    `,
  }),
};
