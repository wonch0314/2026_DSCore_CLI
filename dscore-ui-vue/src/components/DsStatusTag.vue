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

  .ds-status-tag {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.5rem;
    border-radius: 0.375rem;
    border: 1px solid transparent;
    font-size: 0.75rem;
    font-weight: 500;
    background: var(--ds-primary, #030213);
    color: var(--ds-primary-foreground, #fff);
    line-height: 1.4;
    white-space: nowrap;
  }

  /* outline variant (applied by status modifiers) */
  .ds-status-tag--active {
    background: rgba(61, 122, 74, 0.1);
    color: #2e6638;
    border-color: rgba(61, 122, 74, 0.25);
  }

  .ds-status-tag--inactive {
    background: transparent;
    color: var(--ds-foreground, #1a1a1a);
    border-color: var(--ds-border, rgba(0,0,0,0.1));
  }

  .ds-status-tag--pending {
    background: rgba(138, 109, 43, 0.1);
    color: #7a5c1e;
    border-color: rgba(138, 109, 43, 0.25);
  }

  .ds-status-tag--rejected {
    background: rgba(212, 24, 61, 0.08);
    color: var(--ds-destructive, #d4183d);
    border-color: rgba(212, 24, 61, 0.2);
  }

  .ds-status-tag--completed {
    background: rgba(61, 107, 138, 0.1);
    color: #3d6b8a;
    border-color: rgba(61, 107, 138, 0.25);
  }
</style>
