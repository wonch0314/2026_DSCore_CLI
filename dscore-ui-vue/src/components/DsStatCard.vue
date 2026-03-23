<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  title?: string
  value?: string | number
  change?: number | null
  changeUnit?: string
  loading?: boolean
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  value: '',
  change: null,
  changeUnit: '%',
  loading: false,
  applyDefaultStyle: undefined
})

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const slots = useSlots()

const trend = computed(() => {
  if (props.change === null || props.change === undefined) return 'neutral'
  if (props.change > 0) return 'up'
  if (props.change < 0) return 'down'
  return 'neutral'
})
</script>

<template>
  <div :class="[isStyled && 'ds-stat-card', isStyled && loading && 'ds-stat-card--loading']">
    <div v-if="slots.icon" :class="isStyled && 'ds-stat-card__icon'">
      <slot name="icon" />
    </div>
    <div :class="isStyled && 'ds-stat-card__content'">
      <div :class="isStyled && 'ds-stat-card__title'">{{ title }}</div>
      <div :class="isStyled && 'ds-stat-card__value'">
        <slot name="value">{{ value }}</slot>
      </div>
      <div
        v-if="change !== null"
        :class="[isStyled && 'ds-stat-card__change', isStyled && `ds-stat-card__change--${trend}`]"
      >
        {{ change > 0 ? '+' : '' }}{{ change }}{{ changeUnit }}
      </div>
    </div>
    <div v-if="slots.footer" :class="isStyled && 'ds-stat-card__footer'">
      <slot name="footer" />
    </div>
  </div>
</template>

<style>
@layer ds-base {
  .ds-stat-card {
    background: var(--ds-surface-container-lowest, #fff);
    border: 1px solid rgba(169, 180, 185, 0.2);
    box-shadow: 0 10px 40px 0 rgba(42, 52, 57, 0.04);
    border-radius: 0px;
    padding: var(--ds-spacing-4, 1rem);
    display: flex;
    flex-direction: column;
    gap: var(--ds-spacing-2, 0.5rem);
  }

  .ds-stat-card--loading {
    opacity: 0.6;
    pointer-events: none;
  }

  .ds-stat-card__icon {
    color: var(--ds-on-surface-variant, #5a6970);
    opacity: 0.7;
  }

  .ds-stat-card__content {
    display: flex;
    flex-direction: column;
    gap: var(--ds-spacing-1, 0.25rem);
  }

  .ds-stat-card__title {
    font-size: var(--ds-font-size-xs, 0.75rem);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: var(--ds-letter-spacing-wide, 0.06em);
    color: var(--ds-on-surface-variant, #5a6970);
  }

  .ds-stat-card__value {
    font-size: var(--ds-font-size-xl, 1.5rem);
    font-weight: 600;
    color: var(--ds-on-surface, #2a3439);
    line-height: 1.2;
  }

  .ds-stat-card__change {
    font-size: var(--ds-font-size-sm, 0.875rem);
    font-weight: 500;
  }

  .ds-stat-card__change--up {
    color: var(--ds-success, #3d7a4a);
  }

  .ds-stat-card__change--down {
    color: var(--ds-error, #9f403d);
  }

  .ds-stat-card__change--neutral {
    color: var(--ds-on-surface-variant, #5a6970);
  }

  .ds-stat-card__footer {
    margin-top: var(--ds-spacing-2, 0.5rem);
    padding-top: var(--ds-spacing-2, 0.5rem);
    border-top: 1px solid rgba(169, 180, 185, 0.2);
    font-size: var(--ds-font-size-sm, 0.875rem);
    color: var(--ds-on-surface-variant, #5a6970);
  }
}
</style>
