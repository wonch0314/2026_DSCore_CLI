<script setup lang="ts">
import { computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
  preset?: 'table' | 'card' | 'form' | 'list'
  rows?: number
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
  <!-- Preset mode -->
  <div v-if="preset" :class="[isStyled && 'ds-skeleton-preset', isStyled && `ds-skeleton-preset--${preset}`]">
    <!-- Table preset -->
    <template v-if="preset === 'table'">
      <div :class="isStyled && 'ds-skeleton-preset__table-header'">
        <span v-for="i in 4" :key="i" :class="[isStyled && 'ds-skeleton', isStyled && 'ds-skeleton--text', isStyled && `ds-skeleton--${animation}`]" :style="{ width: `${15 + i * 5}%`, height: '1rem' }" />
      </div>
      <div v-for="r in (rows ?? 5)" :key="r" :class="isStyled && 'ds-skeleton-preset__table-row'">
        <span v-for="i in 4" :key="i" :class="[isStyled && 'ds-skeleton', isStyled && 'ds-skeleton--text', isStyled && `ds-skeleton--${animation}`]" :style="{ width: `${15 + i * 5}%`, height: '0.85rem' }" />
      </div>
    </template>

    <!-- Card preset -->
    <template v-if="preset === 'card'">
      <span :class="[isStyled && 'ds-skeleton', isStyled && 'ds-skeleton--rectangular', isStyled && `ds-skeleton--${animation}`]" style="width: 100%; height: 120px;" />
      <div :class="isStyled && 'ds-skeleton-preset__card-body'">
        <span :class="[isStyled && 'ds-skeleton', isStyled && 'ds-skeleton--text', isStyled && `ds-skeleton--${animation}`]" style="width: 60%; height: 1.125rem;" />
        <span v-for="r in (rows ?? 3)" :key="r" :class="[isStyled && 'ds-skeleton', isStyled && 'ds-skeleton--text', isStyled && `ds-skeleton--${animation}`]" :style="{ width: r === (rows ?? 3) ? '40%' : '100%', height: '0.85rem' }" />
      </div>
    </template>

    <!-- Form preset -->
    <template v-if="preset === 'form'">
      <div v-for="r in (rows ?? 4)" :key="r" :class="isStyled && 'ds-skeleton-preset__form-row'">
        <span :class="[isStyled && 'ds-skeleton', isStyled && 'ds-skeleton--text', isStyled && `ds-skeleton--${animation}`]" style="width: 80px; height: 0.85rem;" />
        <span :class="[isStyled && 'ds-skeleton', isStyled && 'ds-skeleton--rectangular', isStyled && `ds-skeleton--${animation}`]" style="width: 100%; height: 2.25rem;" />
      </div>
    </template>

    <!-- List preset -->
    <template v-if="preset === 'list'">
      <div v-for="r in (rows ?? 5)" :key="r" :class="isStyled && 'ds-skeleton-preset__list-row'">
        <span :class="[isStyled && 'ds-skeleton', isStyled && 'ds-skeleton--circular', isStyled && `ds-skeleton--${animation}`]" style="width: 36px; height: 36px;" />
        <div :class="isStyled && 'ds-skeleton-preset__list-text'">
          <span :class="[isStyled && 'ds-skeleton', isStyled && 'ds-skeleton--text', isStyled && `ds-skeleton--${animation}`]" style="width: 40%; height: 0.85rem;" />
          <span :class="[isStyled && 'ds-skeleton', isStyled && 'ds-skeleton--text', isStyled && `ds-skeleton--${animation}`]" style="width: 70%; height: 0.75rem;" />
        </div>
      </div>
    </template>
  </div>

  <!-- Single skeleton mode (existing behavior) -->
  <span
    v-else
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

  .ds-skeleton-preset {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .ds-skeleton-preset__table-header {
    display: flex;
    gap: 1rem;
    padding: 0.75rem 0.5rem;
    border-bottom: 1px solid var(--ds-border, rgba(0,0,0,0.1));
  }

  .ds-skeleton-preset__table-row {
    display: flex;
    gap: 1rem;
    padding: 0.625rem 0.5rem;
    border-bottom: 1px solid var(--ds-border, rgba(0,0,0,0.06));
  }

  .ds-skeleton-preset__card-body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
  }

  .ds-skeleton-preset__form-row {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    margin-bottom: 1rem;
  }

  .ds-skeleton-preset__list-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--ds-border, rgba(0,0,0,0.06));
  }

  .ds-skeleton-preset__list-text {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    flex: 1;
  }
</style>
