<script setup lang="ts">
import { computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  loading?: boolean
  searchText?: string
  resetText?: string
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  searchText: '검색',
  resetText: '초기화',
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  search: []
  reset: []
}>()

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const handleSearch = () => {
  if (!props.loading) {
    emit('search')
  }
}

const handleReset = () => {
  emit('reset')
}
</script>

<template>
  <div :class="isStyled && 'ds-search-bar'">
    <div :class="isStyled && 'ds-search-bar__fields'">
      <slot />
    </div>
    <div :class="isStyled && 'ds-search-bar__actions'">
      <button
        type="button"
        :class="[
          isStyled && 'ds-button',
          isStyled && 'ds-search-bar__search-btn',
          isStyled && loading && 'ds-button--loading'
        ]"
        :disabled="loading"
        @click="handleSearch"
      >
        {{ searchText }}
      </button>
      <button
        type="button"
        :class="[
          isStyled && 'ds-button',
          isStyled && 'ds-button--secondary',
          isStyled && 'ds-search-bar__reset-btn'
        ]"
        :disabled="loading"
        @click="handleReset"
      >
        {{ resetText }}
      </button>
      <slot name="actions" />
    </div>
  </div>
</template>

<style>
@layer ds-base {
  .ds-search-bar {
    background: var(--ds-surface-container-lowest);
    border: var(--ds-ghost-border);
    padding: var(--ds-spacing-6);
  }

  .ds-search-bar__fields {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ds-spacing-4);
  }

  .ds-search-bar__actions {
    display: flex;
    gap: var(--ds-spacing-2);
    margin-top: var(--ds-spacing-4);
    justify-content: flex-end;
    align-items: center;
  }

  .ds-search-bar__search-btn,
  .ds-search-bar__reset-btn {
    padding: var(--ds-spacing-2, 0.5rem) var(--ds-spacing-5, 1.25rem);
    font-size: var(--ds-font-size-sm, 0.875rem);
  }
}
</style>
