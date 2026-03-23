<script setup lang="ts">
import { computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  animation: 'pulse',
  applyDefaultStyle: undefined
})

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const getStyle = () => {
  const style: Record<string, string> = {}

  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }

  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }

  return style
}
</script>

<template>
  <span
    :class="[
      isStyled && 'ds-skeleton',
      isStyled && `ds-skeleton--${variant}`,
      isStyled && `ds-skeleton--${animation}`
    ]"
    :style="getStyle()"
  />
</template>

<style>

  .ds-skeleton {
    display: block;
    background: var(--ds-accent, #e9ebef);
    border-radius: 0.375rem;
  }

  .ds-skeleton--text {
    height: 0.85em;
    border-radius: 0.375rem;
    width: 100%;
  }

  .ds-skeleton--circular {
    border-radius: 9999px;
  }

  .ds-skeleton--rectangular {
    border-radius: 0.375rem;
  }

  .ds-skeleton--pulse {
    animation: ds-skeleton-pulse 2s ease-in-out infinite;
  }

  .ds-skeleton--wave {
    position: relative;
    overflow: hidden;
  }

  .ds-skeleton--wave::after {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.55) 50%,
      transparent 100%
    );
    animation: ds-skeleton-wave 1.6s ease-in-out infinite;
  }

  @keyframes ds-skeleton-pulse {
    0%   { opacity: 1; }
    50%  { opacity: 0.38; }
    100% { opacity: 1; }
  }

  @keyframes ds-skeleton-wave {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
</style>
