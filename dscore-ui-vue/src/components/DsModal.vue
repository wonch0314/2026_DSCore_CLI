<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  modelValue?: boolean
  closeIcon?: object
  closeOnOverlay?: boolean
  closeOnEsc?: boolean
  showClose?: boolean
  confirmBeforeClose?: boolean
  confirmMessage?: string
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  closeOnOverlay: undefined,
  closeOnEsc: undefined,
  showClose: true,
  confirmBeforeClose: false,
  confirmMessage: '변경사항이 있습니다. 닫으시겠습니까?',
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
  'open': []
}>()

const config = useDsConfig()

const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const modalRef = ref<HTMLElement | null>(null)
const previousActiveElement = ref<HTMLElement | null>(null)

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const effectiveCloseOnOverlay = computed(() =>
  props.closeOnOverlay ?? config.defaults?.modal?.closeOnOverlay ?? true
)

const effectiveCloseOnEsc = computed(() =>
  props.closeOnEsc ?? config.defaults?.modal?.closeOnEsc ?? true
)

const CloseIconComponent = computed(() =>
  props.closeIcon || config.icons?.close
)

const tryClose = async () => {
  if (props.confirmBeforeClose) {
    const confirmed = window.confirm(props.confirmMessage)
    if (!confirmed) return
  }
  close()
}

const close = () => {
  isOpen.value = false
  emit('close')
}

const handleOverlayClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget && effectiveCloseOnOverlay.value) {
    tryClose()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && effectiveCloseOnEsc.value) {
    tryClose()
  }

  // Focus trap
  if (event.key === 'Tab' && modalRef.value) {
    const focusableElements = modalRef.value.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement?.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement?.focus()
    }
  }
}

watch(isOpen, async (newValue) => {
  if (newValue) {
    previousActiveElement.value = document.activeElement as HTMLElement
    document.body.style.overflow = 'hidden'
    emit('open')
    await nextTick()
    modalRef.value?.focus()
  } else {
    document.body.style.overflow = ''
    previousActiveElement.value?.focus()
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

defineExpose({ close, tryClose })
</script>

<template>
  <Teleport to="body">
    <Transition name="ds-modal">
      <div
        v-if="isOpen"
        :class="isStyled && 'ds-modal-overlay'"
        @click="handleOverlayClick"
      >
        <div
          ref="modalRef"
          :class="isStyled && 'ds-modal'"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
        >
          <div v-if="$slots.header || showClose" :class="isStyled && 'ds-modal-header'">
            <slot name="header" />
            <button
              v-if="showClose"
              type="button"
              :class="isStyled && 'ds-modal-close'"
              @click="tryClose"
              aria-label="Close"
            >
              <component v-if="CloseIconComponent" :is="CloseIconComponent" />
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div :class="isStyled && 'ds-modal-content'">
            <slot />
          </div>

          <div v-if="$slots.footer" :class="isStyled && 'ds-modal-footer'">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>

  .ds-modal-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    padding: 1rem;
  }

  .ds-modal {
    position: relative;
    background: var(--ds-background, #fff);
    border-radius: 0.5rem;
    border: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 320px;
    max-width: min(32rem, calc(100vw - 2rem));
    max-height: 90vh;
    overflow-y: auto;
    outline: none;
    color: var(--ds-foreground, #1a1a1a);
    font-family: var(--ds-font-family, inherit);
  }

  .ds-modal::-webkit-scrollbar {
    width: 4px;
  }
  .ds-modal::-webkit-scrollbar-track {
    background: transparent;
  }
  .ds-modal::-webkit-scrollbar-thumb {
    background: var(--ds-border, rgba(0,0,0,0.1));
  }

  .ds-modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .ds-modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    flex-shrink: 0;
    background: none;
    border: none;
    cursor: pointer;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ds-foreground, #1a1a1a);
    opacity: 0.7;
    border-radius: 0.25rem;
    transition: opacity 150ms cubic-bezier(0.4,0,0.2,1);
  }

  .ds-modal-close:hover {
    opacity: 1;
  }

  .ds-modal-close svg {
    width: 16px;
    height: 16px;
    stroke-width: 1.75;
  }

  .ds-modal-content {
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-modal-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
  }

  .ds-modal-enter-active {
    transition: opacity 250ms cubic-bezier(0.4,0,0.2,1);
  }
  .ds-modal-leave-active {
    transition: opacity 150ms cubic-bezier(0.4,0,0.2,1);
  }

  .ds-modal-enter-from,
  .ds-modal-leave-to {
    opacity: 0;
  }

  .ds-modal-enter-active .ds-modal {
    transition: transform 250ms cubic-bezier(0.4,0,0.2,1),
                opacity 250ms cubic-bezier(0.4,0,0.2,1);
  }
  .ds-modal-leave-active .ds-modal {
    transition: transform 150ms cubic-bezier(0.4,0,0.2,1),
                opacity 150ms cubic-bezier(0.4,0,0.2,1);
  }

  .ds-modal-enter-from .ds-modal {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }

  .ds-modal-leave-to .ds-modal {
    opacity: 0;
    transform: translateY(6px) scale(0.99);
  }
</style>
