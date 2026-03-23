<script setup lang="ts">
import { ref, computed, watch, useAttrs, onMounted, onUnmounted } from 'vue'
import { useDsConfig } from '../plugin'

type ValidationRule = (value: string) => string | boolean

interface Props {
  modelValue?: string
  debounce?: number
  rules?: ValidationRule[]
  error?: string
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  debounce: undefined,
  rules: () => [],
  error: '',
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'validate': [isValid: boolean, error: string]
}>()

const attrs = useAttrs()
const config = useDsConfig()

const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const internalValue = ref(props.modelValue)
const internalError = ref('')
const debounceTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const effectiveDebounce = computed(() =>
  props.debounce ?? config.defaults?.input?.debounce ?? 0
)

const displayError = computed(() => props.error || internalError.value)
const hasError = computed(() => !!displayError.value)

const validate = (value: string): boolean => {
  for (const rule of props.rules) {
    const result = rule(value)
    if (typeof result === 'string') {
      internalError.value = result
      emit('validate', false, result)
      return false
    }
    if (result === false) {
      internalError.value = 'Invalid value'
      emit('validate', false, 'Invalid value')
      return false
    }
  }
  internalError.value = ''
  emit('validate', true, '')
  return true
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  internalValue.value = value

  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }

  if (effectiveDebounce.value > 0) {
    debounceTimer.value = setTimeout(() => {
      emit('update:modelValue', value)
      if (props.rules.length > 0) {
        validate(value)
      }
    }, effectiveDebounce.value)
  } else {
    emit('update:modelValue', value)
    if (props.rules.length > 0) {
      validate(value)
    }
  }
}

const handleBlur = () => {
  if (props.rules.length > 0) {
    validate(internalValue.value)
  }
}

watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue
})

onUnmounted(() => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
})

const inputRef = ref<HTMLInputElement | null>(null)

defineExpose({
  validate: () => validate(internalValue.value),
  focus: () => {
    inputRef.value?.focus()
  }
})
</script>

<template>
  <div :class="[isStyled && 'ds-input-wrapper', isStyled && hasError && 'ds-input-wrapper--error']">
    <input
      ref="inputRef"
      :class="isStyled && 'ds-input'"
      :value="internalValue"
      v-bind="attrs"
      @input="handleInput"
      @blur="handleBlur"
    />
    <span v-if="hasError" :class="isStyled && 'ds-input-error'">{{ displayError }}</span>
  </div>
</template>

<style>

  .ds-input-wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .ds-input {
    display: flex;
    height: 2.25rem;
    width: 100%;
    min-width: 0;
    border-radius: var(--ds-radius-md, 0.5rem);
    border: 1px solid var(--ds-border, rgba(0, 0, 0, 0.1));
    background-color: var(--ds-input-background, #f3f3f5);
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
    line-height: 1.5;
    box-sizing: border-box;
    font-family: var(--ds-font-family, inherit);
    color: var(--ds-foreground, #1a1a1a);
    outline: none;
    box-sizing: border-box;
    transition:
      color var(--ds-transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1)),
      box-shadow var(--ds-transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
  }

  .ds-input::placeholder {
    color: var(--ds-muted-foreground, #717182);
  }

  .ds-input:focus-visible {
    border-color: var(--ds-ring, #a8a8a8);
    box-shadow: 0 0 0 3px var(--ds-ring-color, rgba(168, 168, 168, 0.5));
  }

  .ds-input:disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* Error state */
  .ds-input-wrapper--error .ds-input,
  .ds-input--error,
  .ds-input[aria-invalid="true"] {
    border-color: var(--ds-destructive, #d4183d);
    box-shadow: 0 0 0 3px var(--ds-ring-destructive, rgba(212, 24, 61, 0.2));
  }

  .ds-input-error {
    font-size: var(--ds-font-size-sm, 0.875rem);
    color: var(--ds-destructive, #d4183d);
    margin-top: 0.25rem;
    animation: ds-error-in 200ms ease both;
  }

  @keyframes ds-error-in {
    from { opacity: 0; transform: translateY(-2px); }
    to   { opacity: 1; transform: translateY(0); }
  }
</style>
