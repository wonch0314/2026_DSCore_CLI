<script setup lang="ts">
import { computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  title?: string
  description?: string
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '데이터가 없습니다',
  description: '',
  applyDefaultStyle: undefined
})

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)
</script>

<template>
  <div :class="isStyled && 'ds-empty'">
    <div v-if="$slots.icon" :class="isStyled && 'ds-empty__icon'">
      <slot name="icon" />
    </div>
    <div :class="isStyled && 'ds-empty__title'">{{ title }}</div>
    <div v-if="description" :class="isStyled && 'ds-empty__description'">{{ description }}</div>
    <div v-if="$slots.action" :class="isStyled && 'ds-empty__action'">
      <slot name="action" />
    </div>
    <slot />
  </div>
</template>

<style>
@layer ds-base {
  .ds-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--ds-spacing-2, 0.5rem);
    padding: var(--ds-spacing-4, 1rem);
    color: var(--ds-on-surface-variant, #5a6970);
  }

  .ds-empty__icon {
    opacity: 0.5;
    margin-bottom: var(--ds-spacing-2, 0.5rem);
  }

  .ds-empty__title {
    font-size: var(--ds-font-size-base, 1rem);
    font-weight: 500;
    color: var(--ds-on-surface-variant, #5a6970);
  }

  .ds-empty__description {
    font-size: var(--ds-font-size-sm, 0.875rem);
    color: var(--ds-on-surface-variant, #5a6970);
    opacity: 0.7;
    text-align: center;
  }

  .ds-empty__action {
    margin-top: var(--ds-spacing-3, 0.75rem);
  }
}
</style>
