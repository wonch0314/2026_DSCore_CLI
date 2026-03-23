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

  .ds-menu-tabs {
    display: flex;
    flex-direction: column;
  }

  .ds-menu-tabs__list {
    display: flex;
    overflow-x: auto;
    border-bottom: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    scrollbar-width: none;
  }

  .ds-menu-tabs__list::-webkit-scrollbar {
    display: none;
  }

  .ds-menu-tabs__tab {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-bottom: 2px solid transparent;
    background: transparent;
    cursor: pointer;
    font-family: var(--ds-font-family);
    font-size: 0.875rem;
    font-weight: 400;
    color: var(--ds-muted-foreground, #717182);
    border-radius: 0;
    white-space: nowrap;
    flex-shrink: 0;
    transition: background 150ms cubic-bezier(0.4,0,0.2,1), color 150ms cubic-bezier(0.4,0,0.2,1);
    margin-bottom: -1px;
    line-height: 1.2;
  }

  .ds-menu-tabs__tab:hover:not(.ds-menu-tabs__tab--active) {
    background: var(--ds-accent, #e9ebef);
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-menu-tabs__tab--active {
    border-bottom-color: var(--ds-primary, #030213);
    color: var(--ds-foreground, #1a1a1a);
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
    border-radius: 0.25rem;
    transition: opacity 150ms cubic-bezier(0.4,0,0.2,1);
    cursor: pointer;
  }

  .ds-menu-tabs__close:hover {
    opacity: 1;
  }
</style>
