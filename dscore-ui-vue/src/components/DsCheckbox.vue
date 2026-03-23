<script setup lang="ts">
import { computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  modelValue?: boolean
  indeterminate?: boolean
  disabled?: boolean
  checkIcon?: object
  value?: string | number
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  indeterminate: false,
  disabled: false,
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'change': [value: boolean]
}>()

const config = useDsConfig()

const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const isChecked = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  }
})

const CheckIcon = computed(() => props.checkIcon || config.icons?.check)

const handleClick = () => {
  if (props.disabled) return
  isChecked.value = !isChecked.value
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    handleClick()
  }
}
</script>

<template>
  <label
    :class="[
      isStyled && 'ds-checkbox',
      isStyled && isChecked && 'ds-checkbox--checked',
      isStyled && indeterminate && 'ds-checkbox--indeterminate',
      isStyled && disabled && 'ds-checkbox--disabled'
    ]"
  >
    <input
      type="checkbox"
      :class="isStyled && 'ds-checkbox-input'"
      :checked="isChecked"
      :indeterminate="indeterminate"
      :disabled="disabled"
      :value="value"
      @change="handleClick"
    />
    <span
      :class="isStyled && 'ds-checkbox-box'"
      tabindex="0"
      role="checkbox"
      :aria-checked="indeterminate ? 'mixed' : isChecked"
      @keydown="handleKeydown"
    >
      <span v-if="isChecked && !indeterminate" :class="isStyled && 'ds-checkbox-icon'">
        <component v-if="CheckIcon" :is="CheckIcon" />
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span v-if="indeterminate" :class="[isStyled && 'ds-checkbox-icon', isStyled && 'ds-checkbox-icon--indeterminate']">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </span>
    </span>
    <span v-if="$slots.default" :class="isStyled && 'ds-checkbox-label'">
      <slot />
    </span>
  </label>
</template>

<style>
@layer ds-base {
  .ds-checkbox {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-spacing-2, 0.5rem);
    cursor: pointer;
    user-select: none;
    font-family: var(--ds-font-family, 'Inter', sans-serif);
    color: var(--ds-on-surface, #2a3439);
  }

  .ds-checkbox--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .ds-checkbox-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .ds-checkbox-box {
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

  .ds-checkbox--checked .ds-checkbox-box,
  .ds-checkbox--indeterminate .ds-checkbox-box {
    background: var(--ds-primary, #5f5e5e);
    border-color: var(--ds-primary, #5f5e5e);
  }

  .ds-checkbox-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ds-on-primary, #ffffff);
  }

  .ds-checkbox-icon svg {
    width: 12px;
    height: 12px;
  }

  .ds-checkbox-label {
    font-size: var(--ds-font-size-md, 0.9375rem);
  }

  .ds-checkbox-box:focus-visible {
    outline: 2px solid var(--ds-primary, #5f5e5e);
    outline-offset: 2px;
  }
}
</style>
