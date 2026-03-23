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

  .ds-checkbox {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
    font-family: var(--ds-font-family, inherit);
    font-size: var(--ds-font-size-sm, 0.875rem);
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-checkbox--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .ds-checkbox-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .ds-checkbox-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
    border-radius: 4px;
    border: 1px solid var(--ds-border, rgba(0, 0, 0, 0.1));
    background: var(--ds-input-background, #f3f3f5);
    box-shadow: var(--ds-shadow-xs, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
    transition: box-shadow var(--ds-transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
  }

  .ds-checkbox:not(.ds-checkbox--disabled):hover .ds-checkbox-box {
    box-shadow: 0 0 0 3px var(--ds-ring-color, rgba(168, 168, 168, 0.5));
  }

  .ds-checkbox--checked .ds-checkbox-box,
  .ds-checkbox--indeterminate .ds-checkbox-box {
    background: var(--ds-primary, #030213);
    border-color: var(--ds-primary, #030213);
    box-shadow: none;
  }

  .ds-checkbox-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ds-primary-foreground, #fff);
    animation: ds-check-in 160ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .ds-checkbox-icon svg {
    width: 10px;
    height: 10px;
    stroke-width: 3;
  }

  @keyframes ds-check-in {
    from { opacity: 0; transform: scale(0.5); }
    to   { opacity: 1; transform: scale(1); }
  }

  .ds-checkbox-label {
    font-size: var(--ds-font-size-sm, 0.875rem);
    line-height: 1.5;
  }

  .ds-checkbox-box:focus-visible {
    border-color: var(--ds-ring, #a8a8a8);
    box-shadow: 0 0 0 3px var(--ds-ring-color, rgba(168, 168, 168, 0.5));
  }
</style>
