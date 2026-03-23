<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top',
  delay: 200,
  applyDefaultStyle: undefined
})

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const isVisible = ref(false)
const tooltipStyle = ref<Record<string, string>>({})
const triggerRef = ref<HTMLElement | null>(null)
let showTimer: ReturnType<typeof setTimeout> | null = null

const calculatePosition = () => {
  if (!triggerRef.value) return
  const rect = triggerRef.value.getBoundingClientRect()
  const gap = 8

  const style: Record<string, string> = {}

  if (props.position === 'top') {
    style.left = `${rect.left + rect.width / 2}px`
    style.top = `${rect.top - gap}px`
    style.transform = 'translate(-50%, -100%)'
  } else if (props.position === 'bottom') {
    style.left = `${rect.left + rect.width / 2}px`
    style.top = `${rect.bottom + gap}px`
    style.transform = 'translate(-50%, 0)'
  } else if (props.position === 'left') {
    style.left = `${rect.left - gap}px`
    style.top = `${rect.top + rect.height / 2}px`
    style.transform = 'translate(-100%, -50%)'
  } else if (props.position === 'right') {
    style.left = `${rect.right + gap}px`
    style.top = `${rect.top + rect.height / 2}px`
    style.transform = 'translate(0, -50%)'
  }

  tooltipStyle.value = style
}

const show = () => {
  showTimer = setTimeout(() => {
    calculatePosition()
    isVisible.value = true
  }, props.delay)
}

const hide = () => {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }
  isVisible.value = false
}

onUnmounted(() => {
  if (showTimer) clearTimeout(showTimer)
})
</script>

<template>
  <span
    ref="triggerRef"
    :class="isStyled && 'ds-tooltip-trigger'"
    @mouseenter="show"
    @mouseleave="hide"
    @focus="show"
    @blur="hide"
  >
    <slot />
    <Teleport to="body">
      <Transition name="ds-tooltip">
        <div
          v-if="isVisible && content"
          :class="isStyled && 'ds-tooltip'"
          role="tooltip"
          :style="tooltipStyle"
        >
          {{ content }}
        </div>
      </Transition>
    </Teleport>
  </span>
</template>

<style>
@layer ds-base {
  .ds-tooltip-trigger {
    display: inline-flex;
    align-items: center;
  }

  .ds-tooltip {
    position: fixed;
    z-index: 9999;
    background: var(--ds-on-surface, #2a3439);
    color: var(--ds-surface-container-lowest, #fff);
    padding: var(--ds-spacing-1, 0.25rem) var(--ds-spacing-3, 0.75rem);
    font-size: var(--ds-font-size-xs, 0.75rem);
    border-radius: 0px;
    pointer-events: none;
    white-space: nowrap;
    font-family: var(--ds-font-family, inherit);
  }

  /* Transition */
  .ds-tooltip-enter-active,
  .ds-tooltip-leave-active {
    transition: opacity var(--ds-transition-fast, 150ms ease);
  }

  .ds-tooltip-enter-from,
  .ds-tooltip-leave-to {
    opacity: 0;
  }
}
</style>
