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

  .ds-card {
    background: var(--ds-card, #fff);
    border: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    border-radius: 0.75rem;
    color: var(--ds-card-foreground, #1a1a1a);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .ds-card--elevated {
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
  }

  .ds-card--flat {
    box-shadow: none;
    background: var(--ds-muted, #ececf0);
  }

  .ds-card__header {
    padding: 1.5rem 1.5rem 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--ds-card-foreground, #1a1a1a);
  }

  .ds-card__body {
    padding: 0 1.5rem;
    font-size: 0.875rem;
    line-height: 1.6;
  }

  .ds-card__footer {
    padding: 0 1.5rem 1.5rem;
    font-size: 0.875rem;
    color: var(--ds-muted-foreground, #717182);
  }
</style>
