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

  .ds-badge {
    position: relative;
    display: inline-flex;
  }

  .ds-badge__content {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    background: var(--ds-destructive, #d4183d);
    color: #fff;
    font-size: 10px;
    font-weight: 600;
    line-height: 1;
    padding: 2px 5px;
    border-radius: 9999px;
    white-space: nowrap;
    min-width: 18px;
    height: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: var(--ds-font-family, inherit);
  }

  .ds-badge__content--dot {
    width: 8px;
    height: 8px;
    min-width: unset;
    padding: 0;
    border-radius: 9999px;
  }
</style>
