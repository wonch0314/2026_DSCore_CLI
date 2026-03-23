<script setup lang="ts">
import { computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  selectedCount?: number
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectedCount: 0,
  applyDefaultStyle: undefined
})

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const hasSelection = computed(() => props.selectedCount > 0)
</script>

<template>
  <div :class="isStyled && 'ds-action-bar'">
    <div :class="isStyled && 'ds-action-bar__left'">
      <slot name="left">
        <slot name="info">
          <span v-if="hasSelection" :class="isStyled && 'ds-action-bar__selected-info'">
            {{ selectedCount }}개 선택됨
          </span>
        </slot>
      </slot>
    </div>
    <div :class="isStyled && 'ds-action-bar__right'">
      <slot />
    </div>
  </div>
</template>

<style>

  .ds-action-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 0;
  }

  .ds-action-bar__left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .ds-action-bar__right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .ds-action-bar__selected-info {
    font-size: 0.875rem;
    color: var(--ds-foreground, #1a1a1a);
    font-weight: 500;
  }
</style>
