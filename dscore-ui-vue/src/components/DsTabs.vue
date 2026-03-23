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
@layer ds-base {
  .ds-tabs {
    display: flex;
    flex-direction: column;
  }

  .ds-tabs__list {
    display: flex;
    border-bottom: var(--ds-ghost-border-strong, 1px solid rgba(169, 180, 185, 0.4));
  }

  .ds-tabs__tab {
    padding: var(--ds-spacing-3, 0.75rem) var(--ds-spacing-4, 1rem);
    border: none;
    border-bottom: 2px solid transparent;
    background: transparent;
    cursor: pointer;
    font-family: var(--ds-font-family);
    font-size: var(--ds-font-size-sm, 0.75rem);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: var(--ds-letter-spacing-wide, 0.05em);
    color: var(--ds-on-surface-variant, #6b7b82);
    border-radius: var(--ds-border-radius, 0px);
    transition: background var(--ds-transition-fast, 150ms ease), color var(--ds-transition-fast, 150ms ease);
    margin-bottom: -1px;
    line-height: var(--ds-line-height-tight, 1.2);
  }

  .ds-tabs__tab:hover:not(:disabled):not(.ds-tabs__tab--active) {
    background: var(--ds-surface-container-low, #f0f4f7);
    color: var(--ds-on-surface, #2a3439);
  }

  .ds-tabs__tab--active {
    border-bottom-color: var(--ds-primary, #5f5e5e);
    color: var(--ds-on-surface, #2a3439);
  }

  .ds-tabs__tab--disabled,
  .ds-tabs__tab:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .ds-tabs__panel {
    padding: var(--ds-spacing-4, 1rem) 0;
  }

  .ds-tabs__panel[hidden] {
    display: none;
  }
}
</style>
