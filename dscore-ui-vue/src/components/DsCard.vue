<script setup lang="ts">
import { computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  applyDefaultStyle: undefined
})

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)
</script>

<template>
  <div :class="isStyled && 'ds-card'">
    <div v-if="$slots.header" :class="isStyled && 'ds-card__header'">
      <slot name="header" />
    </div>
    <div :class="isStyled && 'ds-card__body'">
      <slot />
    </div>
    <div v-if="$slots.footer" :class="isStyled && 'ds-card__footer'">
      <slot name="footer" />
    </div>
  </div>
</template>

<style>
@layer ds-base {
  .ds-card {
    background: var(--ds-surface-container-lowest, #fff);
    border: var(--ds-ghost-border, 1px solid rgba(169, 180, 185, 0.2));
    border-radius: var(--ds-border-radius, 0px);
    font-family: var(--ds-font-family, 'Inter', sans-serif);
    color: var(--ds-on-surface, #1a1a1a);
  }

  .ds-card--elevated {
    box-shadow: var(--ds-shadow-ambient);
  }

  .ds-card__header {
    padding: var(--ds-spacing-6, 1.5rem) var(--ds-spacing-6, 1.5rem) 0;
  }

  .ds-card__body {
    padding: var(--ds-spacing-6, 1.5rem);
  }

  .ds-card__footer {
    padding: 0 var(--ds-spacing-6, 1.5rem) var(--ds-spacing-6, 1.5rem);
  }

  .ds-card__header + .ds-card__body {
    padding-top: var(--ds-spacing-8, 2rem);
  }

  .ds-card__body + .ds-card__footer {
    padding-top: 0;
  }
}
</style>
