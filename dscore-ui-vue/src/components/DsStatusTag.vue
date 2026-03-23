<script setup lang="ts">
import { computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  status?: string
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  status: '',
  applyDefaultStyle: undefined
})

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)
</script>

<template>
  <span :class="[isStyled && 'ds-status-tag', isStyled && status && 'ds-status-tag--' + status]">
    <slot />
  </span>
</template>

<style>
@layer ds-base {
  .ds-status-tag {
    display: inline-flex;
    align-items: center;
    padding: var(--ds-spacing-1, 0.25rem) var(--ds-spacing-3, 0.75rem);
    border-radius: 0px;
    border: 1px solid rgba(169, 180, 185, 0.2);
    font-size: var(--ds-font-size-xs, 0.75rem);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: var(--ds-letter-spacing-wide, 0.06em);
    color: var(--ds-on-surface, #2a3439);
    background: transparent;
    line-height: 1.4;
  }
}
</style>
