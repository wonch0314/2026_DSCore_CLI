<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDsConfig } from '../plugin'

interface TransferItem {
  key: string | number
  label: string
  disabled?: boolean
}

interface Props {
  modelValue?: (string | number)[]
  data?: TransferItem[]
  titles?: [string, string]
  searchable?: boolean
  disabled?: boolean
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  data: () => [],
  titles: () => ['전체', '선택됨'],
  searchable: false,
  disabled: false,
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: (string | number)[]]
  'change': [value: (string | number)[], direction: 'right' | 'left', moved: (string | number)[]]
}>()

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const leftSearch = ref('')
const rightSearch = ref('')
const leftChecked = ref<Set<string | number>>(new Set())
const rightChecked = ref<Set<string | number>>(new Set())

// Source = items NOT in modelValue
const sourceItems = computed(() =>
  props.data.filter(item => !props.modelValue.includes(item.key))
)

// Target = items IN modelValue, in order
const targetItems = computed(() =>
  props.modelValue
    .map(key => props.data.find(item => item.key === key))
    .filter((item): item is TransferItem => !!item)
)

const filteredSource = computed(() => {
  const q = leftSearch.value.toLowerCase()
  return q ? sourceItems.value.filter(item => item.label.toLowerCase().includes(q)) : sourceItems.value
})

const filteredTarget = computed(() => {
  const q = rightSearch.value.toLowerCase()
  return q ? targetItems.value.filter(item => item.label.toLowerCase().includes(q)) : targetItems.value
})

// Left panel checkbox state
const leftAllChecked = computed(() => {
  const enabled = filteredSource.value.filter(i => !i.disabled)
  return enabled.length > 0 && enabled.every(i => leftChecked.value.has(i.key))
})
const leftIndeterminate = computed(() => {
  const enabled = filteredSource.value.filter(i => !i.disabled)
  const checkedCount = enabled.filter(i => leftChecked.value.has(i.key)).length
  return checkedCount > 0 && checkedCount < enabled.length
})
const leftCheckedCount = computed(() =>
  filteredSource.value.filter(i => leftChecked.value.has(i.key)).length
)

// Right panel checkbox state
const rightAllChecked = computed(() => {
  const enabled = filteredTarget.value.filter(i => !i.disabled)
  return enabled.length > 0 && enabled.every(i => rightChecked.value.has(i.key))
})
const rightIndeterminate = computed(() => {
  const enabled = filteredTarget.value.filter(i => !i.disabled)
  const checkedCount = enabled.filter(i => rightChecked.value.has(i.key)).length
  return checkedCount > 0 && checkedCount < enabled.length
})
const rightCheckedCount = computed(() =>
  filteredTarget.value.filter(i => rightChecked.value.has(i.key)).length
)

function toggleLeftAll() {
  const enabled = filteredSource.value.filter(i => !i.disabled)
  if (leftAllChecked.value) {
    for (const item of enabled) leftChecked.value.delete(item.key)
  } else {
    for (const item of enabled) leftChecked.value.add(item.key)
  }
  leftChecked.value = new Set(leftChecked.value)
}

function toggleRightAll() {
  const enabled = filteredTarget.value.filter(i => !i.disabled)
  if (rightAllChecked.value) {
    for (const item of enabled) rightChecked.value.delete(item.key)
  } else {
    for (const item of enabled) rightChecked.value.add(item.key)
  }
  rightChecked.value = new Set(rightChecked.value)
}

function toggleLeft(key: string | number) {
  if (leftChecked.value.has(key)) leftChecked.value.delete(key)
  else leftChecked.value.add(key)
  leftChecked.value = new Set(leftChecked.value)
}

function toggleRight(key: string | number) {
  if (rightChecked.value.has(key)) rightChecked.value.delete(key)
  else rightChecked.value.add(key)
  rightChecked.value = new Set(rightChecked.value)
}

function moveToRight() {
  if (leftChecked.value.size === 0) return
  const moved = [...leftChecked.value].filter(k =>
    sourceItems.value.find(i => i.key === k && !i.disabled)
  )
  const newValue = [...props.modelValue, ...moved]
  emit('update:modelValue', newValue)
  emit('change', newValue, 'right', moved)
  leftChecked.value = new Set()
}

function moveToLeft() {
  if (rightChecked.value.size === 0) return
  const moved = [...rightChecked.value].filter(k =>
    targetItems.value.find(i => i.key === k && !i.disabled)
  )
  const newValue = props.modelValue.filter(k => !moved.includes(k))
  emit('update:modelValue', newValue)
  emit('change', newValue, 'left', moved)
  rightChecked.value = new Set()
}

const canMoveRight = computed(() => leftCheckedCount.value > 0)
const canMoveLeft = computed(() => rightCheckedCount.value > 0)
</script>

