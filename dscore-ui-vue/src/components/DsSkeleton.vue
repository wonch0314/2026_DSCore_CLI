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
@layer ds-base {
  .ds-skeleton {
    display: block;
    background: var(--ds-surface-container, #e8eff3);
    border-radius: 0px;
  }

  .ds-skeleton--text {
    height: 1em;
    border-radius: 0px;
    width: 100%;
  }

  .ds-skeleton--circular {
    border-radius: 50%;
  }

  .ds-skeleton--rectangular {
    border-radius: 0px;
  }

  .ds-skeleton--pulse {
    animation: ds-skeleton-pulse 1.5s ease-in-out infinite;
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
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    animation: ds-skeleton-wave 1.5s linear infinite;
  }

  @keyframes ds-skeleton-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  @keyframes ds-skeleton-wave {
    100% { transform: translateX(100%); }
  }
}
</style>
