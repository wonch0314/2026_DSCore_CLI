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

  .ds-switch {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-family: var(--ds-font-family, inherit);
    font-size: var(--ds-font-size-sm, 0.875rem);
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-switch--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Track */
  .ds-switch-track {
    position: relative;
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    background: var(--ds-switch-background, #cbced4);
    border: 1px solid transparent;
    border-radius: 9999px;
    transition: all var(--ds-transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
  }

  .ds-switch--on .ds-switch-track {
    background: var(--ds-primary, #030213);
  }

  .ds-switch:focus-visible .ds-switch-track {
    box-shadow: 0 0 0 3px var(--ds-ring-color, rgba(168, 168, 168, 0.5));
  }

  /* Thumb — round, white */
  .ds-switch-thumb {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: block;
    background: #fff;
    border-radius: 9999px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    transition: transform var(--ds-transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1)),
                left var(--ds-transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* sm: 32×18 track, 14×14 thumb */
  .ds-switch--sm .ds-switch-track {
    width: 2rem;
    height: 1.15rem;
  }
  .ds-switch--sm .ds-switch-thumb {
    width: 1rem;
    height: 1rem;
    left: 1px;
  }
  .ds-switch--sm.ds-switch--on .ds-switch-thumb {
    left: calc(2rem - 1rem - 1px);
  }

  /* md: uses same spec as reference — 2rem wide, 1.15rem tall */
  .ds-switch--md .ds-switch-track {
    width: 2.5rem;
    height: 1.35rem;
  }
  .ds-switch--md .ds-switch-thumb {
    width: 1.1rem;
    height: 1.1rem;
    left: 2px;
  }
  .ds-switch--md.ds-switch--on .ds-switch-thumb {
    left: calc(2.5rem - 1.1rem - 2px);
  }

  /* lg */
  .ds-switch--lg .ds-switch-track {
    width: 3.5rem;
    height: 1.875rem;
  }
  .ds-switch--lg .ds-switch-thumb {
    width: 1.5rem;
    height: 1.5rem;
    left: 3px;
  }
  .ds-switch--lg.ds-switch--on .ds-switch-thumb {
    left: calc(3.5rem - 1.5rem - 3px);
  }

  .ds-switch-label {
    font-size: var(--ds-font-size-sm, 0.875rem);
    line-height: 1.5;
  }
</style>
