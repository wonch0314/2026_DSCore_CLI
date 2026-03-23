<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  modelValue?: boolean
  disabled?: boolean
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'toggle': [value: boolean]
}>()

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  isOpen.value = val
})

const toggle = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  emit('update:modelValue', isOpen.value)
  emit('toggle', isOpen.value)
}

const onEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = '0'
  element.style.overflow = 'hidden'
  requestAnimationFrame(() => {
    element.style.height = element.scrollHeight + 'px'
  })
}

const onAfterEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = ''
  element.style.overflow = ''
}

const onLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = element.scrollHeight + 'px'
  element.style.overflow = 'hidden'
  requestAnimationFrame(() => {
    element.style.height = '0'
  })
}

const onAfterLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = ''
  element.style.overflow = ''
}
</script>

<template>
  <div
    :class="[
      isStyled && 'ds-collapse',
      isStyled && isOpen && 'ds-collapse--open',
      isStyled && disabled && 'ds-collapse--disabled'
    ]"
  >
    <div :class="isStyled && 'ds-collapse__header'" @click="toggle">
      <slot name="header" :is-open="isOpen" />
      <span :class="isStyled && 'ds-collapse__arrow'" />
    </div>
    <Transition
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @leave="onLeave"
      @after-leave="onAfterLeave"
    >
      <div v-show="isOpen" :class="isStyled && 'ds-collapse__content'">
        <div :class="isStyled && 'ds-collapse__content-inner'">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
@layer ds-base {
  .ds-collapse {
    font-family: var(--ds-font-family, 'Inter', sans-serif);
    color: var(--ds-on-surface, #1a1a1a);
    border: var(--ds-ghost-border, 1px solid rgba(169, 180, 185, 0.2));
    border-radius: var(--ds-border-radius, 0px);
  }

  .ds-collapse__header {
    padding: var(--ds-spacing-4, 1rem);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    transition: background var(--ds-transition-normal, 250ms ease);
  }

  .ds-collapse__header:hover {
    background: var(--ds-surface-container-low, rgba(169, 180, 185, 0.08));
  }

  .ds-collapse--disabled .ds-collapse__header {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ds-collapse__arrow {
    display: inline-block;
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 6px solid var(--ds-on-surface, #1a1a1a);
    transition: transform var(--ds-transition-normal, 250ms ease);
    flex-shrink: 0;
  }

  .ds-collapse--open .ds-collapse__arrow {
    transform: rotate(90deg);
  }

  .ds-collapse__content {
    overflow: hidden;
    transition: height var(--ds-transition-normal, 250ms ease);
  }

  .ds-collapse__content-inner {
    padding: var(--ds-spacing-4, 1rem);
  }
}
</style>
