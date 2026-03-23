<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'
import DsSpinner from './DsSpinner.vue'
import { useDsConfig } from '../plugin'

interface Props {
  loading?: boolean
  throttle?: number
  spinner?: object
  disabled?: boolean
  showSuccess?: boolean
  successDuration?: number
  type?: 'button' | 'submit' | 'reset'
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  throttle: undefined,
  disabled: false,
  showSuccess: false,
  successDuration: 1500,
  type: 'button',
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const attrs = useAttrs()
const config = useDsConfig()

const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const internalLoading = ref(false)
const showSuccessIcon = ref(false)
const lastClickTime = ref(0)

const isLoading = computed(() => props.loading || internalLoading.value)
const isDisabled = computed(() => props.disabled || isLoading.value)

const effectiveThrottle = computed(() =>
  props.throttle ?? config.defaults?.button?.throttle ?? 0
)

const SpinnerComponent = computed(() =>
  props.spinner || config.spinner || DsSpinner
)

const handleClick = async (event: MouseEvent) => {
  // Throttle check
  if (effectiveThrottle.value > 0) {
    const now = Date.now()
    if (now - lastClickTime.value < effectiveThrottle.value) {
      return
    }
    lastClickTime.value = now
  }

  // Get click handler from attrs
  const clickHandler = attrs.onClick as ((e: MouseEvent) => void | Promise<void>) | undefined

  if (!clickHandler) {
    emit('click', event)
    return
  }

  // Check if it's an async function or returns a promise
  const result = clickHandler(event)

  if (result instanceof Promise) {
    internalLoading.value = true
    try {
      await result
      if (props.showSuccess) {
        showSuccessIcon.value = true
        setTimeout(() => {
          showSuccessIcon.value = false
        }, props.successDuration)
      }
    } finally {
      internalLoading.value = false
    }
  }

  emit('click', event)
}
</script>

<template>
  <button
    :type="type"
    :class="[isStyled && 'ds-button', isStyled && isLoading && 'ds-button--loading', isStyled && isDisabled && 'ds-button--disabled']"
    :disabled="isDisabled"
    @click="handleClick"
  >
    <span v-if="isLoading" :class="isStyled && 'ds-button-spinner'">
      <component :is="SpinnerComponent" size="sm" />
    </span>
    <span v-else-if="showSuccessIcon" :class="isStyled && 'ds-button-success'">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
    <span :class="[isStyled && 'ds-button-content', isStyled && isLoading && 'ds-button-content--hidden']">
      <slot />
    </span>
  </button>
</template>

<style>

  .ds-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    white-space: nowrap;
    border-radius: var(--ds-radius-md, 0.5rem);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.5;
    height: 2.25rem;
    padding: 0.5rem 1rem;
    background-color: var(--ds-primary, #030213);
    color: var(--ds-primary-foreground, #ffffff);
    border: 1px solid transparent;
    outline: none;
    cursor: pointer;
    flex-shrink: 0;
    overflow: visible;
    box-sizing: border-box;
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
    font-family: inherit;
  }

  .ds-button:hover:not(:disabled) {
    background: rgba(3, 2, 19, 0.9);
  }

  .ds-button:focus-visible {
    border-color: var(--ds-ring, #a8a8a8);
    box-shadow: 0 0 0 3px var(--ds-ring-color, rgba(168, 168, 168, 0.5));
  }

  .ds-button--disabled,
  .ds-button:disabled {
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Secondary (outline) */
  .ds-button--secondary {
    background: var(--ds-background, #fff);
    color: var(--ds-foreground, #1a1a1a);
    border: 1px solid var(--ds-border, rgba(0, 0, 0, 0.1));
  }

  .ds-button--secondary:hover:not(:disabled) {
    background: var(--ds-accent, #e9ebef);
  }

  /* Ghost */
  .ds-button--ghost {
    background: transparent;
    border-color: transparent;
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-button--ghost:hover:not(:disabled) {
    background: var(--ds-accent, #e9ebef);
  }

  /* Tertiary — kept for backward compat, maps to ghost behavior */
  .ds-button--tertiary {
    background: transparent;
    border-color: transparent;
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-button--tertiary:hover:not(:disabled) {
    background: var(--ds-accent, #e9ebef);
  }

  /* Destructive */
  .ds-button--destructive {
    background: var(--ds-destructive, #d4183d);
    color: var(--ds-destructive-foreground, #fff);
  }

  .ds-button--destructive:hover:not(:disabled) {
    background: rgba(212, 24, 61, 0.9);
  }

  /* Size sm */
  .ds-button--sm {
    height: 2rem;
    padding: 0 0.75rem;
    gap: 0.375rem;
  }

  /* Size lg */
  .ds-button--lg {
    height: 2.5rem;
    padding: 0 1.5rem;
  }

  /* Size icon */
  .ds-button--icon {
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
  }

  .ds-button-spinner {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ds-button-success {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ds-button-success svg {
    width: 16px;
    height: 16px;
  }

  .ds-button-content {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .ds-button-content--hidden {
    visibility: hidden;
  }
</style>
