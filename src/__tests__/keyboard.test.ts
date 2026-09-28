import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import TimePicker from "../TimePicker/TimePicker.vue";

async function openAt(props: Record<string, unknown>, caret: number) {
  const wrapper = mount(TimePicker, { props, attachTo: document.body });
  const input = wrapper.find("input");
  await input.trigger("focus");
  const el = input.element as HTMLInputElement;
  el.setSelectionRange(caret, caret);
  return { wrapper, input };
}

function lastModel(wrapper: any) {
  return wrapper.emitted("update:modelValue")?.at(-1)?.[0];
}

describe("keyboard interaction", () => {
  it("ArrowDown opens a closed popover", async () => {
    const wrapper = mount(TimePicker, {
      props: { modelValue: "10:00:00", format: "HH:mm" },
    });
    const input = wrapper.find("input");
    expect(input.attributes("aria-expanded")).toBe("false");

    await input.trigger("keydown", { key: "ArrowDown" });
    expect(input.attributes("aria-expanded")).toBe("true");
  });

  it("steps the segment under the caret", async () => {
    const { wrapper, input } = await openAt(
      { modelValue: "10:00:00", format: "HH:mm" },
      3,
    );
    await input.trigger("keydown", { key: "ArrowDown" });
    expect(lastModel(wrapper)).toBe("10:01:00");

    (input.element as HTMLInputElement).setSelectionRange(0, 0);
    await input.trigger("keydown", { key: "ArrowUp" });
    await nextTick();
    expect(lastModel(wrapper)).toBe("09:01:00");
  });

  it("skips disabled values", async () => {
    const { wrapper, input } = await openAt(
      { modelValue: "10:00:00", format: "HH:mm", disabledTimes: ["10:01:00"] },
      3,
    );
    await input.trigger("keydown", { key: "ArrowDown" });
    expect(lastModel(wrapper)).toBe("10:02:00");
  });

  it("toggles AM/PM when the caret is on the meridiem", async () => {
    const { wrapper, input } = await openAt(
      { modelValue: "10:00:00", format: "hh:mm A" },
      7,
    );
    await input.trigger("keydown", { key: "ArrowDown" });
    expect(lastModel(wrapper)).toBe("22:00:00");
  });

  it("Enter closes the popover", async () => {
    const { wrapper, input } = await openAt(
      { modelValue: "10:00:00", format: "HH:mm" },
      0,
    );
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true);

    await input.trigger("keydown", { key: "Enter" });
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
  });
});

describe("aria", () => {
  it("links the input to its popover and labels the columns", async () => {
    const { wrapper, input } = await openAt(
      { modelValue: "10:30:00", format: "HH:mm" },
      0,
    );
    const dialog = wrapper.find('[role="dialog"]');
    const listboxes = wrapper.findAll('[role="listbox"]');
    expect(input.attributes("role")).toBe("combobox");
    expect(input.attributes("aria-controls")?.split(" ")).toEqual(
      [dialog, ...listboxes].map((el) => el.attributes("id")),
    );

    expect(listboxes.map((l) => l.attributes("aria-label"))).toEqual([
      "Hours",
      "Minutes",
    ]);
    expect(wrapper.find("[label]").exists()).toBe(false);
  });

  it("keeps options out of the tab order and marks the selection", async () => {
    const { wrapper } = await openAt(
      { modelValue: "10:30:00", format: "HH:mm" },
      0,
    );
    const options = wrapper.findAll('[role="option"]');
    expect(options.some((o) => o.attributes("tabindex") !== undefined)).toBe(
      false,
    );
    const selected = wrapper.findAll('[aria-selected="true"]');
    expect(selected.map((o) => o.text())).toEqual(["10", "30"]);
  });
});
