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
        v-if="change != null"
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

  .ds-stat-card {
    background: var(--ds-card, #fff);
    border: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    border-radius: 0.75rem;
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    color: var(--ds-card-foreground, #1a1a1a);
  }

  .ds-stat-card--loading {
    opacity: 0.55;
    pointer-events: none;
  }

  .ds-stat-card__icon {
    color: var(--ds-muted-foreground, #717182);
    opacity: 0.65;
    line-height: 1;
  }

  .ds-stat-card__content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .ds-stat-card__title {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--ds-muted-foreground, #717182);
    line-height: 1.2;
  }

  .ds-stat-card__value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--ds-foreground, #1a1a1a);
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  .ds-stat-card__change {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 0.75rem;
    font-weight: 500;
    margin-top: 0.25rem;
  }

  .ds-stat-card__change--up {
    color: #3d7a4a;
  }

  .ds-stat-card__change--down {
    color: var(--ds-destructive, #d4183d);
  }

  .ds-stat-card__change--neutral {
    color: var(--ds-muted-foreground, #717182);
  }

  .ds-stat-card__footer {
    margin-top: 0.25rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    font-size: 0.75rem;
    color: var(--ds-muted-foreground, #717182);
    line-height: 1.5;
  }
</style>
