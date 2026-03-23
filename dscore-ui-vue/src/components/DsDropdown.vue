<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  disabled?: boolean
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  open: []
  close: []
}>()

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const isOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const open = () => {
  if (props.disabled) return
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
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    if (isOpen.value) close()
  }
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
  <div
    ref="rootRef"
    :class="[
      isStyled && 'ds-dropdown',
      isStyled && disabled && 'ds-dropdown--disabled'
    ]"
  >
    <div :class="isStyled && 'ds-dropdown__trigger'" @click="toggle">
      <slot name="trigger" />
    </div>
    <Transition name="ds-dropdown">
      <div v-if="isOpen" :class="isStyled && 'ds-dropdown__menu'">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style>
@layer ds-base {
  .ds-dropdown {
    position: relative;
    display: inline-flex;
  }

  .ds-dropdown--disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  .ds-dropdown__trigger {
    cursor: pointer;
  }

  .ds-dropdown__menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 100;
    min-width: 160px;
    background: var(--ds-surface-container-lowest, #fff);
    border: var(--ds-ghost-border, 1px solid rgba(169, 180, 185, 0.2));
    box-shadow: var(--ds-shadow-ambient, 0 4px 24px rgba(0, 0, 0, 0.08));
    border-radius: 0px;
    padding: var(--ds-spacing-2, 0.5rem) 0;
  }

  .ds-dropdown__item {
    padding: var(--ds-spacing-2, 0.5rem) var(--ds-spacing-4, 1rem);
    cursor: pointer;
    font-size: var(--ds-font-size-sm, 0.8125rem);
    color: var(--ds-on-surface, #2a3439);
    font-family: var(--ds-font-family, inherit);
    transition: background var(--ds-transition-fast, 150ms ease);
  }

  .ds-dropdown__item:hover {
    background: var(--ds-surface-container-low, rgba(169, 180, 185, 0.08));
  }

  /* Transition */
  .ds-dropdown-enter-active,
  .ds-dropdown-leave-active {
    transition: opacity var(--ds-transition-fast, 150ms ease), transform var(--ds-transition-fast, 150ms ease);
  }

  .ds-dropdown-enter-from,
  .ds-dropdown-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }
}
</style>
