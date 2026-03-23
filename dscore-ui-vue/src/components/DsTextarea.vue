<script setup lang="ts">
import { ref, computed, watch, onMounted, useAttrs } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  modelValue?: string
  autoResize?: boolean
  minRows?: number
  maxRows?: number
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  autoResize: true,
  minRows: 3,
  maxRows: 10,
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const attrs = useAttrs()
const config = useDsConfig()

const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const textareaRef = ref<HTMLTextAreaElement | null>(null)

const adjustHeight = () => {
  if (!textareaRef.value || !props.autoResize) return

  const textarea = textareaRef.value
  const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20
  const minHeight = lineHeight * props.minRows
  const maxHeight = lineHeight * props.maxRows

  textarea.style.height = 'auto'
  const scrollHeight = textarea.scrollHeight

  if (scrollHeight < minHeight) {
    textarea.style.height = `${minHeight}px`
  } else if (scrollHeight > maxHeight) {
    textarea.style.height = `${maxHeight}px`
    textarea.style.overflowY = 'auto'
  } else {
    textarea.style.height = `${scrollHeight}px`
    textarea.style.overflowY = 'hidden'
  }
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  adjustHeight()
}

watch(() => props.modelValue, () => {
  setTimeout(adjustHeight, 0)
})

onMounted(() => {
  adjustHeight()
})

defineExpose({
  focus: () => textareaRef.value?.focus(),
  blur: () => textareaRef.value?.blur()
})
</script>

<template>
  <textarea
    ref="textareaRef"
    :class="isStyled && 'ds-textarea'"
    :value="modelValue"
    v-bind="attrs"
    @input="handleInput"
  />
</template>

<style>

  .ds-textarea {
    width: 100%;
    min-width: 0;
    min-height: 4rem;
    resize: none;
    display: block;
    border-radius: var(--ds-radius-md, 0.375rem);
    border: 1px solid var(--ds-border, rgba(0, 0, 0, 0.1));
    background: var(--ds-input-background, #f3f3f5);
    padding: 0.5rem 0.75rem;
    font-size: var(--ds-font-size-sm, 0.875rem);
    font-family: var(--ds-font-family, inherit);
    color: var(--ds-foreground, #1a1a1a);
    line-height: 1.5;
    outline: none;
    box-sizing: border-box;
    transition:
      color var(--ds-transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1)),
      box-shadow var(--ds-transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
  }

  .ds-textarea::placeholder {
    color: var(--ds-muted-foreground, #717182);
  }

  .ds-textarea:focus-visible {
    border-color: var(--ds-ring, #a8a8a8);
    box-shadow: 0 0 0 3px var(--ds-ring-color, rgba(168, 168, 168, 0.5));
  }

  .ds-textarea:disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.5;
  }

  .ds-textarea--error,
  .ds-textarea[aria-invalid="true"] {
    border-color: var(--ds-destructive, #d4183d);
    box-shadow: 0 0 0 3px var(--ds-ring-destructive, rgba(212, 24, 61, 0.2));
  }
</style>
