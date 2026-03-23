<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useDsConfig } from '../plugin'

export interface TreeNode {
  key: string | number
  label: string
  children?: TreeNode[]
  disabled?: boolean
}

interface Props {
  modelValue?: string | number | (string | number)[] | null
  data?: TreeNode[]
  mode?: 'select' | 'navigate'
  multiple?: boolean
  placeholder?: string
  searchable?: boolean
  disabled?: boolean
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  data: () => [],
  mode: 'select',
  multiple: false,
  placeholder: '선택하세요',
  searchable: false,
  disabled: false,
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | (string | number)[] | null]
  'node-click': [payload: { node: TreeNode }]
}>()

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const isOpen = ref(false)
const searchQuery = ref('')
const expandedKeys = ref<Set<string | number>>(new Set())
const containerRef = ref<HTMLElement | null>(null)

function flattenNodes(nodes: TreeNode[]): TreeNode[] {
  const result: TreeNode[] = []
  for (const node of nodes) {
    result.push(node)
    if (node.children) result.push(...flattenNodes(node.children))
  }
  return result
}

function getVisibleKeys(nodes: TreeNode[], query: string): Set<string | number> {
  const visible = new Set<string | number>()
  const lq = query.toLowerCase()

  function traverse(node: TreeNode, ancestors: (string | number)[]): boolean {
    const matches = node.label.toLowerCase().includes(lq)
    let childMatches = false
    if (node.children) {
      for (const child of node.children) {
        if (traverse(child, [...ancestors, node.key])) childMatches = true
      }
    }
    if (matches || childMatches) {
      visible.add(node.key)
      for (const k of ancestors) visible.add(k)
    }
    return matches || childMatches
  }

  for (const node of nodes) traverse(node, [])
  return visible
}

const visibleKeys = computed(() => {
  if (!props.searchable || !searchQuery.value) return null
  return getVisibleKeys(props.data, searchQuery.value)
})

watch(searchQuery, (q) => {
  if (q && visibleKeys.value) {
    for (const k of visibleKeys.value) expandedKeys.value.add(k)
  }
})

function isNodeVisible(node: TreeNode): boolean {
  if (!visibleKeys.value) return true
  return visibleKeys.value.has(node.key)
}

function isSelected(key: string | number): boolean {
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(key)
  }
  return props.modelValue === key
}

function displayLabel(key: string | number): string {
  return flattenNodes(props.data).find(n => n.key === key)?.label ?? ''
}

const displayValue = computed(() => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.map(k => displayLabel(k)).filter(Boolean).join(', ')
  }
  if (!props.multiple && props.modelValue != null) {
    return displayLabel(props.modelValue as string | number)
  }
  return ''
})

function toggleExpand(key: string | number) {
  if (expandedKeys.value.has(key)) {
    expandedKeys.value.delete(key)
  } else {
    expandedKeys.value.add(key)
  }
  // force reactivity
  expandedKeys.value = new Set(expandedKeys.value)
}

function selectNode(node: TreeNode) {
  if (node.disabled) return
  emit('node-click', { node })

  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const idx = current.indexOf(node.key)
    if (idx >= 0) current.splice(idx, 1)
    else current.push(node.key)
    emit('update:modelValue', current)
  } else {
    emit('update:modelValue', node.key)
    if (props.mode === 'select') close()
  }
}

function open() {
  if (props.disabled) return
  isOpen.value = true
}

function close() {
  isOpen.value = false
  searchQuery.value = ''
}

function toggle() {
  isOpen.value ? close() : open()
}

