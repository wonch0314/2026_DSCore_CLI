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
@layer ds-base {
  .ds-textarea {
    width: 100%;
    resize: none;
    display: block;
    padding: var(--ds-spacing-2, 0.5rem) 0;
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--ds-outline, #8a979d);
    border-radius: 0;
    outline: none;
    font-family: var(--ds-font-family, 'Inter', sans-serif);
    font-size: var(--ds-font-size-md, 0.9375rem);
    color: var(--ds-on-surface, #2a3439);
    line-height: var(--ds-line-height-normal, 1.5);
    transition: border-bottom-color 0.15s;
  }

  .ds-textarea::placeholder {
    color: var(--ds-on-surface-variant, #6b7b82);
    opacity: 0.6;
  }

  .ds-textarea:focus {
    border-bottom: 2px solid var(--ds-primary, #5f5e5e);
  }

  .ds-textarea:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
