<template>
  <div
    class="timepicker-dropdown"
    :class="{
      'timepicker-dropdown--short': items.length <= 3,
    }"
  >
    <div
      ref="menu"
      class="timepicker-dropdown__panel"
      role="listbox"
      tabindex="-1"
      @scroll="onPanelScroll"
    >
      <div
        v-for="(item, i) in items"
        :key="item.key"
        class="timepicker-option"
        :class="{
          'timepicker-option--active': i === activeIndex,
          'timepicker-option--disabled': item.disabled,
          'timepicker-option--focused': i === focusIndex,
        }"
        role="option"
        :tabindex="item.disabled ? -1 : 0"
        @click="!item.disabled && onOptionClick(i)"
        @mousemove="!item.disabled && (focusIndex = i)"
      >
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount } from "vue";

const props = defineProps<{
  items: Array<{
    key: string | number;
    value: any;
    text: string;
    disabled?: boolean;
  }>;
  activeIndex: number;
}>();

const emit = defineEmits<{
  (e: "update:activeIndex", index: number): void;
  (e: "select", v: any): void;
}>();

const menu = ref<HTMLElement | null>(null);
const isSyncingScroll = ref(false);
let syncScrollTimer: ReturnType<typeof setTimeout> | null = null;

function getClosestIndexToCenter(panel: HTMLElement): number {
  const options = Array.from(panel.querySelectorAll(".timepicker-option"));
  if (!options.length) return 0;

  const panelCenter = panel.scrollTop + panel.clientHeight / 2;
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (let i = 0; i < options.length; i++) {
    const option = options[i] as HTMLElement;
    const center = option.offsetTop + option.offsetHeight / 2;
    const distance = Math.abs(center - panelCenter);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  }

  return closestIndex;
}

function findNearestEnabledIndex(start: number): number {
  if (!props.items.length) return 0;
  if (!props.items[start]?.disabled) return start;

  for (let offset = 1; offset < props.items.length; offset++) {
    const up = start - offset;
    const down = start + offset;

    if (up >= 0 && !props.items[up]?.disabled) return up;
    if (down < props.items.length && !props.items[down]?.disabled) return down;
  }

  return start;
}

function scrollToActive() {
  nextTick(() => {
    const panel = menu.value;
    if (!panel) return;
    const activeEl = panel.querySelector(
      ".timepicker-option--active",
    ) as HTMLElement | null;
    if (activeEl) {
      const panelHeight = panel.clientHeight;
      const elTop = activeEl.offsetTop;
      const elHeight = activeEl.offsetHeight;
      const nextTop = elTop - panelHeight / 2 + elHeight / 2;

      isSyncingScroll.value = true;
      panel.scrollTo({ top: nextTop, behavior: "auto" });

      if (syncScrollTimer) clearTimeout(syncScrollTimer);
      syncScrollTimer = setTimeout(() => {
        isSyncingScroll.value = false;
      }, 70);
    }
  });
}

function onPanelScroll() {
  const panel = menu.value;
  if (!panel || isSyncingScroll.value) return;

  const closest = getClosestIndexToCenter(panel);
  const nextFocus = findNearestEnabledIndex(closest);
  if (!props.items[nextFocus]?.disabled) {
    focusIndex.value = nextFocus;
  }
}

onMounted(scrollToActive);
onBeforeUnmount(() => {
  if (syncScrollTimer) clearTimeout(syncScrollTimer);
});

function setActive(i: number) {
  emit("update:activeIndex", i);
  emit("select", props.items[i]?.value);
}

function onOptionClick(i: number) {
  setActive(i);
}

const focusIndex = ref<number>(props.activeIndex ?? 0);
</script>

<style src="../styles/timepicker.css"></style>
