<script setup lang="ts">
import { computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  value?: number
  max?: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  striped?: boolean
  animated?: boolean
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  max: 100,
  showLabel: false,
  size: 'md',
  striped: false,
  animated: false,
  applyDefaultStyle: undefined
})

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const percentage = computed(() => {
  if (!props.max) return 0
  const pct = (props.value / props.max) * 100
  return Math.min(100, Math.max(0, pct))
})
</script>

<template>
  <div
    :class="[
      isStyled && 'ds-progress',
      isStyled && `ds-progress--${size}`,
      isStyled && striped && 'ds-progress--striped',
      isStyled && animated && 'ds-progress--animated'
    ]"
    role="progressbar"
    :aria-valuenow="value"
    :aria-valuemin="0"
    :aria-valuemax="max"
  >
    <div
      :class="isStyled && 'ds-progress-bar'"
      :style="{ width: `${percentage}%` }"
    >
      <span v-if="showLabel" :class="isStyled && 'ds-progress-label'">
        {{ Math.round(percentage) }}%
      </span>
    </div>
  </div>
</template>

<style>

  .ds-progress {
    width: 100%;
    background: rgba(3, 2, 19, 0.2);
    border-radius: 9999px;
    overflow: hidden;
    position: relative;
    height: 0.5rem;
  }

  .ds-progress--sm  { height: 0.25rem; }
  .ds-progress--md  { height: 0.5rem; }
  .ds-progress--lg  { height: 0.75rem; }

  .ds-progress-bar {
    height: 100%;
    background: var(--ds-primary, #030213);
    border-radius: 9999px;
    transition: all 150ms cubic-bezier(0.4,0,0.2,1);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 0.5rem;
  }

  .ds-progress--striped .ds-progress-bar {
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.12) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.12) 75%,
      transparent 75%,
      transparent
    );
    background-size: 1rem 1rem;
  }

  .ds-progress--animated .ds-progress-bar {
    animation: ds-progress-stripes 1s linear infinite;
  }

  @keyframes ds-progress-stripes {
    from { background-position: 1rem 0; }
    to   { background-position: 0 0; }
  }

  .ds-progress-label {
    font-size: 0.6875rem;
    color: #fff;
    font-weight: 600;
    white-space: nowrap;
  }
</style>
