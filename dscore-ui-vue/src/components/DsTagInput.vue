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
  let tags = [...(props.modelValue ?? [])]

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
  const tags = [...(props.modelValue ?? [])]
  tags.splice(index, 1)
  emit('update:modelValue', tags)
  emit('remove', tag)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addTag()
  } else if (e.key === 'Backspace' && inputValue.value === '') {
    const tags = [...(props.modelValue ?? [])]
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

  .ds-tag-input {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem;
    border: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    border-radius: 0.375rem;
    background: var(--ds-background, #fff);
    transition: border-color 150ms cubic-bezier(0.4,0,0.2,1),
                box-shadow 150ms cubic-bezier(0.4,0,0.2,1);
    min-height: 40px;
  }

  .ds-tag-input:focus-within {
    border-color: #a8a8a8;
    box-shadow: 0 0 0 3px rgba(168,168,168,0.5);
  }

  .ds-tag-input--disabled {
    opacity: 0.45;
    cursor: not-allowed;
    pointer-events: none;
  }

  .ds-tag-input__tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: var(--ds-accent, #e9ebef);
    padding: 2px 0.5rem;
    font-size: 0.75rem;
    font-family: var(--ds-font-family, inherit);
    border-radius: 0.375rem;
    color: var(--ds-accent-foreground, #030213);
    font-weight: 500;
    line-height: 1.4;
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
    padding: 1px;
    cursor: pointer;
    color: var(--ds-muted-foreground, #717182);
    opacity: 0.6;
    line-height: 1;
    transition: opacity 150ms cubic-bezier(0.4,0,0.2,1);
    margin-left: 1px;
  }

  .ds-tag-input__tag-remove:hover {
    opacity: 1;
    color: var(--ds-destructive, #d4183d);
  }

  .ds-tag-input__input {
    flex: 1;
    min-width: 80px;
    border: none;
    background: transparent;
    outline: none;
    font-family: var(--ds-font-family, inherit);
    font-size: 0.875rem;
    color: var(--ds-foreground, #1a1a1a);
    padding: 2px 0;
    line-height: 1.5;
  }

  .ds-tag-input__input::placeholder {
    color: var(--ds-muted-foreground, #717182);
    opacity: 0.7;
  }

  .ds-tag-input__input:disabled {
    cursor: not-allowed;
  }
</style>
