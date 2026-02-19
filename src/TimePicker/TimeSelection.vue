<template>
  <div class="vtp-cols" v-if="openLocal" ref="root">
    <TimeColumn
      v-model:activeIndex="hourIdx"
      :items="hoursList"
      label="Hours"
    />

    <TimeColumn
      v-model:activeIndex="minuteIdx"
      :items="minutesList"
      label="Minutes"
      @select="onMinuteSelect"
    />

    <TimeColumn
      v-if="showSecondsUI"
      v-model:activeIndex="secondIdx"
      :items="secondsList"
      label="Seconds"
      @select="onSecondSelect"
    />

    <TimeColumn
      v-if="show12UI"
      v-model:activeIndex="ampmIdx"
      :items="ampmList"
      label="AM/PM"
      @select="onAmpmSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import TimeColumn from "./TimeColumn.vue";
import { InternalFormat, Item  } from "./types";
import {
  hasK,
  hasSeconds,
  is12h,
  isPm,
  to24,
} from "../helpers";

const show12UI = computed(() => is12h(props.format));
const showSecondsUI = computed(() => hasSeconds(props.format));
const isKFormat = computed(() => hasK(props.format));

const props = defineProps<{
  open: boolean;
  initTime: InternalFormat;

  format: string;

  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
}>();

// v-model updates
const emit = defineEmits<{
  (e: "update:initTime", v: InternalFormat): void;
  (e: "open"): void;
  (e: "close"): void;
  (e: "update:open", v: boolean): void;
}>();

const openLocal = computed({
  get: () => props.open ?? false,
  set: (v: boolean) => {
    const prev = props.open ?? false;
    if (v === prev) return;
    emit("update:open", v);
    v ? emit("open") : emit("close");
  },
});

/* ================================
 * Open/close & outside click
 * ================================ */
const root = ref<HTMLElement | null>(null);

/** Outside click: close if click is not inside */
function onDocMousedown(e: MouseEvent) {
  if (!openLocal.value) return;
  const t = e.target as Node;
  if (root.value && !root.value.contains(t)) {
    openLocal.value = false; // closes via update:open
  }
}
onMounted(() => document.addEventListener("mousedown", onDocMousedown));
onBeforeUnmount(() =>
  document.removeEventListener("mousedown", onDocMousedown)
);

/**  ESC to close */
function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && openLocal.value) openLocal.value = false;
}
onMounted(() => document.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => document.removeEventListener("keydown", onKeydown));

const hourIdx = ref(Math.floor(props.initTime.h / props.hourStep!) || 0);
const minuteIdx = ref(Math.floor(props.initTime.m / props.minuteStep!) || 0);
const secondIdx = ref(Math.floor(props.initTime.s / props.secondStep!) || 0);

// Keep indices in sync when initTime changes externally (e.g. typed input)
watch(
  () => props.initTime,
  (t) => {
    const hStep = Math.max(1, props.hourStep!);
    const mStep = Math.max(1, props.minuteStep!);
    const sStep = Math.max(1, props.secondStep!);

    let hForIdx = t.h;
    if (show12UI.value) {
      // In 12-h mode the list is indexed 0..11/step; derive the 12-h value
      ampmIdx.value = t.h >= 12 ? 1 : 0;
      hForIdx = t.h % 12; // 0-based for list lookup
    } else if (isKFormat.value && t.h === 0) {
      hForIdx = 24;
    }

    hourIdx.value = Math.floor(hForIdx / hStep);
    minuteIdx.value = Math.floor(t.m / mStep);
    secondIdx.value = Math.floor(t.s / sStep);
  },
);
function makeList(max: number, step: number): Item[] {
  const arr: Item[] = [];
  for (let i = 0; i < max; i += Math.max(1, step)) {
    arr.push({ key: i, value: i, text: String(i).padStart(2, "0") });
  }
  return arr;
}

function make12HourList(isPm: boolean, step: number): Item[] {
  const s = Math.max(1, step);
  const arr: Item[] = [];
  for (let i = 0; i < 12; i += s) {
    const h12 = i === 0 ? 12 : i; // label: 12,1..11
    const h24 = isPm ? (i === 0 ? 12 : i + 12) : i; // value: 12..23 or 0..11
    arr.push({ key: h24, value: h24, text: String(h12).padStart(2, "0") });
  }
  return arr;
}

function makeKHourList(step: number): Item[] {
  const s = Math.max(1, step);
  const arr: Item[] = [];
  for (let i = 0; i < 24; i += s) {
    const kFormat = i === 0 ? 24 : i; // label: 24,1..23
    arr.push({ key: i, value: i, text: String(kFormat).padStart(2, "0") });
  }
  return arr;
}

// AM/PM: 0 = AM, 1 = PM
const ampmIdx = ref(isPm(props.format) ? 1 : 0);

const hoursList = computed<Item[]>(() => {
  if (!show12UI.value) {
    if (isKFormat.value) return makeKHourList(props.hourStep!);
    return makeList(24, props.hourStep!);
  }
  const isPmNow = ampmIdx.value === 1;
  return make12HourList(isPmNow, props.hourStep!);
});
const minutesList = computed<Item[]>(() => makeList(60, props.minuteStep!));
const secondsList = computed<Item[]>(() => makeList(60, props.secondStep!));
const ampmLower = computed(() => /\s[ap]$/.test(props.format));
const ampmList = computed<Item[]>(() => {
  const am = ampmLower.value ? "am" : "AM";
  const pm = ampmLower.value ? "pm" : "PM";
  return [
    { key: "AM", value: "AM", text: am },
    { key: "PM", value: "PM", text: pm },
  ];
});

/* ================================
 * Selected values (internal 24h)
 * ================================ */
const ampmVal = computed(() => (ampmIdx.value === 1 ? "PM" : "AM"));

const hourVal = computed(() => {
  const hour = Number(hoursList.value[hourIdx.value]?.value ?? 0);
  if (show12UI.value) {
    // convert am/pm
    return ampmVal.value === "PM" ? to24(hour, true) : to24(hour, false);
  }
  if (isKFormat.value && hour === 24) return 0; // convert k format
  return hour;
});

const minuteVal = computed(() =>
  Number(minutesList.value[minuteIdx.value]?.value ?? 0)
);
const secondVal = computed(() =>
  Number(secondsList.value[secondIdx.value]?.value ?? 0)
);

/* ================================
 * Handlers
 * ================================ */
function onMinuteSelect(_: number) {
  // If there are no seconds and no AM/PM column, confirm immediately
  if (!showSecondsUI.value && !show12UI.value) confirm();
}
function onSecondSelect(_: number) {
  // If there’s no AM/PM column, we can confirm now
  if (!show12UI.value) confirm();
}
function onAmpmSelect(_: string) {
  confirm();
}

function confirm() {
  openLocal.value = false;
}


watch(
  [hourVal, minuteVal, secondVal],
  ([h, m, s]) => {
    const obj = { h, m, s };
    emit("update:initTime", obj);
  },
  { immediate: true }
);
</script>
