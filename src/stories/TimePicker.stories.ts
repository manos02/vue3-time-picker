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

export const Playground: Story = {};

export const Range: Story = {
  args: {
    range: true,
    format: "HH:mm",
  },
};

export const WithConstraints: Story = {
  args: {
    format: "HH:mm",
    minTime: "09:00:00",
    maxTime: "18:00:00",
    disabledTimes: [["12:00:00", "13:00:00"]],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
