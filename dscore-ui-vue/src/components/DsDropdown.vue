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

  .ds-dropdown {
    position: relative;
    display: inline-flex;
  }

  .ds-dropdown--disabled {
    pointer-events: none;
    opacity: 0.45;
  }

  .ds-dropdown__trigger {
    cursor: pointer;
  }

  .ds-dropdown__menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 50;
    min-width: 8rem;
    background: var(--ds-popover, #fff);
    border: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
    border-radius: 0.375rem;
    padding: 0.25rem;
  }

  .ds-dropdown__item {
    display: block;
    width: 100%;
    padding: 0.375rem 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--ds-popover-foreground, #1a1a1a);
    font-family: var(--ds-font-family, inherit);
    background: none;
    border: none;
    text-align: left;
    border-radius: 0.125rem;
    transition: background 150ms cubic-bezier(0.4,0,0.2,1);
    line-height: 1.5;
  }

  .ds-dropdown__item:hover {
    background: color-mix(in srgb, var(--ds-accent, #e9ebef) 60%, transparent);
    color: var(--ds-accent-foreground, #030213);
  }

  .ds-dropdown__item--active:hover,
  .ds-dropdown__item[aria-selected="true"]:hover {
    background: var(--ds-accent, #e9ebef);
  }

  .ds-dropdown__item--active,
  .ds-dropdown__item[aria-selected="true"] {
    background: var(--ds-accent, #e9ebef);
    font-weight: 500;
  }

  .ds-dropdown__divider {
    height: 1px;
    background: var(--ds-border, rgba(0,0,0,0.1));
    margin: 0.25rem 0;
  }

  .ds-dropdown-enter-active,
  .ds-dropdown-leave-active {
    transition: opacity 150ms cubic-bezier(0.4,0,0.2,1),
                transform 150ms cubic-bezier(0.4,0,0.2,1);
  }

  .ds-dropdown-enter-from,
  .ds-dropdown-leave-to {
    opacity: 0;
    transform: translateY(-6px);
  }
</style>
