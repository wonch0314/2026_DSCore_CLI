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

const totalPages = computed(() =>
  props.pageSize > 0 ? Math.ceil(props.total / props.pageSize) : 0
)

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

  .ds-pagination {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    color: var(--ds-foreground, #1a1a1a);
    font-family: var(--ds-font-family, inherit);
  }

  .ds-pagination__btn {
    cursor: pointer;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 0.375rem;
    padding: 0;
    font-size: 0.875rem;
    font-family: var(--ds-font-family, inherit);
    color: var(--ds-foreground, #1a1a1a);
    transition: background 150ms cubic-bezier(0.4,0,0.2,1),
                color 150ms cubic-bezier(0.4,0,0.2,1),
                border-color 150ms cubic-bezier(0.4,0,0.2,1);
    width: 2.25rem;
    height: 2.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  .ds-pagination__prev,
  .ds-pagination__next {
    font-size: 1.1rem;
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-pagination__btn:hover:not(:disabled) {
    background: var(--ds-accent, #e9ebef);
    color: var(--ds-accent-foreground, #030213);
  }

  .ds-pagination__btn--active {
    border: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    background: transparent;
    color: var(--ds-foreground, #1a1a1a);
    font-weight: 500;
  }

  .ds-pagination__btn--active:hover:not(:disabled) {
    background: var(--ds-accent, #e9ebef);
  }

  .ds-pagination__btn:disabled {
    cursor: not-allowed;
    opacity: 0.35;
  }

  .ds-pagination__ellipsis {
    width: 2.25rem;
    height: 2.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--ds-muted-foreground, #717182);
    user-select: none;
    font-size: 0.875rem;
  }
</style>
