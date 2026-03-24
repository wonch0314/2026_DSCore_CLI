<script setup lang="ts">
import { computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  label?: string
  closable?: boolean
  disabled?: boolean
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  closable: true,
  disabled: false,
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  close: []
}>()

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const handleClose = () => {
  if (!props.disabled) {
    emit('close')
  }
}
</script>

<template>
  <span
    :class="[
      isStyled && 'ds-filter-chip',
      isStyled && disabled && 'ds-filter-chip--disabled'
    ]"
  >
    <span v-if="label" :class="isStyled && 'ds-filter-chip__label'">{{ label }}</span>
    <span :class="isStyled && 'ds-filter-chip__value'">
      <slot />
    </span>
    <button
      v-if="closable && !disabled"
      type="button"
      :class="isStyled && 'ds-filter-chip__close'"
      @click.stop="handleClose"
      aria-label="필터 제거"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="10" height="10">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </span>
</template>

<style>
  .ds-filter-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background: var(--ds-secondary, #f0f0f5);
    border: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    border-radius: var(--ds-radius-full, 9999px);
    font-size: 0.75rem;
    line-height: 1.5;
    color: var(--ds-foreground, #1a1a1a);
    font-family: var(--ds-font-family, inherit);
    white-space: nowrap;
    transition: background 150ms cubic-bezier(0.4,0,0.2,1);
  }

  .ds-filter-chip--disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .ds-filter-chip__label {
    color: var(--ds-muted-foreground, #717182);
    font-weight: 500;
  }

  .ds-filter-chip__label::after {
    content: ':';
    margin-right: 0.125rem;
  }

  .ds-filter-chip__value {
    font-weight: 500;
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-filter-chip__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0.125rem;
    margin-left: 0.125rem;
    cursor: pointer;
    color: var(--ds-muted-foreground, #717182);
    border-radius: 9999px;
    transition: background 150ms cubic-bezier(0.4,0,0.2,1),
                color 150ms cubic-bezier(0.4,0,0.2,1);
  }

  .ds-filter-chip__close:hover {
    background: var(--ds-accent, #e9ebef);
    color: var(--ds-foreground, #1a1a1a);
  }
</style>
