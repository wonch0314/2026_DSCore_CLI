<script setup lang="ts">
import { computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  value?: string | number
  max?: number
  dot?: boolean
  hidden?: boolean
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  max: 99,
  dot: false,
  hidden: false,
  applyDefaultStyle: undefined
})

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const displayValue = computed(() => {
  if (props.dot) return ''
  const num = Number(props.value)
  if (!isNaN(num) && num > props.max) return `${props.max}+`
  return String(props.value)
})

const showSup = computed(() => {
  if (props.hidden) return false
  if (props.dot) return true
  if (props.value === 0 || props.value === '0') return false
  return props.value !== ''
})
</script>

<template>
  <div :class="isStyled && 'ds-badge'">
    <slot />
    <sup
      v-if="showSup"
      :class="[isStyled && 'ds-badge__content', isStyled && dot && 'ds-badge__content--dot']"
    >{{ displayValue }}</sup>
  </div>
</template>

<style>
@layer ds-base {
  .ds-badge {
    position: relative;
    display: inline-flex;
  }

  .ds-badge__content {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    background: var(--ds-error, #9f403d);
    color: var(--ds-on-primary, #fff);
    font-size: var(--ds-font-size-xs, 0.625rem);
    font-weight: 600;
    line-height: 1;
    padding: 0.2em 0.45em;
    border-radius: 0px;
    white-space: nowrap;
    min-width: 1.25em;
    text-align: center;
  }

  .ds-badge__content--dot {
    width: 8px;
    height: 8px;
    padding: 0;
    min-width: unset;
    border-radius: 50%;
  }
}
</style>
