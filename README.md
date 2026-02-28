# Vue3 Timepicker

[![Live Playground](https://img.shields.io/badge/Live-Playground-4f46e5?style=for-the-badge&logo=storybook&logoColor=white)](https://manos02.github.io/vue3-time-picker/)

A flexible, customisable timepicker component for Vue 3 with TypeScript support.

| Demo                                                                                     | Default                                                                                                   | Dark                                                                                                |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| ![Demo](https://raw.githubusercontent.com/manos02/vue3-time-picker/main/assets/demo.gif) | ![Default](https://raw.githubusercontent.com/manos02/vue3-time-picker/main/assets/screenshot-default.png) | ![Dark](https://raw.githubusercontent.com/manos02/vue3-time-picker/main/assets/screenshot-dark.png) |

![All themes](https://raw.githubusercontent.com/manos02/vue3-time-picker/main/assets/screenshot-all.png)

- Single and range time selection
- Multiple hour formats: 24-hour (`HH`/`H`), 12-hour (`hh`/`h` with AM/PM), 1-24 (`kk`/`k`)
- Optional seconds
- Inline masked input with overwrite-only editing
- Step intervals for hours, minutes, and seconds
- Fully styleable via CSS custom properties

## Installation

```bash
npm install @manik02/vue3-timepicker
```

Try it live: [Interactive Playground](https://manos02.github.io/vue3-time-picker/)

## Quick start

```vue
<script setup>
import { ref } from "vue";
import { TimePicker } from "@manik02/vue3-timepicker";
import "@manik02/vue3-timepicker/style.css";

const time = ref("14:30:00");
</script>

<template>
  <TimePicker v-model="time" format="HH:mm:ss" />
</template>
```

## Interactive Playground (Storybook)

Run Storybook locally and experiment with all props via controls:

```bash
npm run storybook
```

Build static Storybook:

```bash
npm run build-storybook
```

The repository includes [storybook deploy workflow](.github/workflows/storybook.yml) to publish Storybook to GitHub Pages on push to `main`.

## Props

| Prop             | Type                                   | Default     | Description                                                                             |
| ---------------- | -------------------------------------- | ----------- | --------------------------------------------------------------------------------------- |
| `modelValue`     | `string \| [string, string] \| null`   | `undefined` | Time value in `HH:mm:ss` format. Use a two-element array for range mode.                |
| `format`         | `TimeFormat`                           | `"HH:mm"`   | Display format (see format tokens below).                                               |
| `range`          | `boolean`                              | `false`     | Enable range selection with two time inputs.                                            |
| `disabled`       | `boolean`                              | `false`     | Disables the timepicker input(s) and prevents opening/selecting.                        |
| `hourStep`       | `number`                               | `1`         | Step interval for the hour column.                                                      |
| `minuteStep`     | `number`                               | `1`         | Step interval for the minute column.                                                    |
| `secondStep`     | `number`                               | `1`         | Step interval for the second column.                                                    |
| `minTime`        | `string`                               | `undefined` | Lower bound in `HH:mm` or `HH:mm:ss`; input and dropdown are constrained.               |
| `maxTime`        | `string`                               | `undefined` | Upper bound in `HH:mm` or `HH:mm:ss`; input and dropdown are constrained.               |
| `disabledTimes`  | `(string \| [string, string])[]`       | `undefined` | Disabled points/ranges in `HH:mm:ss`; e.g. `"12:00:00"` or `[["13:00:00","14:00:00"]]`. |
| `isTimeDisabled` | `(time: InternalFormat) => boolean`    | `undefined` | Callback for custom disable rules. Return `true` to block a time.                       |
| `size`           | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"`      | Size preset that maps to CSS variables.                                                 |

## Validation API

The component exposes a validation state and emits validation events for predictable form handling:

- `update:validationState` emits one of: `"valid"`, `"invalid"`, `"out-of-range"`
- `validate` emits payload:

```ts
{
  target: "first" | "second";
  state: "valid" | "invalid" | "out-of-range";
  reason?: "BAD_TIME" | "OUT_OF_RANGE" | "DISABLED";
  value: string | null; // always HH:mm:ss when present
}
```

`out-of-range` means the value was outside `minTime`/`maxTime` and got clamped.
`invalid` means bad/incomplete input or a blocked value from `disabledTimes`/`isTimeDisabled`.

### Example

```vue
<script setup lang="ts">
import { ref } from "vue";

const time = ref("12:00:00");
const validationState = ref<"valid" | "invalid" | "out-of-range">("valid");

function onValidate(payload: {
  state: "valid" | "invalid" | "out-of-range";
  reason?: "BAD_TIME" | "OUT_OF_RANGE" | "DISABLED";
}) {
  console.log("validate", payload.state, payload.reason);
}
</script>

<template>
  <TimePicker
    v-model="time"
    v-model:validationState="validationState"
    minTime="09:00:00"
    maxTime="18:00:00"
    @validate="onValidate"
  />

  <small>State: {{ validationState }}</small>
</template>
```

### Range Example

```vue
<script setup lang="ts">
import { ref } from "vue";

const range = ref<[string, string]>(["09:00:00", "17:00:00"]);
const validationState = ref<"valid" | "invalid" | "out-of-range">("valid");

function onValidate(payload: {
  target: "first" | "second";
  state: "valid" | "invalid" | "out-of-range";
  reason?: "BAD_TIME" | "OUT_OF_RANGE" | "DISABLED";
}) {
  console.log(payload.target, payload.state, payload.reason);
}
</script>

<template>
  <TimePicker
    v-model="range"
    :range="true"
    v-model:validationState="validationState"
    :disabled-times="[["12:00:00", "13:00:00"]]"
    @validate="onValidate"
  />

  <small>State: {{ validationState }}</small>
</template>
```

## Format tokens

| Token     | Output                 | Description            |
| --------- | ---------------------- | ---------------------- |
| `HH`      | `00`-`23`              | 24-hour, zero-padded   |
| `H`       | `0`-`23`               | 24-hour                |
| `hh`      | `01`-`12`              | 12-hour, zero-padded   |
| `h`       | `1`-`12`               | 12-hour                |
| `kk`      | `01`-`24`              | 1-24 hour, zero-padded |
| `k`       | `1`-`24`               | 1-24 hour              |
| `mm`      | `00`-`59`              | Minutes, zero-padded   |
| `m`       | `0`-`59`               | Minutes                |
| `ss`      | `00`-`59`              | Seconds, zero-padded   |
| `s`       | `0`-`59`               | Seconds                |
| `A` / `a` | `AM`/`PM` or `am`/`pm` | AM/PM indicator        |

Combine tokens with `:` separators: `HH:mm`, `hh:mm:ss A`, `kk:mm`, etc.

## Range mode

```vue
<script setup>
import { ref } from "vue";
import { TimePicker } from "@manik02/vue3-timepicker";
import "@manik02/vue3-timepicker/style.css";

const range = ref(["09:00:00", "17:00:00"]);
</script>

<template>
  <TimePicker v-model="range" format="HH:mm" :range="true" />
</template>
```

When `range` is `true`, `modelValue` must be a `[string, string]` array.

## 12-hour format

```vue
<TimePicker v-model="time" format="hh:mm A" />
// AM/PM
<TimePicker v-model="time" format="hh:mm a" />
// am/pm
```

Press `a` or `p` while focused to toggle between AM and PM.

## Step intervals

```vue
<TimePicker v-model="time" format="HH:mm" :minute-step="15" />
```

The dropdown columns will show values at the specified intervals (e.g. 00, 15, 30, 45 for a 15-minute step).

## Size presets

```vue
<template>
  <div class="sizes">
    <TimePicker v-model="time" format="HH:mm" size="xs" />
    <TimePicker v-model="time" format="HH:mm" size="sm" />
    <TimePicker v-model="time" format="HH:mm" size="md" />
    <TimePicker v-model="time" format="HH:mm" size="lg" />
    <TimePicker v-model="time" format="HH:mm" size="xl" />
  </div>
</template>
```

Each preset sets a handful of CSS custom properties (`--vtp-font-size`, `--vtp-padding`, `--vtp-option-padding`, `--vtp-dropdown-radius`). You can still override any of them manually.

## CSS custom properties

Style the component by setting CSS custom properties on `.timepicker-shell` or any ancestor element.

```css
.my-theme .timepicker-shell {
  --vtp-font-family: "Inter", sans-serif;
  --vtp-font-size: 14px;
  --vtp-bg: #fff;
  --vtp-color: #333;
  --vtp-border: #d1d5db;
  --vtp-border-radius: 8px;
  --vtp-padding: 0.5rem 0.75rem;
  --vtp-focus-border: #3b82f6;
  --vtp-focus-ring: 0 0 0 3px rgba(59, 130, 246, 0.2);
  --vtp-error-border: #ef4444;
  --vtp-error-ring: 0 0 0 3px rgba(239, 68, 68, 0.15);
  --vtp-separator-color: #9ca3af;
  --vtp-dropdown-bg: #fff;
  --vtp-dropdown-border: #e5e7eb;
  --vtp-dropdown-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  --vtp-dropdown-radius: 8px;
  --vtp-dropdown-max-height: 240px;
  --vtp-option-padding: 0.375rem 0.75rem;
  --vtp-option-radius: 6px;
  --vtp-option-hover-bg: #f3f4f6;
  --vtp-option-active-bg: #dbeafe;
  --vtp-option-active-color: #1e40af;
  --vtp-option-active-weight: 600;
  --vtp-columns-gap: 0.5rem;
}
```

All properties have sensible defaults and the component inherits font and colour from its parent by default.

### Dark theme example

```vue
<template>
  <div class="dark-theme">
    <TimePicker v-model="time" format="HH:mm:ss" />
  </div>
</template>

<style>
.dark-theme .timepicker-shell {
  --vtp-bg: #1e1e2e;
  --vtp-color: #cdd6f4;
  --vtp-border: #45475a;
  --vtp-border-radius: 10px;
  --vtp-focus-border: #89b4fa;
  --vtp-focus-ring: 0 0 0 3px rgba(137, 180, 250, 0.25);
  --vtp-separator-color: #6c7086;
  --vtp-dropdown-bg: #1e1e2e;
  --vtp-dropdown-border: #45475a;
  --vtp-dropdown-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  --vtp-option-hover-bg: #313244;
  --vtp-option-active-bg: #89b4fa;
  --vtp-option-active-color: #1e1e2e;
}
</style>
```

### Minimal rounded example

```vue
<template>
  <div class="rounded-theme">
    <TimePicker v-model="time" format="HH:mm" />
  </div>
</template>

<style>
.rounded-theme .timepicker-shell {
  --vtp-font-family: "Georgia", serif;
  --vtp-font-size: 16px;
  --vtp-border: #a78bfa;
  --vtp-border-radius: 999px;
  --vtp-padding: 0.5rem 1.25rem;
  --vtp-focus-border: #7c3aed;
  --vtp-focus-ring: 0 0 0 3px rgba(124, 58, 237, 0.2);
  --vtp-dropdown-radius: 16px;
  --vtp-option-radius: 12px;
  --vtp-option-active-bg: #ede9fe;
  --vtp-option-active-color: #5b21b6;
}
</style>
```

### Compact flat example

```vue
<template>
  <div class="flat-theme">
    <TimePicker v-model="time" format="hh:mm A" />
  </div>
</template>

<style>
.flat-theme .timepicker-shell {
  --vtp-font-family: "Roboto Mono", monospace;
  --vtp-font-size: 13px;
  --vtp-bg: #f8fafc;
  --vtp-color: #0f172a;
  --vtp-border: transparent;
  --vtp-border-radius: 4px;
  --vtp-padding: 0.375rem 0.5rem;
  --vtp-focus-border: #0ea5e9;
  --vtp-focus-ring: none;
  --vtp-dropdown-bg: #f8fafc;
  --vtp-dropdown-border: #e2e8f0;
  --vtp-dropdown-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  --vtp-dropdown-radius: 4px;
  --vtp-option-radius: 2px;
  --vtp-option-hover-bg: #e2e8f0;
  --vtp-option-active-bg: #0ea5e9;
  --vtp-option-active-color: #fff;
  --vtp-option-active-weight: 500;
}
</style>
```

You can scope the overrides to any CSS class, or apply them globally to `.timepicker-shell` to affect all instances.

## TypeScript

The package exports the following types:

```ts
import type {
  TimeFormat,
  InternalFormat,
  TimePickerProps,
} from "@manik02/vue3-timepicker";
```

## License

MIT