<template>
  <div
    :class="[
      isStyled && 'ds-transfer',
      isStyled && disabled && 'ds-transfer--disabled'
    ]"
  >
    <!-- Left panel: source -->
    <div :class="isStyled && 'ds-transfer-panel'">
      <div :class="isStyled && 'ds-transfer-panel-header'">
        <input
          type="checkbox"
          :class="isStyled && 'ds-transfer-checkbox'"
          :checked="leftAllChecked"
          :indeterminate="leftIndeterminate"
          :disabled="filteredSource.length === 0"
          @change="toggleLeftAll"
        />
        <span :class="isStyled && 'ds-transfer-panel-title'">{{ titles[0] }}</span>
        <span :class="isStyled && 'ds-transfer-panel-count'">{{ leftCheckedCount }}/{{ sourceItems.length }}</span>
      </div>

      <div v-if="searchable" :class="isStyled && 'ds-transfer-search-wrap'">
        <input
          v-model="leftSearch"
          :class="isStyled && 'ds-transfer-search'"
          type="text"
          placeholder="검색..."
        />
      </div>

      <div :class="isStyled && 'ds-transfer-panel-body'">
        <div
          v-for="item in filteredSource"
          :key="item.key"
          :class="[
            isStyled && 'ds-transfer-item',
            isStyled && leftChecked.has(item.key) && 'ds-transfer-item--checked',
            isStyled && item.disabled && 'ds-transfer-item--disabled'
          ]"
          @click="!item.disabled && toggleLeft(item.key)"
        >
          <input
            type="checkbox"
            :class="isStyled && 'ds-transfer-checkbox'"
            :checked="leftChecked.has(item.key)"
            :disabled="item.disabled"
            @change="toggleLeft(item.key)"
            @click.stop
          />
          <span :class="isStyled && 'ds-transfer-item-label'">{{ item.label }}</span>
        </div>
        <div v-if="filteredSource.length === 0" :class="isStyled && 'ds-transfer-empty'">
          {{ leftSearch ? '검색 결과가 없습니다' : '항목이 없습니다' }}
        </div>
      </div>
    </div>

    <!-- Transfer buttons -->
    <div :class="isStyled && 'ds-transfer-buttons'">
      <button
        type="button"
        :class="[
          isStyled && 'ds-transfer-btn',
          isStyled && !canMoveRight && 'ds-transfer-btn--disabled'
        ]"
        :disabled="!canMoveRight || disabled"
        @click="moveToRight"
        aria-label="오른쪽으로 이동"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </button>
      <button
        type="button"
        :class="[
          isStyled && 'ds-transfer-btn',
          isStyled && !canMoveLeft && 'ds-transfer-btn--disabled'
        ]"
        :disabled="!canMoveLeft || disabled"
        @click="moveToLeft"
        aria-label="왼쪽으로 이동"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 6 9 12 15 18" />
        </svg>
      </button>
    </div>

    <!-- Right panel: target -->
    <div :class="isStyled && 'ds-transfer-panel'">
      <div :class="isStyled && 'ds-transfer-panel-header'">
        <input
          type="checkbox"
          :class="isStyled && 'ds-transfer-checkbox'"
          :checked="rightAllChecked"
          :indeterminate="rightIndeterminate"
          :disabled="filteredTarget.length === 0"
          @change="toggleRightAll"
        />
        <span :class="isStyled && 'ds-transfer-panel-title'">{{ titles[1] }}</span>
        <span :class="isStyled && 'ds-transfer-panel-count'">{{ rightCheckedCount }}/{{ targetItems.length }}</span>
      </div>

      <div v-if="searchable" :class="isStyled && 'ds-transfer-search-wrap'">
        <input
          v-model="rightSearch"
          :class="isStyled && 'ds-transfer-search'"
          type="text"
          placeholder="검색..."
        />
      </div>

      <div :class="isStyled && 'ds-transfer-panel-body'">
        <div
          v-for="item in filteredTarget"
          :key="item.key"
          :class="[
            isStyled && 'ds-transfer-item',
            isStyled && rightChecked.has(item.key) && 'ds-transfer-item--checked',
            isStyled && item.disabled && 'ds-transfer-item--disabled'
          ]"
          @click="!item.disabled && toggleRight(item.key)"
        >
          <input
            type="checkbox"
            :class="isStyled && 'ds-transfer-checkbox'"
            :checked="rightChecked.has(item.key)"
            :disabled="item.disabled"
            @change="toggleRight(item.key)"
            @click.stop
          />
          <span :class="isStyled && 'ds-transfer-item-label'">{{ item.label }}</span>
        </div>
        <div v-if="filteredTarget.length === 0" :class="isStyled && 'ds-transfer-empty'">
          {{ rightSearch ? '검색 결과가 없습니다' : '항목이 없습니다' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@layer ds-base {
  .ds-transfer {
    display: flex;
    align-items: stretch;
    gap: var(--ds-spacing-4, 1rem);
    font-family: var(--ds-font-family, 'Inter', sans-serif);
    color: var(--ds-on-surface, #2a3439);
  }

  .ds-transfer--disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  /* Panel */
  .ds-transfer-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    border: var(--ds-ghost-border, 1px solid rgba(169, 180, 185, 0.2));
    background: var(--ds-surface-container-lowest, #fff);
    min-width: 0;
  }

  /* Panel header */
  .ds-transfer-panel-header {
    display: flex;
    align-items: center;
    gap: var(--ds-spacing-2, 0.5rem);
    padding: var(--ds-spacing-3, 0.75rem) var(--ds-spacing-4, 1rem);
    background: var(--ds-surface-container-low, #f0f4f7);
    border-bottom: var(--ds-ghost-border, 1px solid rgba(169, 180, 185, 0.2));
    flex-shrink: 0;
  }

  .ds-transfer-panel-title {
    flex: 1;
    font-size: var(--ds-font-size-sm, 0.875rem);
    font-weight: 500;
    color: var(--ds-on-surface, #2a3439);
  }

  .ds-transfer-panel-count {
    font-size: var(--ds-font-size-sm, 0.875rem);
    color: var(--ds-on-surface-variant, #6b7b82);
  }

  /* Search */
  .ds-transfer-search-wrap {
    padding: var(--ds-spacing-2, 0.5rem) var(--ds-spacing-3, 0.75rem);
    border-bottom: var(--ds-ghost-border, 1px solid rgba(169, 180, 185, 0.2));
    flex-shrink: 0;
  }

  .ds-transfer-search {
    width: 100%;
    box-sizing: border-box;
    padding: var(--ds-spacing-2, 0.5rem) 0;
    border: none;
    border-bottom: 1px solid var(--ds-outline, #8a979d);
    outline: none;
    font-family: var(--ds-font-family, 'Inter', sans-serif);
    font-size: var(--ds-font-size-sm, 0.875rem);
    color: var(--ds-on-surface, #2a3439);
    background: transparent;
    transition: border-bottom-color 0.15s;
  }

  .ds-transfer-search:focus {
    border-bottom: 2px solid var(--ds-primary, #5f5e5e);
  }

  /* Panel body */
  .ds-transfer-panel-body {
    flex: 1;
    overflow-y: auto;
    min-height: 160px;
    max-height: 320px;
  }

  /* Item */
  .ds-transfer-item {
    display: flex;
    align-items: center;
    gap: var(--ds-spacing-2, 0.5rem);
    padding: var(--ds-spacing-2, 0.5rem) var(--ds-spacing-4, 1rem);
    font-size: var(--ds-font-size-sm, 0.875rem);
    cursor: pointer;
    transition: background 0.1s;
    user-select: none;
  }

  .ds-transfer-item:hover:not(.ds-transfer-item--disabled) {
    background: var(--ds-surface-container-low, #f0f4f7);
  }

  .ds-transfer-item--checked {
    background: var(--ds-surface-container-high, #e4edf2);
  }

  .ds-transfer-item--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ds-transfer-item-label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Checkbox */
  .ds-transfer-checkbox {
    flex-shrink: 0;
    cursor: pointer;
    accent-color: var(--ds-primary, #5f5e5e);
    width: 14px;
    height: 14px;
  }

  /* Empty state */
  .ds-transfer-empty {
    padding: var(--ds-spacing-4, 1rem);
    text-align: center;
    color: var(--ds-on-surface-variant, #6b7b82);
    font-size: var(--ds-font-size-sm, 0.875rem);
  }

  /* Transfer buttons column */
  .ds-transfer-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--ds-spacing-2, 0.5rem);
    flex-shrink: 0;
  }

  .ds-transfer-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--ds-spacing-2, 0.5rem);
    background: transparent;
    border: var(--ds-ghost-border, 1px solid rgba(169, 180, 185, 0.2));
    border-radius: 0px;
    cursor: pointer;
    color: var(--ds-on-surface, #2a3439);
    transition: background 0.15s, opacity 0.15s;
  }

  .ds-transfer-btn:hover:not(:disabled) {
    background: var(--ds-surface-container-low, #f0f4f7);
  }

  .ds-transfer-btn:active:not(:disabled) {
    background: var(--ds-surface-container-high, #e4edf2);
  }

  .ds-transfer-btn svg {
    width: 16px;
    height: 16px;
  }

  .ds-transfer-btn--disabled,
  .ds-transfer-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
}
</style>
