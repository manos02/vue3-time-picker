<template>
  <div class="timepicker-shell" :data-size="props.size">
    <!-- Input / trigger -->

    <template v-if="!props.range">
      <div
        class="timepicker-shell__input"
        :class="{ 'timepicker-shell__input--error': lastErrorCode }"
      >
        <input
          type="text"
          class="timepicker-field"
          :value="firstInputValue"
          :placeholder="resolvedFormat"
          :style="{ width: fieldWidth }"
          @focus="openFirst = true"
          @keydown="onFirstKeydown"
          @input="firstMask.handleInput"
          @paste="firstMask.handlePaste"
          @blur="commitMaskedTime('first')"
        />
      </div>
    </template>

    <template v-else>
      <div
        class="timepicker-shell__input"
        :class="{ 'timepicker-shell__input--error': lastErrorCode }"
      >
        <input
          type="text"
          class="timepicker-field"
          :value="firstInputValue"
          :placeholder="resolvedFormat"
          :style="{ width: fieldWidth }"
          @focus="openFirst = true"
          @keydown="onFirstKeydown"
          @input="firstMask.handleInput"
          @paste="firstMask.handlePaste"
          @blur="commitMaskedTime('first')"
        />
        <span class="timepicker-separator">–</span>
        <input
          ref="secondInputRef"
          type="text"
          class="timepicker-field"
          :value="secondInputValue"
          :placeholder="resolvedFormat"
          :style="{ width: fieldWidth }"
          @focus="openSecond = true"
          @keydown="onSecondKeydown"
          @input="secondMask.handleInput"
          @paste="secondMask.handlePaste"
          @blur="commitMaskedTime('second')"
        />
      </div>
    </template>

    <!-- Columns -->
    <div>
      <TimeSelection
        v-model:open="openFirst"
        v-model:initTime="firstInit"
        :format="props.format"
        :hour-step="props.hourStep"
        :minute-step="props.minuteStep"
        :second-step="props.secondStep"
      />

      <!-- render second selector only for range mode -->
      <TimeSelection
        v-if="props.range"
        v-model:open="openSecond"
        v-model:initTime="secondInit"
        :format="props.format"
        :hour-step="props.hourStep"
        :minute-step="props.minuteStep"
        :second-step="props.secondStep"
      />
    </div>
  </div>
  <!-- </div> -->
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import TimeSelection from "./TimeSelection.vue";
import { InternalFormat, timePickerProps, type TimePickerEmits } from "./types";
import { formatTime, parseFromModel } from "../helpers";
import { useTimeMask } from "./useTimeMask";

const lastErrorCode = ref<string | null>(null);
/* ================================
 * Props & emits
 * ================================ */
const props = defineProps(timePickerProps);
const emit = defineEmits<TimePickerEmits>();

const openFirst = ref(false);
const openSecond = ref(false);

// Ensure only one dropdown is open at a time
watch(openFirst, (v) => {
  if (v) openSecond.value = false;
});
watch(openSecond, (v) => {
  if (v) openFirst.value = false;
});

const init = computed<InternalFormat | [InternalFormat, InternalFormat]>({
  get() {
    if (Array.isArray(props.modelValue)) {
      const [a, b] = props.modelValue;
      return [parseFromModel(a, props.format), parseFromModel(b, props.format)];
    } else {
      return parseFromModel(props.modelValue, props.format);
    }
  },
  set(v) {
    if (Array.isArray(v)) {
      emit("update:modelValue", [
        formatTime("HH:mm:ss", v[0]),
        formatTime("HH:mm:ss", v[1]),
      ]);
    } else {
      emit("update:modelValue", formatTime("HH:mm:ss", v));
    }
  },
});

const firstInit = computed<InternalFormat>({
  get() {
    if (Array.isArray(init.value)) return init.value[0];
    return init.value;
  },
  set(v) {
    if (Array.isArray(init.value)) {
      init.value = [v, init.value[1]];
    } else {
      // convert single -> range
      init.value = v;
    }
  },
});

const secondInit = computed<InternalFormat>({
  get() {
    if (Array.isArray(init.value)) return init.value[1];
    return init.value;
  },
  set(v) {
    if (Array.isArray(init.value)) init.value = [init.value[0], v];
  },
});

// Display the selected time(s) in the input
const display = computed(() => {
  if (!props.modelValue) return "—";
  const fmt = (c: InternalFormat) => formatTime(props.format!, c);
  if (props.range) {
    return `${fmt(firstInit.value)} → ${fmt(secondInit.value)}`;
  }
  return fmt(firstInit.value);
});