function handleClickOutside(event: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    close()
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div
    ref="containerRef"
    :class="[
      isStyled && 'ds-tree-select',
      isStyled && isOpen && 'ds-tree-select--open',
      isStyled && disabled && 'ds-tree-select--disabled',
      isStyled && mode === 'navigate' && 'ds-tree-select--navigate'
    ]"
  >
    <!-- Select mode trigger -->
    <div
      v-if="mode === 'select'"
      :class="isStyled && 'ds-tree-select-trigger'"
      tabindex="0"
      role="combobox"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <span v-if="displayValue" :class="isStyled && 'ds-tree-select-value'">{{ displayValue }}</span>
      <span v-else :class="isStyled && 'ds-tree-select-placeholder'">{{ placeholder }}</span>
      <span :class="isStyled && 'ds-tree-select-arrow'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>

    <!-- Select mode dropdown -->
    <Transition name="ds-tree-select-fade">
      <div v-if="mode === 'select' && isOpen" :class="isStyled && 'ds-tree-select-dropdown'">
        <input
          v-if="searchable"
          v-model="searchQuery"
          :class="isStyled && 'ds-tree-select-search'"
          type="text"
          placeholder="검색..."
          @click.stop
        />
        <div :class="isStyled && 'ds-tree-select-tree'">
          <DsTreeNodeList
            :nodes="data"
            :level="0"
            :expanded-keys="expandedKeys"
            :multiple="multiple"
            :model-value="modelValue"
            :is-node-visible="isNodeVisible"
            :is-styled="isStyled"
            @toggle-expand="toggleExpand"
            @select="selectNode"
          >
            <template #node="slotProps">
              <slot name="node" v-bind="slotProps" />
            </template>
          </DsTreeNodeList>
          <div v-if="data.length === 0 || (visibleKeys && visibleKeys.size === 0)" :class="isStyled && 'ds-tree-select-empty'">
            검색 결과가 없습니다
          </div>
        </div>
      </div>
    </Transition>

    <!-- Navigate mode inline tree -->
    <div v-if="mode === 'navigate'" :class="isStyled && 'ds-tree-select-inline'">
      <input
        v-if="searchable"
        v-model="searchQuery"
        :class="[isStyled && 'ds-tree-select-search', isStyled && 'ds-tree-select-search--inline']"
        type="text"
        placeholder="검색..."
      />
      <div :class="isStyled && 'ds-tree-select-tree'">
        <DsTreeNodeList
          :nodes="data"
          :level="0"
          :expanded-keys="expandedKeys"
          :multiple="multiple"
          :model-value="modelValue"
          :is-node-visible="isNodeVisible"
          :is-styled="isStyled"
          @toggle-expand="toggleExpand"
          @select="selectNode"
        >
          <template #node="slotProps">
            <slot name="node" v-bind="slotProps" />
          </template>
        </DsTreeNodeList>
        <div v-if="data.length === 0 || (visibleKeys && visibleKeys.size === 0)" :class="isStyled && 'ds-tree-select-empty'">
          검색 결과가 없습니다
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// Recursive tree node list — defined as options API component so it can self-reference
import { defineComponent, PropType, h, resolveComponent } from 'vue'

interface TreeNodeDef {
  key: string | number
  label: string
  children?: TreeNodeDef[]
  disabled?: boolean
}

