<template>
  <div
    class="vtp-cols"
    v-if="openLocal"
    ref="root"
    :id="id"
    role="dialog"
    aria-label="Choose time"
  >
    <TimeColumn
      v-model:activeIndex="hourIdx"
      :items="hoursList"
      :id="columnId('h')"
      label="Hours"
    />

    <TimeColumn
      v-model:activeIndex="minuteIdx"
      :items="minutesList"
      :id="columnId('m')"
      label="Minutes"
      @select="onMinuteSelect"
    />

    <TimeColumn
      v-if="showSecondsUI"
      v-model:activeIndex="secondIdx"
      :items="secondsList"
      :id="columnId('s')"
      label="Seconds"
      @select="onSecondSelect"
    />

    <TimeColumn
      v-if="show12UI"
      v-model:activeIndex="ampmIdx"
      :items="ampmList"
      :id="columnId('ampm')"
      label="AM/PM"
      @select="onAmpmSelect"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  type Ref,
  type ComputedRef,
} from "vue";
import TimeColumn from "./TimeColumn.vue";
import { InternalFormat, Item } from "./types";
import {
  hasK,
  hasSeconds,
  isTimeInRanges,
  is12h,
  isTimeWithinBounds,
} from "../helpers";

function normalizeStep(step: number | undefined): number {
  return Math.max(1, step ?? 1);
}

const props = defineProps<{
  id?: string;
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

const show12UI = computed(() => is12h(props.format));
const showSecondsUI = computed(() => hasSeconds(props.format));
const isKFormat = computed(() => hasK(props.format));

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

/** Outside click/tap: close if not inside (pointerdown also fires for iOS taps) */
function onDocPointerdown(e: PointerEvent) {
  if (!openLocal.value) return;
  const t = e.target as Node;
  if (root.value && !root.value.contains(t)) {
    openLocal.value = false; // closes via update:open
  }
}
onMounted(() => document.addEventListener("pointerdown", onDocPointerdown));
onBeforeUnmount(() =>
  document.removeEventListener("pointerdown", onDocPointerdown),
);

/**  ESC to close */
function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && openLocal.value) openLocal.value = false;
}
onMounted(() => document.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => document.removeEventListener("keydown", onKeydown));

const hourIdx = ref(0);
const minuteIdx = ref(0);
const secondIdx = ref(0);
// AM/PM: 0 = AM, 1 = PM
const ampmIdx = ref(0);

function syncIndicesFromTime(t: InternalFormat) {
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
}

/* ================================
 * External model -> internal indices
 * ================================ */

// Keep indices in sync when initTime changes externally (e.g. typed input)
watch(
  () => props.initTime,
  (t) => {
    syncIndicesFromTime(t);
  },
  { immediate: true },
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

/* ================================
 * Selected values (internal 24h)
 * Note: hour list items already carry 24-h values, so no conversion needed.
 * ================================ */
const hourVal = computed(() =>
  Number(baseHoursList.value[hourIdx.value]?.value ?? 0),
);
const minuteVal = computed(() =>
  Number(baseMinutesList.value[minuteIdx.value]?.value ?? 0),
);
const secondVal = computed(() =>
  Number(baseSecondsList.value[secondIdx.value]?.value ?? 0),
);

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

/** Copy items, disabling those whose value yields no enabled time */
function markDisabled(items: Item[], isEnabled: (value: number) => boolean) {
  return items.map((item) => ({
    ...item,
    disabled: !isEnabled(Number(item.value ?? 0)),
  }));
}

const hoursList = computed<Item[]>(() =>
  markDisabled(baseHoursList.value, (hour) =>
    minuteCandidates.value.some((minute) =>
      secondCandidates.value.some((second) =>
        isCandidateEnabled({ h: hour, m: minute, s: second }),
      ),
    ),
  ),
);

const minutesList = computed<Item[]>(() =>
  markDisabled(baseMinutesList.value, (minute) =>
    secondCandidates.value.some((second) =>
      isCandidateEnabled({ h: hourVal.value, m: minute, s: second }),
    ),
  ),
);

const secondsList = computed<Item[]>(() =>
  markDisabled(baseSecondsList.value, (second) =>
    isCandidateEnabled({ h: hourVal.value, m: minuteVal.value, s: second }),
  ),
);

const ampmList = computed<Item[]>(() => {
  if (!show12UI.value) return baseAmpmList.value;

  const minute = minuteVal.value;
  const second = showSecondsUI.value ? secondVal.value : 0;

  return baseAmpmList.value.map((item) => {
    const hasValidCombo = make12HourList(
      item.value === "PM",
      props.hourStep!,
    ).some((hourItem) =>
      isCandidateEnabled({
        h: Number(hourItem.value ?? 0),
        m: minute,
        s: second,
      }),
    );

    return { ...item, disabled: !hasValidCombo };
  });
});

/** When a list changes, move its index off a disabled/missing item. */
function keepIndexOnEnabledItem(
  list: ComputedRef<Item[]>,
  idx: Ref<number>,
  isActive?: () => boolean,
) {
  watch(list, (items) => {
    if (isActive && !isActive()) return;
    if (!items.length) return;
    if (!items[idx.value] || items[idx.value].disabled) {
      idx.value = findFirstEnabledIndex(items);
    }
  });
}

keepIndexOnEnabledItem(hoursList, hourIdx);
keepIndexOnEnabledItem(minutesList, minuteIdx);
keepIndexOnEnabledItem(secondsList, secondIdx, () => showSecondsUI.value);
keepIndexOnEnabledItem(ampmList, ampmIdx, () => show12UI.value);

/* ================================
 * Handlers
 * ================================ */
function onMinuteSelect() {
  // If there are no seconds and no AM/PM column, confirm immediately
  if (!showSecondsUI.value && !show12UI.value) confirm();
}
function onSecondSelect() {
  // If there’s no AM/PM column, we can confirm now
  if (!show12UI.value) confirm();
}
function onAmpmSelect() {
  confirm();
}

function confirm() {
  openLocal.value = false;
}

const columns = {
  h: [hoursList, hourIdx],
  m: [minutesList, minuteIdx],
  s: [secondsList, secondIdx],
  ampm: [ampmList, ampmIdx],
} as const;

const columnId = (column: keyof typeof columns) =>
  props.id && `${props.id}-${column}`;

/** Move a column to the next enabled item in `dir`, wrapping around. */
function step(column: keyof typeof columns, dir: 1 | -1) {
  const [list, idx] = columns[column];
  const n = list.value.length;
  for (let k = 1; k < n; k++) {
    const i = (((idx.value + dir * k) % n) + n) % n;
    if (!list.value[i].disabled) {
      idx.value = i;
      return;
    }
  }
}

defineExpose({ step });

watch(
  [hourVal, minuteVal, secondVal],
  ([h, m, s]) => {
    const obj = { h, m, s };
    emit("update:initTime", obj);
  },
  { immediate: true },
);
</script>
