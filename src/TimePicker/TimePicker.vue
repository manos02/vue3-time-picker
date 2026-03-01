<template>
  <div
    class="timepicker-shell"
    :data-size="props.size"
    :data-validation="validationState"
    :data-disabled="props.disabled ? 'true' : 'false'"
  >
    <!-- Input / trigger -->

    <template v-if="!props.range">
      <div
        class="timepicker-shell__input"
        :class="{
          'timepicker-shell__input--error': lastErrorCode,
          'timepicker-shell__input--disabled': props.disabled,
        }"
      >
        <input
          type="text"
          class="timepicker-field"
          :value="firstInputValue"
          :placeholder="placeholderText"
          :style="{ width: fieldWidth }"
          :disabled="props.disabled"
          @focus="!props.disabled && (openFirst = true)"
          @keydown="onFirstKeydown"
          @input="firstMask.handleInput"
          @paste="firstMask.handlePaste"
          @blur="!props.disabled && commitMaskedTime('first')"
        />
      </div>
    </template>

    <template v-else>
      <div
        class="timepicker-shell__input"
        :class="{
          'timepicker-shell__input--error': lastErrorCode,
          'timepicker-shell__input--disabled': props.disabled,
        }"
      >
        <input
          type="text"
          class="timepicker-field"
          :value="firstInputValue"
          :placeholder="placeholderText"
          :style="{ width: fieldWidth }"
          :disabled="props.disabled"
          @focus="!props.disabled && (openFirst = true)"
          @keydown="onFirstKeydown"
          @input="firstMask.handleInput"
          @paste="firstMask.handlePaste"
          @blur="!props.disabled && commitMaskedTime('first')"
        />
        <span class="timepicker-separator">–</span>
        <input
          ref="secondInputRef"
          type="text"
          class="timepicker-field"
          :value="secondInputValue"
          :placeholder="placeholderText"
          :style="{ width: fieldWidth }"
          :disabled="props.disabled"
          @focus="!props.disabled && (openSecond = true)"
          @keydown="onSecondKeydown"
          @input="secondMask.handleInput"
          @paste="secondMask.handlePaste"
          @blur="!props.disabled && commitMaskedTime('second')"
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
        :min-time="effectiveMinBound"
        :max-time="effectiveMaxBound"
        :disabled-ranges="disabledRanges"
        :is-time-disabled="props.isTimeDisabled"
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
        :min-time="effectiveMinBound"
        :max-time="effectiveMaxBound"
        :disabled-ranges="disabledRanges"
        :is-time-disabled="props.isTimeDisabled"
      />
    </div>
  </div>
  <!-- </div> -->
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import TimeSelection from "./TimeSelection.vue";
import {
  InternalFormat,
  timePickerProps,
  type DisabledTimeInput,
  type TimePickerEmits,
  type ValidationReason,
  type ValidationState,
} from "./types";
import {
  clampTimeToBounds,
  compareTimes,
  formatTime,
  isTimeInRanges,
  isTimeWithinBounds,
  parseFromModel,
} from "../helpers";
import { useTimeMask } from "./useTimeMask";

const lastErrorCode = ref<string | null>(null);
/* ================================
 * Props & emits
 * ================================ */
const props = defineProps(timePickerProps);
const emit = defineEmits<TimePickerEmits>();

const openFirst = ref(false);
const openSecond = ref(false);
const firstValidation = ref<ValidationState>("valid");
const secondValidation = ref<ValidationState>("valid");

// Ensure only one dropdown is open at a time
watch(openFirst, (v) => {
  if (props.disabled && v) {
    openFirst.value = false;
    return;
  }
  if (v) openSecond.value = false;
});
watch(openSecond, (v) => {
  if (props.disabled && v) {
    openSecond.value = false;
    return;
  }
  if (v) openFirst.value = false;
});

watch(
  () => props.disabled,
  (isDisabled) => {
    if (!isDisabled) return;
    openFirst.value = false;
    openSecond.value = false;
  },
);

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

const minBound = computed<InternalFormat | null>(() =>
  props.minTime ? parseFromModel(props.minTime, "HH:mm:ss") : null,
);
const maxBound = computed<InternalFormat | null>(() =>
  props.maxTime ? parseFromModel(props.maxTime, "HH:mm:ss") : null,
);
const hasValidBounds = computed(() => {
  if (!minBound.value || !maxBound.value) return true;
  return compareTimes(minBound.value, maxBound.value) <= 0;
});

