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
import { InternalFormat, Item } from "./types";
import {
  hasK,
  hasSeconds,
  isTimeInRanges,
  is12h,
  isPm,
  isTimeWithinBounds,
  to24,
} from "../helpers";

function normalizeStep(step: number | undefined): number {
  return Math.max(1, step ?? 1);
}

const show12UI = computed(() => is12h(props.format));
const showSecondsUI = computed(() => hasSeconds(props.format));
const isKFormat = computed(() => hasK(props.format));

const props = defineProps<{
  open: boolean;
  initTime: InternalFormat;

  format: string;
  minTime?: InternalFormat | null;
  maxTime?: InternalFormat | null;
  disabledRanges?: Array<[InternalFormat, InternalFormat]>;
  isTimeDisabled?: (time: InternalFormat) => boolean;

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
 * Open / close interactions
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
  document.removeEventListener("mousedown", onDocMousedown),
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

/* ================================
 * External model -> internal indices
 * ================================ */

// Keep indices in sync when initTime changes externally (e.g. typed input)
watch(
  () => props.initTime,
  (t) => {
    const hStep = normalizeStep(props.hourStep);
    const mStep = normalizeStep(props.minuteStep);
    const sStep = normalizeStep(props.secondStep);

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
  for (let i = 0; i < max; i += normalizeStep(step)) {
    arr.push({ key: i, value: i, text: String(i).padStart(2, "0") });
  }
  return arr;
}

function make12HourList(isPm: boolean, step: number): Item[] {
  const s = normalizeStep(step);
  const arr: Item[] = [];
  for (let i = 0; i < 12; i += s) {
    const h12 = i === 0 ? 12 : i; // label: 12,1..11
    const h24 = isPm ? (i === 0 ? 12 : i + 12) : i; // value: 12..23 or 0..11
    arr.push({ key: h24, value: h24, text: String(h12).padStart(2, "0") });
  }
  return arr;
}

function makeKHourList(step: number): Item[] {
  const s = normalizeStep(step);
  const arr: Item[] = [];
  for (let i = 0; i < 24; i += s) {
    const kFormat = i === 0 ? 24 : i; // label: 24,1..23
    arr.push({ key: i, value: i, text: String(kFormat).padStart(2, "0") });
  }
  return arr;
}

// AM/PM: 0 = AM, 1 = PM
const ampmIdx = ref(isPm(props.format) ? 1 : 0);

const baseHoursList = computed<Item[]>(() => {
  if (!show12UI.value) {
    if (isKFormat.value) return makeKHourList(props.hourStep!);
    return makeList(24, props.hourStep!);
  }
  const isPmNow = ampmIdx.value === 1;
  return make12HourList(isPmNow, props.hourStep!);
});
const baseMinutesList = computed<Item[]>(() => makeList(60, props.minuteStep!));
const baseSecondsList = computed<Item[]>(() => makeList(60, props.secondStep!));
const ampmLower = computed(() => /\s[ap]$/.test(props.format));
const baseAmpmList = computed<Item[]>(() => {
  const am = ampmLower.value ? "am" : "AM";
  const pm = ampmLower.value ? "pm" : "PM";
  return [
    { key: "AM", value: "AM", text: am },
    { key: "PM", value: "PM", text: pm },
  ];
});

const minuteCandidates = computed<number[]>(() =>
  baseMinutesList.value.map((item) => Number(item.value ?? 0)),
);
const secondCandidates = computed<number[]>(() => {
  if (!showSecondsUI.value) return [0];
  return baseSecondsList.value.map((item) => Number(item.value ?? 0));
});

function getHour24(item: Item): number {
  return Number(item.value ?? 0);
}

function findFirstEnabledIndex(items: Item[]): number {
  const idx = items.findIndex((item) => !item.disabled);
  return idx >= 0 ? idx : 0;
}

function isCandidateEnabled(time: InternalFormat): boolean {
  if (!isTimeWithinBounds(time, props.minTime, props.maxTime)) return false;
  if (isTimeInRanges(time, props.disabledRanges ?? [])) return false;
  if (props.isTimeDisabled?.(time)) return false;
  return true;
}

const hoursList = computed<Item[]>(() => {
  return baseHoursList.value.map((item) => {
    const candidateHour = getHour24(item);
    const hasValidCombo = minuteCandidates.value.some((minute) =>
      secondCandidates.value.some((second) =>
        isCandidateEnabled({ h: candidateHour, m: minute, s: second }),
      ),
    );

    return {
      ...item,
      disabled: !hasValidCombo,
    };
  });
});

const minutesList = computed<Item[]>(() => {
  const selectedHour = Number(baseHoursList.value[hourIdx.value]?.value ?? 0);
  return baseMinutesList.value.map((item) => {
    const candidateMinute = Number(item.value ?? 0);
    const hasValidCombo = secondCandidates.value.some((second) =>
      isCandidateEnabled({ h: selectedHour, m: candidateMinute, s: second }),
    );

    return {
      ...item,
      disabled: !hasValidCombo,
    };
  });
});

const secondsList = computed<Item[]>(() => {
  const selectedHour = Number(baseHoursList.value[hourIdx.value]?.value ?? 0);
  const selectedMinute = Number(
    baseMinutesList.value[minuteIdx.value]?.value ?? 0,
  );
  return baseSecondsList.value.map((item) => {
    const candidateSecond = Number(item.value ?? 0);
    return {
      ...item,
      disabled: !isCandidateEnabled({
        h: selectedHour,
        m: selectedMinute,
        s: candidateSecond,
      }),
    };
  });
});

const ampmList = computed<Item[]>(() => {
  if (!show12UI.value) return baseAmpmList.value;

  const minute = Number(baseMinutesList.value[minuteIdx.value]?.value ?? 0);
  const second = showSecondsUI.value
    ? Number(baseSecondsList.value[secondIdx.value]?.value ?? 0)
    : 0;

  return baseAmpmList.value.map((item) => {
    const isPmMode = item.value === "PM";
    const hasValidCombo = make12HourList(isPmMode, props.hourStep!).some(
      (hourItem) =>
        isCandidateEnabled({
          h: Number(hourItem.value ?? 0),
          m: minute,
          s: second,
        }),
    );

    return {
      ...item,
      disabled: !hasValidCombo,
    };
  });
});

/* ================================
 * Selected values (internal 24h)
 * ================================ */
const ampmVal = computed(() => (ampmIdx.value === 1 ? "PM" : "AM"));

const hourVal = computed(() => {
  const hour = Number(baseHoursList.value[hourIdx.value]?.value ?? 0);
  if (show12UI.value) {
    // convert am/pm
    return ampmVal.value === "PM" ? to24(hour, true) : to24(hour, false);
  }
  if (isKFormat.value && hour === 24) return 0; // convert k format
  return hour;
});

const minuteVal = computed(() =>
  Number(baseMinutesList.value[minuteIdx.value]?.value ?? 0),
);
const secondVal = computed(() =>
  Number(baseSecondsList.value[secondIdx.value]?.value ?? 0),
);

function syncIndexWithEnabledItems(
  items: Item[],
  currentIndex: number,
  updateIndex: (next: number) => void,
) {
  if (!items.length) return;
  if (!items[currentIndex] || items[currentIndex].disabled) {
    updateIndex(findFirstEnabledIndex(items));
  }
}

watch(hoursList, (items) => {
  syncIndexWithEnabledItems(items, hourIdx.value, (next) => {
    hourIdx.value = next;
  });
});

watch(minutesList, (items) => {
  syncIndexWithEnabledItems(items, minuteIdx.value, (next) => {
    minuteIdx.value = next;
  });
});

watch(secondsList, (items) => {
  if (!showSecondsUI.value || !items.length) return;
  syncIndexWithEnabledItems(items, secondIdx.value, (next) => {
    secondIdx.value = next;
  });
});

watch(ampmList, (items) => {
  if (!show12UI.value || !items.length) return;
  syncIndexWithEnabledItems(items, ampmIdx.value, (next) => {
    ampmIdx.value = next;
  });
});

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
  { immediate: true },
);
</script>
