<template>
  <div class="timepicker-dropdown">
    <!-- Menu -->
    <div
      ref="menu"
      class="timepicker-dropdown__panel"
      role="listbox"
      tabindex="-1"
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
        @click="!item.disabled && setActive(i)"
        @mousemove="!item.disabled && (focusIndex = i)"
      >
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from "vue";

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

function scrollToActive() {
  nextTick(() => {
    const panel = menu.value;
    if (!panel) return;
    const activeEl = panel.querySelector(".timepicker-option--active") as HTMLElement | null;
    if (activeEl) {
      // Center the active item in the scrollable panel
      const panelHeight = panel.clientHeight;
      const elTop = activeEl.offsetTop;
      const elHeight = activeEl.offsetHeight;
      panel.scrollTop = elTop - panelHeight / 2 + elHeight / 2;
    }
  });
}

onMounted(scrollToActive);

// Re-scroll when the active index changes (e.g. typed input updates model)
watch(() => props.activeIndex, scrollToActive);

function setActive(i: number) {
  emit("update:activeIndex", i);
  emit("select", props.items[i]?.value);
}

const focusIndex = ref<number>(props.activeIndex ?? 0);
</script>

<style src="../styles/timepicker.css"></style>
