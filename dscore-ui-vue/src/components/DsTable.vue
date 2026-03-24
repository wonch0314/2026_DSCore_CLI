<script setup lang="ts">
import { ref, computed, toRef, watch } from 'vue'
import { useDsConfig } from '../plugin'

interface Column {
  key: string
  label: string
  sortable?: boolean
  width?: string
  fixed?: 'left' | 'right'
}

interface Props {
  data?: any[]
  columns?: Column[]
  selectable?: boolean
  sortable?: boolean
  rowKey?: string
  selected?: any[]
  sortKey?: string
  sortOrder?: 'asc' | 'desc' | ''
  loading?: boolean
  emptyText?: string
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  columns: () => [],
  selectable: false,
  sortable: false,
  rowKey: 'id',
  selected: () => [],
  sortKey: '',
  sortOrder: '',
  loading: false,
  emptyText: '데이터가 없습니다',
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'update:selected': [value: any[]]
  'update:sort-key': [value: string]
  'update:sort-order': [value: 'asc' | 'desc' | '']
  'row-click': [row: any, rowIndex: number]
}>()

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

// --- Selection logic (inline) ---
const selectedIds = ref(new Set<any>())

const isAllSelected = computed(() => {
  if (props.data.length === 0) return false
  return props.data.every((item: any) => selectedIds.value.has(item[props.rowKey]))
})

const toggleAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = new Set()
  } else {
    selectedIds.value = new Set(props.data.map((item: any) => item[props.rowKey]))
  }
}

