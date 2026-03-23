<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Tab {
  key: string | number
  label: string
  closable?: boolean
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
  'close': [key: string | number]
  'change': [value: string | number]
}>()

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const tabRefs = ref<HTMLButtonElement[]>([])

function selectTab(tab: Tab) {
  emit('update:modelValue', tab.key)
  emit('change', tab.key)
}

function closeTab(tab: Tab, event: MouseEvent) {
  event.stopPropagation()
  emit('close', tab.key)
}

function onKeydown(event: KeyboardEvent, index: number) {
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    const next = props.tabs[index + 1]
    if (next) {
      tabRefs.value[index + 1]?.focus()
      selectTab(next)
    }
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    const prev = props.tabs[index - 1]
    if (prev) {
      tabRefs.value[index - 1]?.focus()
      selectTab(prev)
    }
  } else if (event.key === 'Delete') {
    event.preventDefault()
    const tab = props.tabs[index]
    if (tab?.closable) {
      emit('close', tab.key)
    }
  }
}
</script>

<template>
  <div :class="isStyled && 'ds-menu-tabs'">
    <div :class="isStyled && 'ds-menu-tabs__list'" role="tablist">
      <button
        v-for="(tab, index) in tabs"
        :key="tab.key"
        :ref="el => { if (el) tabRefs[index] = el as HTMLButtonElement }"
        :class="[
          isStyled && 'ds-menu-tabs__tab',
          isStyled && tab.key === modelValue && 'ds-menu-tabs__tab--active'
        ]"
        role="tab"
        :aria-selected="tab.key === modelValue"
        :tabindex="tab.key === modelValue ? 0 : -1"
        @click="selectTab(tab)"
        @keydown="onKeydown($event, index)"
      >
        <span :class="isStyled && 'ds-menu-tabs__tab-label'">
          <slot :name="`tab-${tab.key}`">{{ tab.label }}</slot>
        </span>
        <span
          v-if="tab.closable"
          :class="isStyled && 'ds-menu-tabs__close'"
          role="button"
          :aria-label="`Close ${tab.label}`"
          @click="closeTab(tab, $event)"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="1" y1="1" x2="11" y2="11" />
            <line x1="11" y1="1" x2="1" y2="11" />
          </svg>
        </span>
      </button>
    </div>
  </div>
</template>

<style>
@layer ds-base {
  .ds-menu-tabs {
    display: flex;
    flex-direction: column;
  }

  .ds-menu-tabs__list {
    display: flex;
    overflow-x: auto;
    border-bottom: var(--ds-ghost-border-strong, 1px solid rgba(169, 180, 185, 0.4));
    scrollbar-width: none;
  }

  .ds-menu-tabs__list::-webkit-scrollbar {
    display: none;
  }

  .ds-menu-tabs__tab {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-spacing-2, 0.5rem);
    padding: var(--ds-spacing-2, 0.5rem) var(--ds-spacing-4, 1rem);
    border: none;
    border-right: var(--ds-ghost-border, 1px solid rgba(169, 180, 185, 0.2));
    border-bottom: 2px solid transparent;
    background: transparent;
    cursor: pointer;
    font-family: var(--ds-font-family);
    font-size: var(--ds-font-size-sm, 0.75rem);
    font-weight: 400;
    color: var(--ds-on-surface-variant, #6b7b82);
    border-radius: var(--ds-border-radius, 0px);
    white-space: nowrap;
    flex-shrink: 0;
    transition: background var(--ds-transition-fast, 150ms ease), color var(--ds-transition-fast, 150ms ease);
    margin-bottom: -1px;
    line-height: var(--ds-line-height-tight, 1.2);
  }

  .ds-menu-tabs__tab:hover:not(.ds-menu-tabs__tab--active) {
    background: var(--ds-surface-container-low, #f0f4f7);
    color: var(--ds-on-surface, #2a3439);
  }

  .ds-menu-tabs__tab--active {
    background: var(--ds-surface-container-lowest, #ffffff);
    border-bottom-color: var(--ds-primary, #5f5e5e);
    color: var(--ds-on-surface, #2a3439);
    font-weight: 500;
  }

  .ds-menu-tabs__tab-label {
    display: inline-flex;
    align-items: center;
  }

  .ds-menu-tabs__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    opacity: 0.5;
    border-radius: var(--ds-border-radius, 0px);
    transition: opacity var(--ds-transition-fast, 150ms ease);
    cursor: pointer;
  }

  .ds-menu-tabs__close:hover {
    opacity: 1;
  }
}
</style>
