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
@layer ds-base {
  .ds-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: var(--ds-spacing-3, 0.75rem) var(--ds-spacing-6, 1.5rem);
    background: var(--ds-primary, #5f5e5e);
    color: var(--ds-on-primary, #faf7f6);
    border: none;
    border-radius: var(--ds-border-radius, 0px);
    font-family: var(--ds-font-family, inherit);
    font-size: var(--ds-font-size-md, 0.875rem);
    font-weight: 500;
    line-height: 1;
    transition: opacity var(--ds-transition-normal, 250ms ease), background var(--ds-transition-normal, 250ms ease);
    user-select: none;
  }

  .ds-button:hover:not(:disabled) {
    opacity: 0.88;
  }

  .ds-button:active:not(:disabled) {
    opacity: 0.76;
  }

  .ds-button--disabled,
  .ds-button:disabled {
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.5;
  }

  /* Secondary variant: ghost border, no fill */
  .ds-button--secondary {
    background: transparent;
    color: var(--ds-primary, #5f5e5e);
    border: var(--ds-ghost-border, 1px solid rgba(169, 180, 185, 0.2));
  }

  .ds-button--secondary:hover:not(:disabled) {
    opacity: 1;
    background: rgba(95, 94, 94, 0.06);
  }

  /* Tertiary variant: no border/fill, bottom-border on hover */
  .ds-button--tertiary {
    background: transparent;
    color: var(--ds-primary, #5f5e5e);
    border: none;
    border-bottom: 1px solid transparent;
  }

  .ds-button--tertiary:hover:not(:disabled) {
    opacity: 1;
    border-bottom-color: var(--ds-primary, #5f5e5e);
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
    gap: 0.5em;
  }

  .ds-button-content--hidden {
    visibility: hidden;
  }
}
</style>
