<script setup lang="ts">
import { computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  modelValue?: number
  total?: number
  pageSize?: number
  maxButtons?: number
  disabled?: boolean
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 1,
  total: 0,
  pageSize: 10,
  maxButtons: 5,
  disabled: false,
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'update:modelValue': [page: number]
  'change': [page: number]
}>()

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

const pageButtons = computed<(number | '...')[]>(() => {
  const total = totalPages.value
  const current = props.modelValue
  const max = props.maxButtons

  if (total <= max) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const half = Math.floor(max / 2)
  let start = current - half
  let end = current + half

  if (start < 1) {
    start = 1
    end = max
  }
  if (end > total) {
    end = total
    start = total - max + 1
  }

  const pages: (number | '...')[] = []

  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('...')
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (end < total) {
    if (end < total - 1) pages.push('...')
    pages.push(total)
  }

  return pages
})

const navigate = (page: number) => {
  if (props.disabled) return
  if (page < 1 || page > totalPages.value) return
  if (page === props.modelValue) return
  emit('update:modelValue', page)
  emit('change', page)
}
</script>

<template>
  <nav :class="isStyled && 'ds-pagination'" aria-label="Pagination">
    <button
      :class="[isStyled && 'ds-pagination__btn', isStyled && 'ds-pagination__prev']"
      :disabled="disabled || modelValue <= 1"
      @click="navigate(modelValue - 1)"
      aria-label="Previous page"
    >
      <slot name="prev">&lsaquo;</slot>
    </button>

    <template v-for="(page, index) in pageButtons" :key="index">
      <span v-if="page === '...'" :class="isStyled && 'ds-pagination__ellipsis'">...</span>
      <button
        v-else
        :class="[isStyled && 'ds-pagination__btn', isStyled && page === modelValue && 'ds-pagination__btn--active']"
        :disabled="disabled"
        :aria-current="page === modelValue ? 'page' : undefined"
        @click="navigate(page as number)"
      >
        {{ page }}
      </button>
    </template>

    <button
      :class="[isStyled && 'ds-pagination__btn', isStyled && 'ds-pagination__next']"
      :disabled="disabled || modelValue >= totalPages"
      @click="navigate(modelValue + 1)"
      aria-label="Next page"
    >
      <slot name="next">&rsaquo;</slot>
    </button>
  </nav>
</template>

<style>
@layer ds-base {
  .ds-pagination {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-spacing-1, 0.25rem);
    font-size: var(--ds-font-size-sm, 0.875rem);
    color: var(--ds-on-surface, #2a3439);
  }

  .ds-pagination__btn {
    cursor: pointer;
    background: var(--ds-surface-container-lowest, #fff);
    border: 1px solid rgba(169, 180, 185, 0.2);
    border-radius: 0px;
    padding: var(--ds-spacing-1, 0.25rem) var(--ds-spacing-3, 0.75rem);
    font-size: var(--ds-font-size-sm, 0.875rem);
    color: var(--ds-on-surface, #2a3439);
    transition: background 0.15s;
    min-width: 2rem;
    text-align: center;
  }

  .ds-pagination__btn:hover:not(:disabled) {
    background: var(--ds-surface-container-low, #f0f4f7);
  }

  .ds-pagination__btn--active {
    background: var(--ds-primary, #5f5e5e);
    color: var(--ds-on-primary, #fff);
    border-color: var(--ds-primary, #5f5e5e);
  }

  .ds-pagination__btn--active:hover:not(:disabled) {
    background: var(--ds-primary, #5f5e5e);
  }

  .ds-pagination__btn:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  .ds-pagination__ellipsis {
    padding: var(--ds-spacing-1, 0.25rem) var(--ds-spacing-2, 0.5rem);
    color: var(--ds-on-surface-variant, #5a6970);
    user-select: none;
  }
}
</style>
