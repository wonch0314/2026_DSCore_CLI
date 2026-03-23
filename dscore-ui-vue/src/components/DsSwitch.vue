<script setup lang="ts">
import { computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  modelValue?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  size: 'md',
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'change': [value: boolean]
}>()

const config = useDsConfig()

const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const isOn = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  }
})

const toggle = () => {
  if (props.disabled) return
  isOn.value = !isOn.value
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    toggle()
  }
}
</script>

<template>
  <button
    type="button"
    :class="[
      isStyled && 'ds-switch',
      isStyled && isOn && 'ds-switch--on',
      isStyled && disabled && 'ds-switch--disabled',
      isStyled && `ds-switch--${size}`
    ]"
    role="switch"
    :aria-checked="isOn"
    :disabled="disabled"
    @click="toggle"
    @keydown="handleKeydown"
  >
    <span :class="isStyled && 'ds-switch-track'">
      <span :class="isStyled && 'ds-switch-thumb'" />
    </span>
    <span v-if="$slots.default" :class="isStyled && 'ds-switch-label'">
      <slot />
    </span>
  </button>
</template>

<style>
@layer ds-base {
  .ds-switch {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-spacing-2, 0.5rem);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-family: var(--ds-font-family, 'Inter', sans-serif);
    color: var(--ds-on-surface, #2a3439);
  }

  .ds-switch--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .ds-switch-track {
    position: relative;
    display: inline-flex;
    align-items: center;
    background: var(--ds-surface-container, #e8eff3);
    border: 1px solid rgba(169, 180, 185, 0.2);
    border-radius: var(--ds-border-radius, 0px);
    transition: background 0.2s, border-color 0.2s;
  }

  .ds-switch--on .ds-switch-track {
    background: var(--ds-primary, #5f5e5e);
    border-color: var(--ds-primary, #5f5e5e);
  }

  .ds-switch-thumb {
    position: absolute;
    background: var(--ds-surface-container-lowest, #fff);
    border-radius: var(--ds-border-radius, 0px);
    transition: transform 0.2s;
    box-shadow: 0 1px 2px rgba(42, 52, 57, 0.15);
  }

  /* Size variants */
  .ds-switch--sm .ds-switch-track {
    width: 32px;
    height: 18px;
  }
  .ds-switch--sm .ds-switch-thumb {
    width: 14px;
    height: 14px;
    left: 2px;
  }
  .ds-switch--sm.ds-switch--on .ds-switch-thumb {
    transform: translateX(14px);
  }

  .ds-switch--md .ds-switch-track {
    width: 40px;
    height: 20px;
  }
  .ds-switch--md .ds-switch-thumb {
    width: 16px;
    height: 16px;
    left: 2px;
  }
  .ds-switch--md.ds-switch--on .ds-switch-thumb {
    transform: translateX(20px);
  }

  .ds-switch--lg .ds-switch-track {
    width: 56px;
    height: 30px;
  }
  .ds-switch--lg .ds-switch-thumb {
    width: 26px;
    height: 26px;
    left: 2px;
  }
  .ds-switch--lg.ds-switch--on .ds-switch-thumb {
    transform: translateX(26px);
  }

  .ds-switch:focus-visible .ds-switch-track {
    outline: 2px solid var(--ds-primary, #5f5e5e);
    outline-offset: 2px;
  }

  .ds-switch-label {
    font-size: var(--ds-font-size-md, 0.9375rem);
  }
}
</style>
