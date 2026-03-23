<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useDsConfig } from '../plugin'

interface Option {
  value: string | number
  label: string
  icon?: object
  description?: string
  disabled?: boolean
}

interface Props {
  modelValue?: string | number | null
  options?: Option[]
  placeholder?: string
  searchable?: boolean
  clearable?: boolean
  disabled?: boolean
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  options: () => [],
  placeholder: '선택하세요',
  searchable: false,
  clearable: false,
  disabled: false,
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
  'change': [value: string | number | null]
}>()

const config = useDsConfig()

const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const isOpen = ref(false)
const searchQuery = ref('')
const highlightedIndex = ref(-1)
const selectRef = ref<HTMLElement | null>(null)

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.options
  }
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(opt =>
    opt.label.toLowerCase().includes(query)
  )
})

const selectedOption = computed(() =>
  props.options.find(opt => opt.value === props.modelValue)
)

const displayValue = computed(() =>
  selectedOption.value?.label || ''
)

const ArrowIcon = computed(() => config.icons?.arrow)

const open = () => {
  if (props.disabled) return
  isOpen.value = true
  highlightedIndex.value = filteredOptions.value.findIndex(
    opt => opt.value === props.modelValue
  )
  if (highlightedIndex.value === -1) highlightedIndex.value = 0
}

const close = () => {
  isOpen.value = false
  searchQuery.value = ''
  highlightedIndex.value = -1
}

const toggle = () => {
  isOpen.value ? close() : open()
}

const select = (option: Option) => {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
  close()
}

