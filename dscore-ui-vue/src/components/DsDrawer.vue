<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  modelValue?: boolean
  position?: 'left' | 'right'
  width?: string
  closeOnOverlay?: boolean
  closeOnEsc?: boolean
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  position: 'right',
  width: '400px',
  closeOnOverlay: true,
  closeOnEsc: true,
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  close: []
}>()

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const panelStyle = computed(() => ({
  width: props.width,
  ...(props.position === 'right' ? { right: '0' } : { left: '0' })
}))

const close = () => {
  isOpen.value = false
  emit('close')
}

const handleOverlayClick = (event: MouseEvent) => {
  if (props.closeOnOverlay && event.target === event.currentTarget) {
    close()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEsc && isOpen.value) {
    close()
  }
}

watch(isOpen, (newValue: boolean) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
    emit('open')
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

defineExpose({ close })
</script>

<template>
  <Teleport to="body">
    <Transition name="ds-drawer-overlay">
      <div
        v-if="isOpen"
        :class="isStyled && 'ds-drawer-overlay'"
        @click="handleOverlayClick"
      >
        <Transition :name="position === 'right' ? 'ds-drawer-right' : 'ds-drawer-left'">
          <div
            v-if="isOpen"
            :class="[
              isStyled && 'ds-drawer',
              isStyled && ('ds-drawer--' + position)
            ]"
            :style="panelStyle"
            role="dialog"
            aria-modal="true"
          >
            <div v-if="$slots.header" :class="isStyled && 'ds-drawer__header'">
              <slot name="header" />
            </div>

            <div :class="isStyled && 'ds-drawer__body'">
              <slot />
            </div>

            <div v-if="$slots.footer" :class="isStyled && 'ds-drawer__footer'">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style>

  .ds-drawer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .ds-drawer {
    position: fixed;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    background: var(--ds-background, #fff);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
    z-index: 1001;
    color: var(--ds-foreground, #1a1a1a);
    font-family: var(--ds-font-family, inherit);
  }

  .ds-drawer--left {
    left: 0;
    border-right: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    border-radius: 0;
  }

  .ds-drawer--right {
    right: 0;
    border-left: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    border-radius: 0;
  }

  .ds-drawer__header {
    padding: 1rem;
    border-bottom: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    flex-shrink: 0;
    font-size: 1rem;
    font-weight: 600;
  }

  .ds-drawer__body {
    padding: 1rem;
    overflow-y: auto;
    flex: 1;
    font-size: 0.875rem;
  }

  .ds-drawer__footer {
    padding: 1rem;
    border-top: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    flex-shrink: 0;
  }

  .ds-drawer-overlay-enter-active,
  .ds-drawer-overlay-leave-active {
    transition: opacity 250ms cubic-bezier(0.4,0,0.2,1);
  }

  .ds-drawer-overlay-enter-from,
  .ds-drawer-overlay-leave-to {
    opacity: 0;
  }

  .ds-drawer-right-enter-active,
  .ds-drawer-right-leave-active {
    transition: transform 250ms cubic-bezier(0.4,0,0.2,1);
  }

  .ds-drawer-right-enter-from,
  .ds-drawer-right-leave-to {
    transform: translateX(100%);
  }

  .ds-drawer-left-enter-active,
  .ds-drawer-left-leave-active {
    transition: transform 250ms cubic-bezier(0.4,0,0.2,1);
  }

  .ds-drawer-left-enter-from,
  .ds-drawer-left-leave-to {
    transform: translateX(-100%);
  }
</style>
