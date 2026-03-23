<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  type?: 'success' | 'error' | 'warning' | 'info'
  closable?: boolean
  icon?: object
  showIcon?: boolean
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  closable: false,
  showIcon: true,
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'close': []
}>()

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)
const visible = ref(true)

const AlertIcon = computed(() => props.icon || config.icons?.[props.type])
const CloseIcon = computed(() => config.icons?.close)

const close = () => {
  visible.value = false
  emit('close')
}

const getDefaultIcon = (type: string) => {
  const icons: Record<string, string> = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  }
  return icons[type]
}
</script>

<template>
  <Transition name="ds-alert">
    <div
      v-if="visible"
      :class="[isStyled && 'ds-alert', isStyled && `ds-alert--${type}`]"
      role="alert"
    >
      <span v-if="showIcon" :class="isStyled && 'ds-alert-icon'">
        <component v-if="AlertIcon" :is="AlertIcon" />
        <span v-else v-html="getDefaultIcon(type)" />
      </span>
      <div :class="isStyled && 'ds-alert-content'">
        <slot />
      </div>
      <button
        v-if="closable"
        type="button"
        :class="isStyled && 'ds-alert-close'"
        @click="close"
        aria-label="Close"
      >
        <component v-if="CloseIcon" :is="CloseIcon" />
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<style>
@layer ds-base {
  .ds-alert {
    display: flex;
    align-items: flex-start;
    gap: var(--ds-spacing-3, 0.75rem);
    padding: var(--ds-spacing-4, 1rem);
    border-radius: 0px;
  }

  .ds-alert--info {
    background: var(--ds-info-container, #f0f6fa);
    color: var(--ds-info, #3d6b8a);
  }
  .ds-alert--success {
    background: var(--ds-success-container, #edf6f0);
    color: var(--ds-success, #3d7a4a);
  }
  .ds-alert--warning {
    background: var(--ds-warning-container, #f9f3e6);
    color: var(--ds-warning, #8a6d2b);
  }
  .ds-alert--error {
    background: var(--ds-error-container, #faf0f0);
    color: var(--ds-error, #9f403d);
  }

  .ds-alert-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }

  .ds-alert-icon svg {
    width: 100%;
    height: 100%;
  }

  .ds-alert-content {
    flex: 1;
    font-size: var(--ds-font-size-sm, 0.875rem);
  }

  .ds-alert-close {
    flex-shrink: 0;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    opacity: 0.5;
  }

  .ds-alert-close:hover {
    opacity: 1;
  }

  .ds-alert-close svg {
    width: 16px;
    height: 16px;
  }

  .ds-alert-enter-active,
  .ds-alert-leave-active {
    transition: all 0.2s ease;
  }

  .ds-alert-enter-from,
  .ds-alert-leave-to {
    opacity: 0;
    transform: translateY(-8px);
  }
}
</style>