export const DsTreeNodeList = defineComponent({
  name: 'DsTreeNodeList',
  props: {
    nodes: { type: Array as PropType<TreeNodeDef[]>, required: true },
    level: { type: Number, default: 0 },
    expandedKeys: { type: Object as PropType<Set<string | number>>, required: true },
    multiple: { type: Boolean, default: false },
    modelValue: { type: [String, Number, Array, null] as PropType<string | number | (string | number)[] | null>, default: null },
    isNodeVisible: { type: Function as PropType<(node: TreeNodeDef) => boolean>, required: true },
    isStyled: { type: Boolean, default: true }
  },
  emits: ['toggle-expand', 'select'],
  setup(props, { emit, slots }) {
    function isSelected(key: string | number): boolean {
      const mv = props.modelValue
      if (props.multiple) return Array.isArray(mv) && mv.includes(key)
      return mv === key
    }

    return () => {
      const Self = resolveComponent('DsTreeNodeList') as any
      const visibleNodes = props.nodes.filter(n => props.isNodeVisible(n))

      return h('div', { class: props.isStyled ? 'ds-tree-node-list' : undefined },
        visibleNodes.map(node => {
          const hasChildren = !!(node.children && node.children.length > 0)
          const isExpanded = props.expandedKeys.has(node.key)
          const selected = isSelected(node.key)

          const nodeRow = h('div', {
            class: props.isStyled ? [
              'ds-tree-node',
              {
                'ds-tree-node--selected': selected,
                'ds-tree-node--disabled': node.disabled
              }
            ] : undefined,
            style: { paddingLeft: `calc(${props.level * 20}px + var(--ds-spacing-3, 0.75rem))` },
            onClick: () => {
              if (node.disabled) return
              if (hasChildren) emit('toggle-expand', node.key)
              emit('select', node)
            }
          }, slots.node
            ? [slots.node({ node, level: props.level, isExpanded, isSelected: selected })]
            : [
                // Arrow
                h('span', {
                  class: props.isStyled ? ['ds-tree-node-arrow', { 'ds-tree-node-arrow--expanded': isExpanded }] : undefined,
                  style: { visibility: hasChildren ? 'visible' : 'hidden' },
                  onClick: (e: MouseEvent) => {
                    e.stopPropagation()
                    if (hasChildren) emit('toggle-expand', node.key)
                  }
                }, [
                  h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
                    h('polyline', { points: '9 6 15 12 9 18' })
                  ])
                ]),
                // Checkbox
                props.multiple ? h('input', {
                  type: 'checkbox',
                  class: props.isStyled ? 'ds-tree-node-checkbox' : undefined,
                  checked: selected,
                  disabled: node.disabled,
                  onClick: (e: MouseEvent) => e.stopPropagation(),
                  onChange: () => emit('select', node)
                }) : null,
                // Label
                h('span', { class: props.isStyled ? 'ds-tree-node-label' : undefined }, node.label)
              ]
          )

          const children = hasChildren && isExpanded
            ? h(Self, {
                nodes: node.children,
                level: props.level + 1,
                expandedKeys: props.expandedKeys,
                multiple: props.multiple,
                modelValue: props.modelValue,
                isNodeVisible: props.isNodeVisible,
                isStyled: props.isStyled,
                onToggleExpand: (key: string | number) => emit('toggle-expand', key),
                onSelect: (n: TreeNodeDef) => emit('select', n)
              }, slots)
            : null

          return h('div', { key: node.key, class: props.isStyled ? 'ds-tree-node-wrapper' : undefined }, [nodeRow, children])
        })
      )
    }
  }
})
</script>

