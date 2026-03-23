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

  .ds-search-bar {
    background: var(--ds-card, #fff);
    border: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    border-radius: 0.75rem;
    padding: 1.5rem;
  }

  .ds-search-bar__fields {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .ds-search-bar__actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
    justify-content: flex-end;
    align-items: center;
  }

  .ds-search-bar__search-btn,
  .ds-search-bar__reset-btn {
    padding: 0.5rem 1.25rem;
    font-size: 0.875rem;
  }
</style>