const clear = (event: Event) => {
  event.stopPropagation()
  emit('update:modelValue', null)
  emit('change', null)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault()
      open()
    }
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(
        highlightedIndex.value + 1,
        filteredOptions.value.length - 1
      )
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
      break
    case 'Enter':
      event.preventDefault()
      {
        const option = filteredOptions.value[highlightedIndex.value]
        if (option) select(option)
      }
      break
    case 'Escape':
      event.preventDefault()
      close()
      break
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div
    ref="selectRef"
    :class="[
      isStyled && 'ds-select',
      isStyled && isOpen && 'ds-select--open',
      isStyled && disabled && 'ds-select--disabled',
      isStyled && clearable && modelValue != null && 'ds-select--clearable'
    ]"
    @keydown="handleKeydown"
  >
    <div
      :class="isStyled && 'ds-select-trigger'"
      tabindex="0"
      role="combobox"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <span v-if="selectedOption" :class="isStyled && 'ds-select-value'">
        {{ displayValue }}
      </span>
      <span v-else :class="isStyled && 'ds-select-placeholder'">
        {{ placeholder }}
      </span>

      <button
        v-if="clearable && modelValue != null"
        type="button"
        :class="isStyled && 'ds-select-clear'"
        @click="clear"
        aria-label="Clear"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <span :class="isStyled && 'ds-select-arrow'">
        <component v-if="ArrowIcon" :is="ArrowIcon" />
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>

    <Transition name="ds-select-dropdown">
      <div v-if="isOpen" :class="isStyled && 'ds-select-dropdown'">
        <input
          v-if="searchable"
          v-model="searchQuery"
          :class="isStyled && 'ds-select-search'"
          type="text"
          placeholder="검색..."
          @click.stop
        />

        <div :class="isStyled && 'ds-select-options'">
          <div
            v-for="(option, index) in filteredOptions"
            :key="option.value"
            :class="[
              isStyled && 'ds-select-option',
              isStyled && `ds-select-option-${option.value}`,
              isStyled && option.value === modelValue && 'ds-select-option--selected',
              isStyled && index === highlightedIndex && 'ds-select-option--highlighted',
              isStyled && option.disabled && 'ds-select-option--disabled'
            ]"
            @click="select(option)"
            @mouseenter="highlightedIndex = index"
          >
            <slot name="option" :option="option" :selected="option.value === modelValue" :highlighted="index === highlightedIndex">
              <component v-if="option.icon" :is="option.icon" :class="isStyled && 'ds-select-option-icon'" />
              <div :class="isStyled && 'ds-select-option-content'">
                <span :class="isStyled && 'ds-select-option-label'">{{ option.label }}</span>
                <span v-if="option.description" :class="isStyled && 'ds-select-option-description'">
                  {{ option.description }}
                </span>
              </div>
            </slot>
          </div>

          <div v-if="filteredOptions.length === 0" :class="isStyled && 'ds-select-empty'">
            검색 결과가 없습니다
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>

  .ds-select {
    position: relative;
    display: inline-block;
    font-family: var(--ds-font-family, inherit);
    font-size: var(--ds-font-size-sm, 0.875rem);
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-select--disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  /* Trigger — same styling as DsInput */
  .ds-select-trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    height: 2.25rem;
    padding: 0.25rem 0.75rem;
    border-radius: var(--ds-radius-md, 0.375rem);
    border: 1px solid var(--ds-border, rgba(0, 0, 0, 0.1));
    background: var(--ds-input-background, #f3f3f5);
    transition:
      box-shadow var(--ds-transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
    user-select: none;
    box-sizing: border-box;
  }

  .ds-select-trigger:focus {
    outline: none;
    border-color: var(--ds-ring, #a8a8a8);
    box-shadow: 0 0 0 3px var(--ds-ring-color, rgba(168, 168, 168, 0.5));
  }

  .ds-select--open .ds-select-trigger {
    border-color: var(--ds-ring, #a8a8a8);
    box-shadow: 0 0 0 3px var(--ds-ring-color, rgba(168, 168, 168, 0.5));
  }

  .ds-select-value {
    flex: 1;
    font-size: var(--ds-font-size-sm, 0.875rem);
  }

  .ds-select-placeholder {
    flex: 1;
    color: var(--ds-muted-foreground, #717182);
    font-size: var(--ds-font-size-sm, 0.875rem);
  }

  .ds-select-clear,
  .ds-select-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .ds-select-clear {
    background: none;
    border: none;
    padding: 2px;
    cursor: pointer;
    color: var(--ds-muted-foreground, #717182);
    transition: color var(--ds-transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
  }

  .ds-select-clear:hover {
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-select-clear svg,
  .ds-select-arrow svg {
    width: 14px;
    height: 14px;
  }

  .ds-select-arrow {
    transition: transform var(--ds-transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
    color: var(--ds-muted-foreground, #717182);
  }

  .ds-select--open .ds-select-arrow {
    transform: rotate(180deg);
  }

  /* Dropdown panel */
  .ds-select-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    z-index: 50;
    background: var(--ds-background, #fff);
    border: 1px solid var(--ds-border, rgba(0, 0, 0, 0.1));
    border-radius: var(--ds-radius-md, 0.375rem);
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -2px rgba(0, 0, 0, 0.1);
  }

  .ds-select-search {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: none;
    border-bottom: 1px solid var(--ds-border, rgba(0, 0, 0, 0.1));
    outline: none;
    font-family: var(--ds-font-family, inherit);
    font-size: var(--ds-font-size-sm, 0.875rem);
    color: var(--ds-foreground, #1a1a1a);
    background: transparent;
    box-sizing: border-box;
  }

  .ds-select-search::placeholder {
    color: var(--ds-muted-foreground, #717182);
  }

  .ds-select-options {
    max-height: 224px;
    overflow-y: auto;
    padding: 0.25rem 0;
  }

  .ds-select-options::-webkit-scrollbar {
    width: 4px;
  }
  .ds-select-options::-webkit-scrollbar-track {
    background: transparent;
  }
  .ds-select-options::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 2px;
  }

  .ds-select-option {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.5rem 0.375rem 2rem;
    cursor: pointer;
    font-size: var(--ds-font-size-sm, 0.875rem);
    transition: background var(--ds-transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
  }

  .ds-select-option--highlighted,
  .ds-select-option:hover {
    background: var(--ds-accent, #e9ebef);
  }

  /* Selected: checkmark placeholder via left padding — check icon via pseudo */
  .ds-select-option--selected {
    font-weight: 500;
  }

  .ds-select-option--selected::before {
    content: '';
    position: absolute;
    left: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 0.875rem;
    height: 0.875rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23030213' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: contain;
  }

  .ds-select-option--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .ds-select-option-content {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .ds-select-option-label {
    line-height: 1.4;
  }

  .ds-select-option-description {
    font-size: 0.75rem;
    color: var(--ds-muted-foreground, #717182);
    line-height: 1.4;
  }

  .ds-select-empty {
    padding: 1rem;
    text-align: center;
    color: var(--ds-muted-foreground, #717182);
    font-size: var(--ds-font-size-sm, 0.875rem);
  }

  .ds-select-dropdown-enter-active {
    transition:
      opacity var(--ds-transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1)),
      transform var(--ds-transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
  }

  .ds-select-dropdown-leave-active {
    transition:
      opacity 100ms cubic-bezier(0.4, 0, 0.2, 1),
      transform 100ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ds-select-dropdown-enter-from,
  .ds-select-dropdown-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }
</style>
