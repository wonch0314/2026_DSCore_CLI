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

  .ds-alert {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    position: relative;
    font-size: 0.875rem;
    background: var(--ds-card, #fff);
    color: var(--ds-card-foreground, #1a1a1a);
  }

  .ds-alert--info {
    background: var(--ds-info-container, #f0f6fa);
    color: var(--ds-info, #3d6b8a);
    border-color: rgba(61, 107, 138, 0.2);
  }
  .ds-alert--success {
    background: var(--ds-success-container, #f0f7f2);
    color: var(--ds-success, #3d7a4a);
    border-color: rgba(61, 122, 74, 0.2);
  }
  .ds-alert--warning {
    background: var(--ds-warning-container, #fdf8ef);
    color: var(--ds-warning, #8a6d2b);
    border-color: rgba(138, 109, 43, 0.2);
  }
  .ds-alert--error {
    background: var(--ds-error-container, #fdf2f2);
    color: var(--ds-destructive, #d4183d);
    border-color: rgba(212, 24, 61, 0.2);
  }

  .ds-alert-icon {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    margin-top: 1px;
    opacity: 0.9;
  }

  .ds-alert-icon svg {
    width: 100%;
    height: 100%;
  }

  .ds-alert-content {
    flex: 1;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .ds-alert-close {
    flex-shrink: 0;
    background: none;
    border: none;
    padding: 0.25rem;
    cursor: pointer;
    opacity: 0.45;
    color: currentColor;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -2px;
    transition: opacity 150ms cubic-bezier(0.4,0,0.2,1);
  }

  .ds-alert-close:hover {
    opacity: 0.85;
  }

  .ds-alert-close svg {
    width: 14px;
    height: 14px;
  }

  .ds-alert-enter-active,
  .ds-alert-leave-active {
    transition: opacity 250ms cubic-bezier(0.4,0,0.2,1),
                transform 250ms cubic-bezier(0.4,0,0.2,1),
                max-height 250ms cubic-bezier(0.4,0,0.2,1);
    overflow: hidden;
  }

  .ds-alert-enter-from,
  .ds-alert-leave-to {
    opacity: 0;
    transform: translateY(-6px);
  }
</style>