watch(
  () => props.range,
  (newVal) => {
    if (newVal) {
      // Range selection
      if (!Array.isArray(props.modelValue)) {
        throw new RangeError(
          `Model value must be an array for range selection: ${props.modelValue}`,
        );
      }
    } else {
      // Handle single time selection
      if (Array.isArray(props.modelValue)) {
        throw new RangeError(
          `Model value must be a single string for single time selection: ${props.modelValue}`,
        );
      }
    }
  },
  { immediate: true },
);

const resolvedFormat = computed(() => props.format ?? "HH:mm:ss");
const fieldWidth = computed(() => {
  let length = resolvedFormat.value.length;
  // AM/PM token is 1 char in format but renders as 2 chars (am/pm/AM/PM)
  if (/[AaPp]$/.test(resolvedFormat.value)) length += 1;
  return `${Math.min(12, Math.max(4, length))}ch`;
});

/* ── Time-mask composables (one per input) ── */
const firstMask = useTimeMask(resolvedFormat);
const firstInputValue = firstMask.inputValue;

const secondMask = useTimeMask(resolvedFormat);
const secondInputValue = secondMask.inputValue;

// Sync mask ← model (column-picker changes, initial load, format change)
watch(
  () => [firstInit.value, resolvedFormat.value],
  ([val]) => {
    firstMask.setFromTime(val as InternalFormat);
  },
  { immediate: true },
);

watch(
  () => [secondInit.value, resolvedFormat.value, props.range],
  ([val, , isRange]) => {
    if (!isRange) {
      secondMask.setFromTime({ h: 0, m: 0, s: 0 });
      return;
    }
    secondMask.setFromTime(val as InternalFormat);
  },
  { immediate: true },
);

const secondInputRef = ref<HTMLInputElement | null>(null);

/* ── Keydown wrappers (Enter commits, rest goes to mask) ── */
function onFirstKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    e.preventDefault();
    commitMaskedTime("first");
    return;
  }

  // Close dropdowns while typing
  if (/^\d$/.test(e.key)) {
    openFirst.value = false;
    openSecond.value = false;
  }

  // Check cursor position BEFORE the mask processes the key
  const el = e.target as HTMLInputElement;
  const cursorBefore = firstMask.displayPosToDigitIndex(el.selectionStart ?? 0);
  const isLastDigit =
    /^\d$/.test(e.key) && cursorBefore >= firstMask.totalDigits.value - 1;

  firstMask.handleKeydown(e);

  // Keep model in sync after every digit so the dropdown is up-to-date
  if (/^\d$/.test(e.key)) {
    const parsed = firstMask.getParsedTime();
    if (parsed) {
      lastErrorCode.value = null;
      firstInit.value = parsed;
    }
  }

  // In range mode, auto-focus the second input when the last digit is typed
  if (props.range && isLastDigit && secondInputRef.value) {
    commitMaskedTime("first");
    nextTick(() => {
      const el2 = secondInputRef.value;
      if (el2) {
        el2.focus();
        el2.selectionStart = el2.selectionEnd = 0;
      }
    });
  }
}

function onSecondKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    e.preventDefault();
    commitMaskedTime("second");
    return;
  }

  // Close dropdowns while typing
  if (/^\d$/.test(e.key)) {
    openFirst.value = false;
    openSecond.value = false;
  }

  secondMask.handleKeydown(e);

  // Keep model in sync after every digit so the dropdown is up-to-date
  if (/^\d$/.test(e.key)) {
    const parsed = secondMask.getParsedTime();
    if (parsed) {
      lastErrorCode.value = null;
      secondInit.value = parsed;
    }
  }
}

/* ── Commit: parse mask → model, then re-sync display ── */
function commitMaskedTime(target: "first" | "second") {
  const mask = target === "first" ? firstMask : secondMask;
  const parsed = mask.getParsedTime();

  if (parsed) {
    lastErrorCode.value = null;
    if (target === "first") {
      firstInit.value = parsed;
    } else if (props.range) {
      secondInit.value = parsed;
    }
  }

  // Always re-sync the display to the current model value
  // (reverts incomplete input, normalises clamped values)
  if (target === "first") {
    firstMask.setFromTime(firstInit.value);
  } else if (props.range) {
    secondMask.setFromTime(secondInit.value);
  }
}
</script>

<style src="../styles/timepicker.css"></style>
