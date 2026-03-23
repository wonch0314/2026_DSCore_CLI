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
@layer ds-base {
  .ds-radio {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-spacing-2, 0.5rem);
    cursor: pointer;
    user-select: none;
    font-family: var(--ds-font-family, 'Inter', sans-serif);
    color: var(--ds-on-surface, #2a3439);
  }

  .ds-radio--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .ds-radio-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .ds-radio-circle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    border: 1px solid rgba(169, 180, 185, 0.4);
    border-radius: var(--ds-border-radius, 0px);
    background: transparent;
    transition: background 0.15s, border-color 0.15s;
  }

  .ds-radio--checked .ds-radio-circle {
    background: var(--ds-primary, #5f5e5e);
    border-color: var(--ds-primary, #5f5e5e);
  }

  .ds-radio-dot {
    width: 6px;
    height: 6px;
    border-radius: var(--ds-border-radius, 0px);
    background: var(--ds-on-primary, #ffffff);
  }

  .ds-radio-label {
    font-size: var(--ds-font-size-md, 0.9375rem);
  }

  .ds-radio-circle:focus-visible {
    outline: 2px solid var(--ds-primary, #5f5e5e);
    outline-offset: 2px;
  }
}
</style>