const validationState = computed<ValidationState>(() => {
  if (
    firstValidation.value === "out-of-range" ||
    (props.range && secondValidation.value === "out-of-range")
  ) {
    return "out-of-range";
  }
  if (firstValidation.value === "invalid") return "invalid";
  if (props.range && secondValidation.value === "invalid") return "invalid";
  return "valid";
});

const disabledRanges = computed<Array<[InternalFormat, InternalFormat]>>(() => {
  const entries = props.disabledTimes ?? [];
  return entries.map((entry: DisabledTimeInput) => {
    const pair = Array.isArray(entry) ? entry : [entry, entry];
    const start = parseFromModel(pair[0], "HH:mm:ss");
    const end = parseFromModel(pair[1], "HH:mm:ss");
    if (compareTimes(start, end) <= 0) return [start, end];
    return [end, start];
  });
});

function isDisabledByRules(time: InternalFormat): boolean {
  if (isTimeInRanges(time, disabledRanges.value)) return true;
  if (props.isTimeDisabled?.(time)) return true;
  return false;
}

function getCurrentTargetValue(target: "first" | "second"): InternalFormat {
  if (target === "first") {
    if (Array.isArray(init.value)) return init.value[0];
    return init.value;
  }
  if (Array.isArray(init.value)) return init.value[1];
  return init.value;
}

function hasTargetValue(target: "first" | "second"): boolean {
  const value = props.modelValue;

  if (Array.isArray(value)) {
    return target === "first" ? !!value[0] : !!value[1];
  }

  if (target === "second") return false;
  return typeof value === "string" && value.length > 0;
}

function setTargetValue(target: "first" | "second", next: InternalFormat) {
  if (target === "first") {
    if (Array.isArray(init.value)) {
      init.value = [next, init.value[1]];
    } else {
      init.value = next;
    }
    return;
  }
  if (Array.isArray(init.value)) {
    init.value = [init.value[0], next];
  }
}

function setValidation(
  target: "first" | "second",
  state: ValidationState,
  reason?: ValidationReason,
  value?: InternalFormat,
) {
  if (target === "first") {
    firstValidation.value = state;
  } else {
    secondValidation.value = state;
  }

  emit("validate", {
    target,
    state,
    reason,
    value: value ? formatTime("HH:mm:ss", value) : null,
  });

  if (state === "valid") {
    lastErrorCode.value = null;
    return;
  }

  if (state === "out-of-range") {
    lastErrorCode.value = "OUT_OF_RANGE";
    emit("error", {
      code: "OUT_OF_RANGE",
      message: "Time is outside min/max bounds and was clamped.",
    });
    return;
  }

  lastErrorCode.value = reason ?? "BAD_TIME";
  emit("error", {
    code: reason ?? "BAD_TIME",
    message:
      reason === "DISABLED"
        ? "Time is disabled by disabledTimes or isTimeDisabled."
        : "Time is invalid.",
  });
}

watch(
  validationState,
  (state) => {
    emit("update:validationState", state);
  },
  { immediate: true },
);
const effectiveMinBound = computed<InternalFormat | null>(() =>
  hasValidBounds.value ? minBound.value : null,
);
const effectiveMaxBound = computed<InternalFormat | null>(() =>
  hasValidBounds.value ? maxBound.value : null,
);

function clampToBounds(time: InternalFormat): InternalFormat {
  return clampTimeToBounds(
    time,
    effectiveMinBound.value,
    effectiveMaxBound.value,
  );
}

function applyTime(
  target: "first" | "second",
  time: InternalFormat,
  options: { emitValidation: boolean },
) {
  const outOfRange = !isTimeWithinBounds(
    time,
    effectiveMinBound.value,
    effectiveMaxBound.value,
  );
  const clamped = clampToBounds(time);

  if (isDisabledByRules(clamped)) {
    if (options.emitValidation) {
      setValidation(target, "invalid", "DISABLED", clamped);
    }
    return false;
  }

  setTargetValue(target, clamped);
  if (options.emitValidation) {
    if (outOfRange) {
      setValidation(target, "out-of-range", "OUT_OF_RANGE", clamped);
    } else {
      setValidation(target, "valid", undefined, clamped);
    }
  }
  return true;
}

