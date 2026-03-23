<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  modelValue?: number | null
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  placeholder?: string
  formatter?: (value: number) => string
  parser?: (value: string) => number
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  step: 1,
  disabled: false,
  placeholder: '',
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  'change': [value: number | null]
}>()

const config = useDsConfig()
const inputRef = ref<HTMLInputElement | null>(null)

const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const displayValue = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) return ''
  if (props.formatter) return props.formatter(props.modelValue)
  return props.modelValue.toLocaleString()
})

const ArrowIcon = computed(() => config.icons?.arrow)

const parseValue = (str: string): number | null => {
  if (!str) return null
  if (props.parser) return props.parser(str)
  const cleaned = str.replace(/,/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

const clampValue = (value: number): number => {
  let result = value
  if (props.min !== undefined) result = Math.max(result, props.min)
  if (props.max !== undefined) result = Math.min(result, props.max)
  return result
}

const updateValue = (newValue: number | null) => {
  if (newValue !== null) {
    newValue = clampValue(newValue)
  }
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = parseValue(target.value)
  updateValue(value)
}

const increment = () => {
  if (props.disabled) return
  const current = props.modelValue ?? 0
  updateValue(current + props.step)
}

const decrement = () => {
  if (props.disabled) return
  const current = props.modelValue ?? 0
  updateValue(current - props.step)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    increment()
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    decrement()
  }
}

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur()
})
</script>

<template>
  <div
    :class="[isStyled && 'ds-number-input', isStyled && disabled && 'ds-number-input--disabled']"
  >
    <button
      type="button"
      :class="[isStyled && 'ds-number-input-btn', isStyled && 'ds-number-input-btn--decrement']"
      :disabled="disabled || (min !== undefined && (modelValue ?? 0) <= min)"
      @click="decrement"
      aria-label="Decrease"
    >
      <component v-if="ArrowIcon" :is="ArrowIcon" style="transform: rotate(90deg)" />
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>

    <input
      ref="inputRef"
      type="text"
      :class="isStyled && 'ds-number-input-field'"
      :value="displayValue"
      :disabled="disabled"
      :placeholder="placeholder"
      inputmode="numeric"
      @input="handleInput"
      @keydown="handleKeydown"
    />

    <button
      type="button"
      :class="[isStyled && 'ds-number-input-btn', isStyled && 'ds-number-input-btn--increment']"
      :disabled="disabled || (max !== undefined && (modelValue ?? 0) >= max)"
      @click="increment"
      aria-label="Increase"
    >
      <component v-if="ArrowIcon" :is="ArrowIcon" style="transform: rotate(-90deg)" />
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  </div>
</template>

<style>

  /* Container — matches DsInput shape */
  .ds-number-input {
    display: inline-flex;
    align-items: stretch;
    height: 2.25rem;
    border-radius: var(--ds-radius-md, 0.375rem);
    border: 1px solid var(--ds-border, rgba(0, 0, 0, 0.1));
    background: var(--ds-input-background, #f3f3f5);
    font-family: var(--ds-font-family, inherit);
    color: var(--ds-foreground, #1a1a1a);
    overflow: hidden;
    transition: box-shadow var(--ds-transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
    box-sizing: border-box;
  }

  .ds-number-input:focus-within {
    border-color: var(--ds-ring, #a8a8a8);
    box-shadow: 0 0 0 3px var(--ds-ring-color, rgba(168, 168, 168, 0.5));
  }

  .ds-number-input--disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  /* +/− buttons — minimal, borderless */
  .ds-number-input-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: none;
    border: none;
    border-left: 1px solid var(--ds-border, rgba(0, 0, 0, 0.1));
    width: 2rem;
    padding: 0;
    cursor: pointer;
    color: var(--ds-muted-foreground, #717182);
    transition:
      background var(--ds-transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1)),
      color var(--ds-transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
  }

  .ds-number-input-btn--decrement {
    border-left: none;
    border-right: 1px solid var(--ds-border, rgba(0, 0, 0, 0.1));
    order: -1;
  }

  .ds-number-input-btn:hover:not(:disabled) {
    background: var(--ds-accent, #e9ebef);
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-number-input-btn:active:not(:disabled) {
    background: rgba(0, 0, 0, 0.08);
  }

  .ds-number-input-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ds-number-input-btn svg {
    width: 14px;
    height: 14px;
    stroke-width: 2;
  }

  /* Number field */
  .ds-number-input-field {
    text-align: center;
    min-width: 60px;
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-family: var(--ds-font-family, inherit);
    font-size: var(--ds-font-size-sm, 0.875rem);
    font-weight: 500;
    color: var(--ds-foreground, #1a1a1a);
    padding: 0 0.5rem;
  }

  .ds-number-input-field::placeholder {
    color: var(--ds-muted-foreground, #717182);
    font-weight: 400;
  }

  .ds-number-input-field::-webkit-outer-spin-button,
  .ds-number-input-field::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .ds-number-input-field[type=number] {
    -moz-appearance: textfield;
  }
</style>
