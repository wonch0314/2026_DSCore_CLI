<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Tab {
  key: string | number
  label: string
  disabled?: boolean
}

interface Props {
  modelValue: string | number
  tabs: Tab[]
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'change': [value: string | number]
}>()

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const tabRefs = ref<HTMLButtonElement[]>([])

const activeIndex = computed(() =>
  props.tabs.findIndex(t => t.key === props.modelValue)
)

function selectTab(tab: Tab) {
  if (tab.disabled) return
  emit('update:modelValue', tab.key)
  emit('change', tab.key)
}

function onKeydown(event: KeyboardEvent, index: number) {
  const enabledTabs = props.tabs
    .map((t, i) => ({ tab: t, index: i }))
    .filter(({ tab }) => !tab.disabled)

  const currentEnabledIndex = enabledTabs.findIndex(({ index: i }) => i === index)

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    const next = enabledTabs[(currentEnabledIndex + 1) % enabledTabs.length]
    if (next) {
      tabRefs.value[next.index]?.focus()
      selectTab(props.tabs[next.index])
    }
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    const prev = enabledTabs[(currentEnabledIndex - 1 + enabledTabs.length) % enabledTabs.length]
    if (prev) {
      tabRefs.value[prev.index]?.focus()
      selectTab(props.tabs[prev.index])
    }
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    selectTab(props.tabs[index])
  }
}
</script>

<template>
  <div :class="isStyled && 'ds-tabs'">
    <div :class="isStyled && 'ds-tabs__list'" role="tablist">
      <button
        v-for="(tab, index) in tabs"
        :key="tab.key"
        :ref="el => { if (el) tabRefs[index] = el as HTMLButtonElement }"
        :class="[
          isStyled && 'ds-tabs__tab',
          isStyled && tab.key === modelValue && 'ds-tabs__tab--active',
          isStyled && tab.disabled && 'ds-tabs__tab--disabled'
        ]"
        role="tab"
        :aria-selected="tab.key === modelValue"
        :aria-disabled="tab.disabled"
        :disabled="tab.disabled"
        :tabindex="tab.key === modelValue ? 0 : -1"
        @click="selectTab(tab)"
        @keydown="onKeydown($event, index)"
      >
        <slot :name="`tab-${tab.key}`">{{ tab.label }}</slot>
      </button>
    </div>

    <div
      v-for="tab in tabs"
      :key="tab.key"
      :class="isStyled && 'ds-tabs__panel'"
      role="tabpanel"
      :hidden="tab.key !== modelValue"
    >
      <slot :name="`panel-${tab.key}`" />
    </div>
  </div>
</template>

<style>

  .ds-tabs {
    display: flex;
    flex-direction: column;
  }

  .ds-tabs__list {
    display: inline-flex;
    align-items: center;
    background: var(--ds-muted, #ececf0);
    border-radius: 0.75rem;
    padding: 3px;
    height: 2.25rem;
    gap: 2px;
  }

  .ds-tabs__tab {
    padding: 0.25rem 0.5rem;
    border: none;
    background: transparent;
    cursor: pointer;
    font-family: var(--ds-font-family);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--ds-muted-foreground, #717182);
    border-radius: 0.75rem;
    transition: background 150ms cubic-bezier(0.4,0,0.2,1), color 150ms cubic-bezier(0.4,0,0.2,1);
    line-height: 1.2;
    white-space: nowrap;
    height: 100%;
    display: inline-flex;
    align-items: center;
  }

  .ds-tabs__tab:hover:not(:disabled):not(.ds-tabs__tab--active) {
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-tabs__tab--active {
    background: var(--ds-card, #fff);
    color: var(--ds-foreground, #1a1a1a);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .ds-tabs__tab--disabled,
  .ds-tabs__tab:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .ds-tabs__panel {
    padding: 1rem 0;
  }

  .ds-tabs__panel[hidden] {
    display: none;
  }
</style>
