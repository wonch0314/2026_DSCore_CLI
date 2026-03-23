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

  .ds-collapse {
    color: var(--ds-foreground, #1a1a1a);
    border-bottom: 1px solid var(--ds-border, rgba(0,0,0,0.1));
  }

  .ds-collapse__header {
    padding: 1rem 0;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background 150ms cubic-bezier(0.4,0,0.2,1);
    gap: 0.75rem;
  }

  .ds-collapse__header:hover {
    background: transparent;
    opacity: 0.8;
  }

  .ds-collapse--disabled .ds-collapse__header {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .ds-collapse__arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    color: var(--ds-muted-foreground, #717182);
    transition: transform 200ms cubic-bezier(0.4,0,0.2,1);
    font-size: 0.75rem;
    line-height: 1;
  }

  .ds-collapse__arrow::before {
    content: '▼';
  }

  .ds-collapse--open .ds-collapse__arrow {
    transform: rotate(180deg);
  }

  .ds-collapse__content {
    overflow: hidden;
    transition: height 250ms cubic-bezier(0.4,0,0.2,1);
  }

  .ds-collapse__content-inner {
    padding-bottom: 1rem;
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--ds-foreground, #1a1a1a);
  }
</style>
