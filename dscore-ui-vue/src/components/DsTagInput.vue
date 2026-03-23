<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  modelValue?: string[]
  placeholder?: string
  maxTags?: number
  disabled?: boolean
  allowDuplicate?: boolean
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  placeholder: '태그 입력',
  maxTags: Infinity,
  disabled: false,
  allowDuplicate: false,
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  add: [tag: string]
  remove: [tag: string]
}>()

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const inputValue = ref('')

const addTag = () => {
  const raw = inputValue.value.trim()
  if (!raw) return
  // Split by comma
  const parts = raw.split(',').map(s => s.trim()).filter(Boolean)
  let tags = [...props.modelValue]

  for (const part of parts) {
    if (tags.length >= props.maxTags) break
    if (!props.allowDuplicate && tags.includes(part)) continue
    tags = [...tags, part]
    emit('add', part)
  }

  emit('update:modelValue', tags)
  inputValue.value = ''
}

const removeTag = (tag: string, index: number) => {
  const tags = [...props.modelValue]
  tags.splice(index, 1)
  emit('update:modelValue', tags)
  emit('remove', tag)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addTag()
  } else if (e.key === 'Backspace' && inputValue.value === '') {
    const tags = [...props.modelValue]
    if (tags.length > 0) {
      const removed = tags.pop()!
      emit('update:modelValue', tags)
      emit('remove', removed)
    }
  }
}

const handleInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value
  // If ends with comma, trigger add
  if (val.endsWith(',')) {
    inputValue.value = val
    addTag()
  } else {
    inputValue.value = val
  }
}
</script>

<template>
  <div
    :class="[
      isStyled && 'ds-tag-input',
      isStyled && disabled && 'ds-tag-input--disabled'
    ]"
  >
    <span
      v-for="(tag, index) in modelValue"
      :key="index"
      :class="isStyled && 'ds-tag-input__tag'"
    >
      <span :class="isStyled && 'ds-tag-input__tag-label'">{{ tag }}</span>
      <button
        v-if="!disabled"
        type="button"
        :class="isStyled && 'ds-tag-input__tag-remove'"
        @click="removeTag(tag, index)"
        aria-label="태그 제거"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="10" height="10">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </span>
    <input
      v-if="!disabled || modelValue.length === 0"
      :class="isStyled && 'ds-tag-input__input'"
      :value="inputValue"
      :placeholder="modelValue.length === 0 ? placeholder : ''"
      :disabled="disabled || modelValue.length >= maxTags"
      @input="handleInput"
      @keydown="handleKeydown"
    />
  </div>
</template>

<style>
@layer ds-base {
  .ds-tag-input {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ds-spacing-1, 0.25rem);
    padding: var(--ds-spacing-2, 0.5rem) 0;
    border-bottom: 1px solid var(--ds-outline-variant, rgba(169, 180, 185, 0.4));
    transition: border-color var(--ds-transition-normal, 250ms ease);
  }

  .ds-tag-input:focus-within {
    border-bottom: 2px solid var(--ds-primary, #5f5e5e);
  }

  .ds-tag-input--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ds-tag-input__tag {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-spacing-1, 0.25rem);
    background: var(--ds-surface-container, rgba(169, 180, 185, 0.12));
    padding: var(--ds-spacing-1, 0.25rem) var(--ds-spacing-2, 0.5rem);
    font-size: var(--ds-font-size-sm, 0.75rem);
    font-family: var(--ds-font-family, inherit);
    border-radius: 0px;
    color: var(--ds-on-surface, inherit);
  }

  .ds-tag-input__tag-label {
    line-height: 1;
  }

  .ds-tag-input__tag-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: inherit;
    opacity: 0.5;
    line-height: 1;
    transition: opacity var(--ds-transition-normal, 250ms ease);
  }

  .ds-tag-input__tag-remove:hover {
    opacity: 1;
  }

  .ds-tag-input__input {
    flex: 1;
    min-width: 80px;
    border: none;
    background: transparent;
    outline: none;
    font-family: var(--ds-font-family, inherit);
    font-size: var(--ds-font-size-md, 0.875rem);
    color: var(--ds-on-surface, inherit);
    padding: 0;
  }

  .ds-tag-input__input::placeholder {
    color: var(--ds-on-surface-variant, rgba(100, 110, 115, 0.7));
  }

  .ds-tag-input__input:disabled {
    cursor: not-allowed;
  }
}
</style>
