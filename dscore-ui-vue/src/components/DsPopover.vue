<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  position?: 'top' | 'bottom' | 'left' | 'right'
  closeOnClickOutside?: boolean
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  position: 'bottom',
  closeOnClickOutside: true,
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  open: []
  close: []
}>()

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})

const gap = 8

const calculatePosition = () => {
  if (!triggerRef.value) return
  const rect = triggerRef.value.getBoundingClientRect()
  const style: Record<string, string> = {}

  if (props.position === 'bottom') {
    style.left = `${rect.left}px`
    style.top = `${rect.bottom + gap}px`
  } else if (props.position === 'top') {
    style.left = `${rect.left}px`
    style.top = `${rect.top - gap}px`
    style.transform = 'translateY(-100%)'
  } else if (props.position === 'left') {
    style.left = `${rect.left - gap}px`
    style.top = `${rect.top}px`
    style.transform = 'translateX(-100%)'
  } else if (props.position === 'right') {
    style.left = `${rect.right + gap}px`
    style.top = `${rect.top}px`
  }

  panelStyle.value = style
}

const open = () => {
  calculatePosition()
  isOpen.value = true
  emit('open')
}

const close = () => {
  isOpen.value = false
  emit('close')
}

const toggle = () => {
  if (isOpen.value) {
    close()
  } else {
    open()
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (!props.closeOnClickOutside) return
  const target = event.target as Node
  if (triggerRef.value && triggerRef.value.contains(target)) return
  // Check if click is inside the popover panel (rendered in body via teleport)
  const panel = document.querySelector('.ds-popover__panel')
  if (panel && panel.contains(target)) return
  if (isOpen.value) close()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})

defineExpose({ open, close, toggle })
</script>

<template>
  <span ref="triggerRef" :class="isStyled && 'ds-popover'" @click="toggle">
    <slot name="trigger" />
    <Teleport to="body">
      <Transition name="ds-popover">
        <div
          v-if="isOpen"
          :class="isStyled && 'ds-popover__panel'"
          :style="panelStyle"
        >
          <slot />
        </div>
      </Transition>
    </Teleport>
  </span>
</template>

<style>
@layer ds-base {
  .ds-popover {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }

  .ds-popover__panel {
    position: fixed;
    z-index: 9998;
    background: var(--ds-surface-container-lowest, #fff);
    border: var(--ds-ghost-border, 1px solid rgba(169, 180, 185, 0.2));
    box-shadow: var(--ds-shadow-ambient, 0 4px 24px rgba(0, 0, 0, 0.08));
    border-radius: 0px;
    padding: var(--ds-spacing-4, 1rem);
    color: var(--ds-on-surface, #2a3439);
    font-family: var(--ds-font-family, inherit);
  }

  /* Transition */
  .ds-popover-enter-active,
  .ds-popover-leave-active {
    transition: opacity var(--ds-transition-normal, 250ms ease), transform var(--ds-transition-normal, 250ms ease);
  }

  .ds-popover-enter-from,
  .ds-popover-leave-to {
    opacity: 0;
    transform: scale(0.98);
  }

  .ds-popover-enter-to,
  .ds-popover-leave-from {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
