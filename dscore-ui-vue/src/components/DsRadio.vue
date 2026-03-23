<script setup lang="ts">
import { computed, inject } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  modelValue?: string | number | boolean
  value: string | number | boolean
  disabled?: boolean
  checkIcon?: object
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
  'change': [value: string | number | boolean]
}>()

const config = useDsConfig()
const groupContext = inject<{ modelValue: any; updateValue: (v: any) => void } | null>('ds-radio-group', null)

const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const isChecked = computed(() => {
  const currentValue = groupContext?.modelValue ?? props.modelValue
  return currentValue === props.value
})

const CheckIcon = computed(() => props.checkIcon || config.icons?.check)

const handleChange = () => {
  if (props.disabled) return
  if (groupContext) {
    groupContext.updateValue(props.value)
  } else {
    emit('update:modelValue', props.value)
    emit('change', props.value)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    handleChange()
  }
}
</script>

<template>
  <label
    :class="[
      isStyled && 'ds-radio',
      isStyled && isChecked && 'ds-radio--checked',
      isStyled && disabled && 'ds-radio--disabled'
    ]"
  >
    <input
      type="radio"
      :class="isStyled && 'ds-radio-input'"
      :checked="isChecked"
      :disabled="disabled"
      :value="value"
      @change="handleChange"
    />
    <span
      :class="isStyled && 'ds-radio-circle'"
      tabindex="0"
      role="radio"
      :aria-checked="isChecked"
      @keydown="handleKeydown"
    >
      <span v-if="isChecked" :class="isStyled && 'ds-radio-dot'" />
    </span>
    <span v-if="$slots.default" :class="isStyled && 'ds-radio-label'">
      <slot />
    </span>
  </label>
</template>

<style>

  .ds-radio {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
    font-family: var(--ds-font-family, inherit);
    font-size: var(--ds-font-size-sm, 0.875rem);
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-radio--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .ds-radio-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .ds-radio-circle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
    border-radius: 9999px;
    border: 1px solid var(--ds-border, rgba(0, 0, 0, 0.1));
    background: var(--ds-input-background, #f3f3f5);
    box-shadow: var(--ds-shadow-xs, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
    transition: box-shadow var(--ds-transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
  }

  .ds-radio:not(.ds-radio--disabled):hover .ds-radio-circle {
    box-shadow: 0 0 0 3px var(--ds-ring-color, rgba(168, 168, 168, 0.5));
  }

  .ds-radio--checked .ds-radio-circle {
    background: var(--ds-primary, #030213);
    border-color: var(--ds-primary, #030213);
    box-shadow: none;
  }

  /* Inner dot — fully round */
  .ds-radio-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;
    background: var(--ds-primary-foreground, #fff);
    animation: ds-radio-dot-in 180ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  @keyframes ds-radio-dot-in {
    from { opacity: 0; transform: scale(0); }
    to   { opacity: 1; transform: scale(1); }
  }

  .ds-radio-label {
    font-size: var(--ds-font-size-sm, 0.875rem);
    line-height: 1.5;
  }

  .ds-radio-circle:focus-visible {
    border-color: var(--ds-ring, #a8a8a8);
    box-shadow: 0 0 0 3px var(--ds-ring-color, rgba(168, 168, 168, 0.5));
  }
</style>
