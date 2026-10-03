import { afterEach, describe, expect, it } from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { nextTick } from "vue";
import TimePicker from "../TimePicker/TimePicker.vue";

enableAutoUnmount(afterEach);

function mountOpen(props: Record<string, unknown>) {
  const wrapper = mount(TimePicker, { props, attachTo: document.body });
  const input = wrapper.find("input");
  return { wrapper, input, el: input.element as HTMLInputElement };
}

/** Android soft keyboards: keydown is "Unidentified", text comes via beforeinput */
async function androidType(input: any, el: HTMLInputElement, text: string) {
  for (const ch of text) {
    await input.trigger("keydown", { key: "Unidentified" });
    el.dispatchEvent(
      new InputEvent("beforeinput", {
        inputType: "insertText",
        data: ch,
        cancelable: true,
        bubbles: true,
      }),
    );
  }
  await nextTick();
}

describe("mobile", () => {
  it("tapping outside closes the popover (pointerdown)", async () => {
    const { wrapper, input } = mountOpen({
      modelValue: "10:00:00",
      format: "HH:mm",
    });
    await input.trigger("focus");
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true);

    document.body.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true }),
    );
    await nextTick();
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
  });

  it("tapping the already-focused input reopens the popover", async () => {
    const { wrapper, input, el } = mountOpen({
      modelValue: "10:00:00",
      format: "HH:mm",
    });
    await input.trigger("focus");
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await nextTick();
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);

    await input.trigger("click");
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
  });

  it("pressing the picker's own input does not close its popover", async () => {
    const { wrapper, input, el } = mountOpen({
      modelValue: "10:00:00",
      format: "HH:mm",
    });
    await input.trigger("focus");
    el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    await nextTick();
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
    expect(wrapper.emitted("close")).toBeUndefined();
  });

  it("Android typing moves on to the second range input", async () => {
    const { wrapper, input, el } = mountOpen({
      modelValue: ["09:00:00", "17:00:00"],
      range: true,
      format: "HH:mm:ss",
    });
    await input.trigger("focus");
    el.setSelectionRange(0, 0);

    await androidType(input, el, "101010");
    await nextTick();
    expect(document.activeElement).toBe(wrapper.findAll("input")[1].element);
  });

  it("overwrites digits typed on an Android keyboard", async () => {
    const { wrapper, input, el } = mountOpen({
      modelValue: "12:30:00",
      format: "HH:mm:ss",
    });
    await input.trigger("focus");
    el.setSelectionRange(0, 0);

    await androidType(input, el, "0915");
    expect(el.value).toBe("09:15:00");
    expect(wrapper.emitted("update:modelValue")?.at(-1)?.[0]).toBe("09:15:00");
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
  });

  it("Android backspace moves the caret left without erasing", async () => {
    const { input, el } = mountOpen({
      modelValue: "12:30:00",
      format: "HH:mm",
    });
    await input.trigger("focus");
    el.setSelectionRange(5, 5);

    el.dispatchEvent(
      new InputEvent("beforeinput", {
        inputType: "deleteContentBackward",
        cancelable: true,
        bubbles: true,
      }),
    );
    expect(el.value).toBe("12:30");
    expect(el.selectionStart).toBe(4);
  });

  it("shows the numeric keypad", () => {
    const { input } = mountOpen({ modelValue: null, format: "HH:mm" });
    expect(input.attributes("inputmode")).toBe("numeric");
  });
});