<style>
@layer ds-base {
  .ds-tree-select {
    position: relative;
    display: inline-block;
    font-family: var(--ds-font-family, 'Inter', sans-serif);
    font-size: var(--ds-font-size-sm, 0.875rem);
    color: var(--ds-on-surface, #2a3439);
  }

  .ds-tree-select--navigate {
    display: block;
  }

  .ds-tree-select--disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  /* Trigger */
  .ds-tree-select-trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: var(--ds-spacing-2, 0.5rem) 0;
    border-bottom: 1px solid var(--ds-outline, #8a979d);
    transition: border-bottom-color 0.15s;
  }

  .ds-tree-select--open .ds-tree-select-trigger {
    border-bottom: 2px solid var(--ds-primary, #5f5e5e);
  }

  .ds-tree-select-value {
    flex: 1;
    font-size: var(--ds-font-size-sm, 0.875rem);
  }

  .ds-tree-select-placeholder {
    flex: 1;
    color: var(--ds-on-surface-variant, #6b7b82);
    opacity: 0.6;
    font-size: var(--ds-font-size-sm, 0.875rem);
  }

  .ds-tree-select-arrow {
    display: flex;
    align-items: center;
    color: var(--ds-on-surface-variant, #6b7b82);
    transition: transform 0.2s;
  }

  .ds-tree-select-arrow svg {
    width: 16px;
    height: 16px;
  }

  .ds-tree-select--open .ds-tree-select-arrow {
    transform: rotate(180deg);
  }

  /* Dropdown */
  .ds-tree-select-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 100;
    background: var(--ds-surface-container-lowest, #fff);
    border: var(--ds-ghost-border, 1px solid rgba(169, 180, 185, 0.2));
    border-radius: 0px;
    margin-top: 4px;
    box-shadow: var(--ds-shadow-ambient, 0 2px 8px rgba(42, 52, 57, 0.08));
    min-width: 200px;
  }

  /* Inline navigate */
  .ds-tree-select-inline {
    background: var(--ds-surface-container-lowest, #fff);
    border: var(--ds-ghost-border, 1px solid rgba(169, 180, 185, 0.2));
    box-shadow: var(--ds-shadow-ambient, 0 2px 8px rgba(42, 52, 57, 0.08));
  }

  /* Search */
  .ds-tree-select-search {
    width: 100%;
    box-sizing: border-box;
    padding: var(--ds-spacing-2, 0.5rem);
    border: none;
    border-bottom: 1px solid var(--ds-outline, rgba(169, 180, 185, 0.4));
    outline: none;
    font-family: var(--ds-font-family, 'Inter', sans-serif);
    font-size: var(--ds-font-size-sm, 0.875rem);
    color: var(--ds-on-surface, #2a3439);
    background: transparent;
  }

  .ds-tree-select-search:focus {
    border-bottom: 2px solid var(--ds-primary, #5f5e5e);
  }

  .ds-tree-select-search--inline {
    padding: var(--ds-spacing-2, 0.5rem) var(--ds-spacing-3, 0.75rem);
  }

  /* Tree container */
  .ds-tree-select-tree {
    max-height: 280px;
    overflow-y: auto;
  }

  /* Node */
  .ds-tree-node-list {
    display: flex;
    flex-direction: column;
  }

  .ds-tree-node-wrapper {
    display: flex;
    flex-direction: column;
  }

  .ds-tree-node {
    display: flex;
    align-items: center;
    gap: var(--ds-spacing-2, 0.5rem);
    padding: var(--ds-spacing-2, 0.5rem) var(--ds-spacing-3, 0.75rem);
    padding-right: var(--ds-spacing-3, 0.75rem);
    cursor: pointer;
    transition: background 0.1s;
    font-size: var(--ds-font-size-sm, 0.875rem);
  }

  .ds-tree-node:hover:not(.ds-tree-node--disabled) {
    background: var(--ds-surface-container-low, #f0f4f7);
  }

  .ds-tree-node--selected {
    background: var(--ds-surface-container-highest, #d9e4ea);
  }

  .ds-tree-node--selected .ds-tree-node-label {
    color: var(--ds-primary, #5f5e5e);
    font-weight: 500;
  }

  .ds-tree-node--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Arrow */
  .ds-tree-node-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    color: var(--ds-on-surface-variant, #6b7b82);
    transition: transform 0.2s;
    cursor: pointer;
  }

  .ds-tree-node-arrow svg {
    width: 12px;
    height: 12px;
  }

  .ds-tree-node-arrow--expanded {
    transform: rotate(90deg);
  }

  /* Checkbox */
  .ds-tree-node-checkbox {
    flex-shrink: 0;
    cursor: pointer;
    accent-color: var(--ds-primary, #5f5e5e);
    width: 14px;
    height: 14px;
  }

  /* Label */
  .ds-tree-node-label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Empty */
  .ds-tree-select-empty {
    padding: var(--ds-spacing-3, 0.75rem) var(--ds-spacing-4, 1rem);
    text-align: center;
    color: var(--ds-on-surface-variant, #6b7b82);
    font-size: var(--ds-font-size-sm, 0.875rem);
  }

  /* Fade transition */
  .ds-tree-select-fade-enter-active,
  .ds-tree-select-fade-leave-active {
    transition: opacity 0.15s, transform 0.15s;
  }

  .ds-tree-select-fade-enter-from,
  .ds-tree-select-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }
}
</style>