const firstInit = computed<InternalFormat>({
  get() {
    if (Array.isArray(init.value)) return init.value[0];
    return init.value;
  },
  set(v) {
    if (!hasTargetValue("first") && !openFirst.value) return;
    applyTime("first", v, { emitValidation: true });
  },
});

const secondInit = computed<InternalFormat>({
  get() {
    if (Array.isArray(init.value)) return init.value[1];
    return init.value;
  },
  set(v) {
    if (!hasTargetValue("second") && !openSecond.value) return;
    if (Array.isArray(init.value))
      applyTime("second", v, { emitValidation: true });
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
      if (props.modelValue != null && !Array.isArray(props.modelValue)) {
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

watch(
  () => [effectiveMinBound.value, effectiveMaxBound.value, props.range],
  () => {
    if (hasTargetValue("first")) {
      applyTime("first", getCurrentTargetValue("first"), {
        emitValidation: true,
      });
    }
    if (props.range && hasTargetValue("second")) {
      applyTime("second", getCurrentTargetValue("second"), {
        emitValidation: true,
      });
    }
  },
  { immediate: true },
);

watch(
  () => [disabledRanges.value, props.isTimeDisabled, props.range],
  () => {
    if (hasTargetValue("first")) {
      applyTime("first", getCurrentTargetValue("first"), {
        emitValidation: true,
      });
    }
    if (props.range && hasTargetValue("second")) {
      applyTime("second", getCurrentTargetValue("second"), {
        emitValidation: true,
      });
    }
  },
  { immediate: true },
);

const resolvedFormat = computed(() => props.format ?? "HH:mm:ss");
const placeholderText = computed(() => props.placeholder ?? "Select time");
const fieldWidth = computed(() => {
  let length = Math.max(
    resolvedFormat.value.length,
    placeholderText.value.length,
  );
  // AM/PM token is 1 char in format but renders as 2 chars (am/pm/AM/PM)
  if (/[AaPp]$/.test(resolvedFormat.value)) {
    length = Math.max(length, resolvedFormat.value.length + 1);
  }
  return `${Math.min(20, Math.max(6, length))}ch`;
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
    if (!hasTargetValue("first")) {
      firstMask.clear();
      return;
    }
    firstMask.setFromTime(val as InternalFormat);
  },
  { immediate: true },
);

watch(
  () => [secondInit.value, resolvedFormat.value, props.range],
  ([val, , isRange]) => {
    if (!isRange || !hasTargetValue("second")) {
      secondMask.clear();
      return;
    }
    secondMask.setFromTime(val as InternalFormat);
  },
  { immediate: true },
);

const secondInputRef = ref<HTMLInputElement | null>(null);

/* ── Keydown wrappers (Enter commits, rest goes to mask) ── */
function onFirstKeydown(e: KeyboardEvent) {
  if (props.disabled) return;

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
      applyTime("first", parsed, { emitValidation: false });
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
  if (props.disabled) return;

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
      applyTime("second", parsed, { emitValidation: false });
    }
  }
}

/* ── Commit: parse mask → model, then re-sync display ── */
function commitMaskedTime(target: "first" | "second") {
  const mask = target === "first" ? firstMask : secondMask;
  const parsed = mask.getParsedTime();

  if (parsed) {
    applyTime(target, parsed, { emitValidation: true });
  } else if (!mask.inputValue.value.trim()) {
    if (!props.range && target === "first") {
      emit("update:modelValue", null);
      setValidation("first", "valid");
    }
  } else {
    setValidation(target, "invalid", "BAD_TIME");
  }

  // Always re-sync the display to the current model value
  // (reverts incomplete input, normalises clamped values)
  if (target === "first") {
    if (hasTargetValue("first")) {
      firstMask.setFromTime(firstInit.value);
    } else {
      firstMask.clear();
    }
  } else if (props.range) {
    if (hasTargetValue("second")) {
      secondMask.setFromTime(secondInit.value);
    } else {
      secondMask.clear();
    }
  }
}
</script>

<style src="../styles/timepicker.css"></style>
