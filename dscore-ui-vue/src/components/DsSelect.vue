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
      if (highlightedIndex.value >= 0) {
        select(filteredOptions.value[highlightedIndex.value])
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
@layer ds-base {
  .ds-select {
    position: relative;
    display: inline-block;
    font-family: var(--ds-font-family, 'Inter', sans-serif);
    font-size: var(--ds-font-size-md, 0.9375rem);
    color: var(--ds-on-surface, #2a3439);
  }

  .ds-select--disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  .ds-select-trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: var(--ds-spacing-2, 0.5rem) 0;
    border-bottom: 1px solid var(--ds-outline, #8a979d);
    transition: border-bottom-color 0.15s;
  }

  .ds-select-trigger:focus {
    outline: none;
    border-bottom: 2px solid var(--ds-primary, #5f5e5e);
  }

  .ds-select--open .ds-select-trigger {
    border-bottom: 2px solid var(--ds-primary, #5f5e5e);
  }

  .ds-select-value {
    flex: 1;
  }

  .ds-select-placeholder {
    flex: 1;
    color: var(--ds-on-surface-variant, #6b7b82);
    opacity: 0.6;
  }

  .ds-select-clear,
  .ds-select-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ds-select-clear {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--ds-on-surface-variant, #6b7b82);
  }

  .ds-select-clear svg,
  .ds-select-arrow svg {
    width: 16px;
    height: 16px;
  }

  .ds-select-arrow {
    transition: transform 0.2s;
    color: var(--ds-on-surface-variant, #6b7b82);
  }

  .ds-select--open .ds-select-arrow {
    transform: rotate(180deg);
  }

  .ds-select-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 100;
    background: var(--ds-surface-container-lowest, #fff);
    border: 1px solid rgba(169, 180, 185, 0.2);
    border-radius: var(--ds-border-radius, 0px);
    margin-top: 4px;
    box-shadow: var(--ds-shadow-ambient, 0 2px 8px rgba(42, 52, 57, 0.08));
  }

  .ds-select-search {
    width: 100%;
    padding: var(--ds-spacing-2, 0.5rem);
    border: none;
    border-bottom: 1px solid rgba(169, 180, 185, 0.2);
    outline: none;
    font-family: var(--ds-font-family, 'Inter', sans-serif);
    font-size: var(--ds-font-size-md, 0.9375rem);
    color: var(--ds-on-surface, #2a3439);
    background: transparent;
  }

  .ds-select-options {
    max-height: 200px;
    overflow-y: auto;
  }

  .ds-select-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: var(--ds-spacing-2, 0.5rem) var(--ds-spacing-3, 0.75rem);
    cursor: pointer;
    transition: background 0.1s;
  }

  .ds-select-option--highlighted {
    background-color: var(--ds-surface-container-low, #f0f4f7);
  }

  .ds-select-option--selected {
    background-color: var(--ds-surface-container-highest, #d9e4ea);
  }

  .ds-select-option--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ds-select-option-content {
    display: flex;
    flex-direction: column;
  }

  .ds-select-option-description {
    font-size: var(--ds-font-size-sm, 0.875rem);
    opacity: 0.7;
    color: var(--ds-on-surface-variant, #6b7b82);
  }

  .ds-select-empty {
    padding: 1rem;
    text-align: center;
    color: var(--ds-on-surface-variant, #6b7b82);
    font-size: var(--ds-font-size-sm, 0.875rem);
  }

  /* Transitions */
  .ds-select-dropdown-enter-active,
  .ds-select-dropdown-leave-active {
    transition: opacity 0.15s, transform 0.15s;
  }

  .ds-select-dropdown-enter-from,
  .ds-select-dropdown-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }
}
</style>