const toggleOne = (id: any) => {
  const next = new Set(selectedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selectedIds.value = next
}

// --- Sort logic (inline) ---
const internalSortKey = ref<string | null>(props.sortKey || null)
const internalSortOrder = ref<'asc' | 'desc' | null>(
  (props.sortOrder as 'asc' | 'desc') || null
)

const toggleSort = (key: string) => {
  if (internalSortKey.value === key) {
    if (internalSortOrder.value === 'asc') {
      internalSortOrder.value = 'desc'
    } else if (internalSortOrder.value === 'desc') {
      internalSortKey.value = null
      internalSortOrder.value = null
    } else {
      internalSortOrder.value = 'asc'
    }
  } else {
    internalSortKey.value = key
    internalSortOrder.value = 'asc'
  }
}

// Sync selectedIds with props.selected
watch(
  () => props.selected,
  (newVal: any[]) => {
    selectedIds.value.clear()
    newVal.forEach((id: any) => selectedIds.value.add(id))
  },
  { immediate: true }
)

// Emit when selectedIds changes
watch(
  () => [...selectedIds.value],
  (newVal: any[]) => {
    emit('update:selected', newVal)
  },
  { deep: true }
)

// Sync sort props
watch(
  () => props.sortKey,
  (val: string) => {
    internalSortKey.value = val || null
  }
)

watch(
  () => props.sortOrder,
  (val: 'asc' | 'desc' | '') => {
    internalSortOrder.value = (val as 'asc' | 'desc') || null
  }
)

// Emit sort changes
watch(internalSortKey, (val: string | null) => {
  emit('update:sort-key', val ?? '')
})

watch(internalSortOrder, (val: 'asc' | 'desc' | null) => {
  emit('update:sort-order', val ?? '')
})

const handleHeaderClick = (column: Column) => {
  if (!props.sortable || !column.sortable) return
  toggleSort(column.key)
}

const handleRowClick = (row: any, rowIndex: number) => {
  emit('row-click', row, rowIndex)
}

const getSortClass = (column: Column) => {
  if (!props.sortable || !column.sortable) return ''
  if (internalSortKey.value !== column.key) return 'ds-table__sort'
  return `ds-table__sort ds-table__sort--${internalSortOrder.value}`
}

const getFixedStyle = (column: Column, colIndex: number) => {
  if (!column.fixed) return undefined
  const style: Record<string, string> = {
    position: 'sticky',
    zIndex: column.fixed === 'left' ? '2' : '1',
    background: 'inherit',
  }
  if (column.fixed === 'left') {
    let left = 0
    for (let i = 0; i < colIndex; i++) {
      if (props.columns[i]?.fixed === 'left') {
        left += parseInt(props.columns[i]?.width || '120', 10)
      }
    }
    style.left = props.selectable && colIndex === 0 ? '44px' : `${left}px`
  } else {
    style.right = '0'
  }
  return style
}

const isEmpty = computed(() => !props.loading && props.data.length === 0)
</script>

<template>
  <div :class="[isStyled && 'ds-table', isStyled && loading && 'ds-table--loading']">
    <table :class="isStyled && 'ds-table__table'">
      <thead :class="isStyled && 'ds-table__head'">
        <tr :class="[isStyled && 'ds-table__row', isStyled && 'ds-table__row--header']">
          <th v-if="selectable" :class="[isStyled && 'ds-table__header', isStyled && 'ds-table__header--checkbox']">
            <input
              type="checkbox"
              :checked="isAllSelected"
              :indeterminate="selectedIds.size > 0 && !isAllSelected"
              @change="toggleAll"
            />
          </th>
          <th
            v-for="column in columns"
            :key="column.key"
            :class="[isStyled && 'ds-table__header', isStyled && getSortClass(column), isStyled && sortable && column.sortable && 'ds-table__header--sortable']"
            :style="[column.width ? { width: column.width } : undefined, getFixedStyle(column, columns.indexOf(column))]"
            @click="handleHeaderClick(column)"
          >
            <slot :name="`header-${column.key}`" :column="column">
              <span :class="isStyled && 'ds-table__header-label'">{{ column.label }}</span>
              <span v-if="sortable && column.sortable" :class="isStyled && 'ds-table__sort-icon'">
                <span v-if="internalSortKey === column.key && internalSortOrder === 'asc'">▲</span>
                <span v-else-if="internalSortKey === column.key && internalSortOrder === 'desc'">▼</span>
                <span v-else>↕</span>
              </span>
            </slot>
          </th>
        </tr>
      </thead>

      <tbody :class="isStyled && 'ds-table__body'">
        <template v-if="loading && data.length === 0">
          <tr :class="[isStyled && 'ds-table__row', isStyled && 'ds-table__row--loading']">
            <td
              :colspan="selectable ? columns.length + 1 : columns.length"
              :class="[isStyled && 'ds-table__cell', isStyled && 'ds-table__cell--loading']"
            >
              <slot name="loading">
                <svg :class="isStyled && 'ds-table__spinner'" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" opacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round" />
                </svg>
              </slot>
            </td>
          </tr>
        </template>

        <template v-else-if="isEmpty">
          <tr :class="[isStyled && 'ds-table__row', isStyled && 'ds-table__row--empty']">
            <td
              :colspan="selectable ? columns.length + 1 : columns.length"
              :class="[isStyled && 'ds-table__cell', isStyled && 'ds-table__cell--empty']"
            >
              <slot name="empty">
                <span>{{ emptyText }}</span>
              </slot>
            </td>
          </tr>
        </template>

        <template v-else>
          <template v-for="(row, rowIndex) in data" :key="row?.[rowKey] ?? rowIndex">
            <tr
              v-if="row"
              :class="[isStyled && 'ds-table__row', isStyled && selectedIds.has(row[rowKey]) && 'ds-table__row--selected']"
              @click="handleRowClick(row, rowIndex)"
            >
              <td v-if="selectable" :class="[isStyled && 'ds-table__cell', isStyled && 'ds-table__cell--checkbox']">
                <input
                  type="checkbox"
                  :checked="selectedIds.has(row[rowKey])"
                  @change.stop="toggleOne(row[rowKey])"
                  @click.stop
                />
              </td>
              <td
                v-for="column in columns"
                :key="column.key"
                :class="isStyled && 'ds-table__cell'"
                :style="getFixedStyle(column, columns.indexOf(column))"
              >
                <slot
                  :name="`cell-${column.key}`"
                  :row="row"
                  :column="column"
                  :row-index="rowIndex"
                >
                  {{ row[column.key] }}
                </slot>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
    <div v-if="loading && data.length > 0" :class="isStyled && 'ds-table__loading-overlay'">
      <svg :class="isStyled && 'ds-table__spinner'" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" opacity="0.25" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round" />
      </svg>
    </div>
  </div>
</template>

<style>

  .ds-table {
    position: relative;
    width: 100%;
    overflow-x: auto;
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-table--loading {
    pointer-events: none;
    opacity: 0.7;
  }

  .ds-table__table {
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
  }

  .ds-table__head {
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .ds-table__header {
    height: 2.5rem;
    padding: 0 0.5rem;
    text-align: left;
    white-space: nowrap;
    user-select: none;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--ds-foreground, #1a1a1a);
    vertical-align: middle;
    border-bottom: 1px solid var(--ds-border, rgba(0,0,0,0.1));
  }

  .ds-table__header--sortable {
    cursor: pointer;
    transition: color 150ms cubic-bezier(0.4,0,0.2,1);
  }

  .ds-table__header--sortable:hover {
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-table__header-label {
    display: inline;
  }

  .ds-table__sort-icon {
    display: inline-flex;
    align-items: center;
    margin-left: 0.3em;
    font-size: 0.7em;
    opacity: 0.35;
    transition: opacity 150ms cubic-bezier(0.4,0,0.2,1);
  }

  .ds-table__sort--asc .ds-table__sort-icon,
  .ds-table__sort--desc .ds-table__sort-icon {
    opacity: 1;
    color: var(--ds-primary, #030213);
  }

  .ds-table__body .ds-table__row {
    background: var(--ds-background, #fff);
    cursor: default;
    border-bottom: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    transition: background 150ms cubic-bezier(0.4,0,0.2,1);
  }

  .ds-table__body .ds-table__row:last-child {
    border-bottom: none;
  }

  .ds-table__body .ds-table__row:hover {
    background: color-mix(in srgb, var(--ds-muted, #ececf0) 50%, transparent);
  }

  .ds-table__row--selected {
    background: var(--ds-accent, #e9ebef) !important;
  }

  .ds-table__cell {
    padding: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
    vertical-align: middle;
  }

  .ds-table__cell--empty,
  .ds-table__cell--loading {
    text-align: center;
    color: var(--ds-muted-foreground, #717182);
    padding: 2rem 0.5rem;
    font-size: 0.875rem;
  }

  .ds-table__header--checkbox,
  .ds-table__cell--checkbox {
    width: 44px;
    white-space: nowrap;
    text-align: center;
  }

  .ds-table__loading-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.7);
    z-index: 3;
  }

  .ds-table__spinner {
    animation: ds-table-spin 1s linear infinite;
    color: var(--ds-primary, #030213);
  }

  @keyframes ds-table-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>
