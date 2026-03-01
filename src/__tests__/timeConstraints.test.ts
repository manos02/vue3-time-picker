import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import TimePicker from "../TimePicker/TimePicker.vue";
import TimeSelection from "../TimePicker/TimeSelection.vue";
import type { InternalFormat } from "../TimePicker/types";

async function typeDigits(
  inputEl: HTMLInputElement,
  wrapper: any,
  digits: string,
) {
  inputEl.focus();
  inputEl.selectionStart = inputEl.selectionEnd = 0;

  for (const ch of digits) {
    await wrapper.trigger("keydown", { key: ch });
    await nextTick();
  }
}

describe("time constraints (minTime/maxTime)", () => {
  it("does not set width CSS variables by default", () => {
    const wrapper = mount(TimePicker, {
      props: {
        modelValue: null,
        format: "HH:mm",
      },
    });

    const shell = wrapper.find(".timepicker-shell");
    const shellStyle = shell.attributes("style") ?? "";
    expect(shellStyle).not.toContain("--vtp-input-width");
    expect(shellStyle).not.toContain("--vtp-component-width");
  });

  it("applies width props as CSS variables on the shell", () => {
    const wrapper = mount(TimePicker, {
      props: {
        modelValue: "12:00:00",
        format: "HH:mm",
        componentWidth: "100%",
        inputWidth: 240,
        minInputWidth: "12ch",
        maxInputWidth: 360,
      },
    });

    const shell = wrapper.find(".timepicker-shell");
    const shellStyle = shell.attributes("style") ?? "";

    expect(shellStyle).toContain("--vtp-component-width: 100%");
    expect(shellStyle).toContain("--vtp-input-width: 240px");
    expect(shellStyle).toContain("--vtp-input-min-width: 12ch");
    expect(shellStyle).toContain("--vtp-input-max-width: 360px");
  });

  it("keeps single input empty when modelValue is null", () => {
    const wrapper = mount(TimePicker, {
      props: {
        modelValue: null,
        format: "HH:mm",
      },
    });

    const input = wrapper.find("input.timepicker-field");
    expect((input.element as HTMLInputElement).value).toBe("");
    expect(input.attributes("placeholder")).toBe("Select time");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("uses custom placeholder text", () => {
    const wrapper = mount(TimePicker, {
      props: {
        modelValue: null,
        format: "HH:mm",
        placeholder: "Pick a time",
      },
    });

    const input = wrapper.find("input.timepicker-field");
    expect(input.attributes("placeholder")).toBe("Pick a time");
  });

  it("does not crash when disabledTimes contains malformed object values", () => {
    expect(() => {
      mount(TimePicker, {
        props: {
          modelValue: "12:00:00",
          format: "HH:mm",
          disabledTimes: [{ bad: "value" }] as any,
        },
      });
    }).not.toThrow();
  });

  it("disables input and prevents dropdown opening when disabled=true", async () => {
    const wrapper = mount(TimePicker, {
      props: {
        modelValue: "12:00:00",
        format: "HH:mm",
        disabled: true,
      },
    });

    const input = wrapper.find("input.timepicker-field");
    expect(input.attributes("disabled")).toBeDefined();

    await input.trigger("focus");
    await nextTick();

    expect(wrapper.find(".vtp-cols").exists()).toBe(false);
  });

  it("clamps typed single value to minTime", async () => {
    const wrapper = mount(TimePicker, {
      props: {
        modelValue: "12:00:00",
        format: "HH:mm",
        minTime: "13:15:00",
        maxTime: "20:00:00",
      },
    });

    const input = wrapper.find("input.timepicker-field");
    const inputEl = input.element as HTMLInputElement;

    await typeDigits(inputEl, input, "0900");
    await input.trigger("blur");

    const emitted = wrapper.emitted("update:modelValue") ?? [];
    const last = emitted[emitted.length - 1]?.[0];
    expect(last).toBe("13:15:00");
  });

  it("clamps typed range end value to maxTime", async () => {
    const wrapper = mount(TimePicker, {
      props: {
        range: true,
        modelValue: ["10:00:00", "12:00:00"],
        format: "HH:mm",
        minTime: "09:00:00",
        maxTime: "17:30:00",
      },
    });

    const inputs = wrapper.findAll("input.timepicker-field");
    expect(inputs.length).toBe(2);

    const secondInput = inputs[1];
    const secondEl = secondInput.element as HTMLInputElement;

    await typeDigits(secondEl, secondInput, "2300");
    await secondInput.trigger("blur");

    const emitted = wrapper.emitted("update:modelValue") ?? [];
    const last = emitted[emitted.length - 1]?.[0] as [string, string];

    expect(last[0]).toBe("10:00:00");
    expect(last[1]).toBe("17:30:00");
  });

  it("disables out-of-range minute options in dropdown", async () => {
    const wrapper = mount(TimeSelection, {
      props: {
        open: true,
        initTime: { h: 9, m: 0, s: 0 },
        format: "HH:mm",
        hourStep: 1,
        minuteStep: 30,
        secondStep: 1,
        minTime: { h: 9, m: 30, s: 0 },
        maxTime: { h: 10, m: 30, s: 0 },
      },
    });

    await nextTick();

    const panels = wrapper.findAll(".timepicker-dropdown__panel");
    expect(panels.length).toBe(2);

    const hourOptions = panels[0].findAll(".timepicker-option");
    const hour08 = hourOptions.find((o) => o.text() === "08");
    expect(hour08?.classes()).toContain("timepicker-option--disabled");

    const minuteOptions = panels[1].findAll(".timepicker-option");
    const minute00 = minuteOptions.find((o) => o.text() === "00");
    const minute30 = minuteOptions.find((o) => o.text() === "30");

    expect(minute00?.classes()).toContain("timepicker-option--disabled");
    expect(minute30?.classes()).not.toContain("timepicker-option--disabled");
  });

  it("rejects disabledTimes on commit and emits invalid validation", async () => {
    const wrapper = mount(TimePicker, {
      props: {
        modelValue: "12:00:00",
        format: "HH:mm",
        disabledTimes: [["13:00:00", "14:00:00"]],
      },
    });

    const input = wrapper.find("input.timepicker-field");
    const inputEl = input.element as HTMLInputElement;

    await typeDigits(inputEl, input, "1330");
    await input.trigger("blur");

    const updates = wrapper.emitted("update:modelValue") ?? [];
    const lastUpdate = updates[updates.length - 1]?.[0];
    expect(lastUpdate).toBe("12:00:00");

    const validations = wrapper.emitted("validate") ?? [];
    const lastValidation = validations[validations.length - 1]?.[0];
    expect(lastValidation.state).toBe("invalid");
    expect(lastValidation.reason).toBe("DISABLED");

    const stateUpdates = wrapper.emitted("update:validationState") ?? [];
    const lastState = stateUpdates[stateUpdates.length - 1]?.[0];
    expect(lastState).toBe("invalid");
  });

  it("emits out-of-range state when clamping occurs", async () => {
    const wrapper = mount(TimePicker, {
      props: {
        modelValue: "12:00:00",
        format: "HH:mm",
        minTime: "13:15:00",
      },
    });

    const input = wrapper.find("input.timepicker-field");
    const inputEl = input.element as HTMLInputElement;

    await typeDigits(inputEl, input, "0900");
    await input.trigger("blur");

    const validations = wrapper.emitted("validate") ?? [];
    const outOfRange = validations
      .map((entry) => entry[0])
      .find((payload) => payload.state === "out-of-range");

    expect(outOfRange).toBeTruthy();
    expect(outOfRange.reason).toBe("OUT_OF_RANGE");

    const stateUpdates = wrapper.emitted("update:validationState") ?? [];
    const lastState = stateUpdates[stateUpdates.length - 1]?.[0];
    expect(lastState).toBe("out-of-range");
  });

  it("uses isTimeDisabled callback to disable options", async () => {
    const wrapper = mount(TimeSelection, {
      props: {
        open: true,
        initTime: { h: 10, m: 0, s: 0 },
        format: "HH:mm",
        hourStep: 1,
        minuteStep: 30,
        secondStep: 1,
        isTimeDisabled: (time: InternalFormat) =>
          time.h === 10 && time.m === 30,
      },
    });

    await nextTick();

    const panels = wrapper.findAll(".timepicker-dropdown__panel");
    const minuteOptions = panels[1].findAll(".timepicker-option");
    const minute30 = minuteOptions.find((o) => o.text() === "30");

    expect(minute30?.classes()).toContain("timepicker-option--disabled");
  });
});
