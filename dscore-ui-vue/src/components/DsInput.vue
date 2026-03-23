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

defineExpose({
  validate: () => validate(internalValue.value),
  focus: () => {
    const input = document.querySelector('.ds-input') as HTMLInputElement
    input?.focus()
  }
})
</script>

<template>
  <div :class="[isStyled && 'ds-input-wrapper', isStyled && hasError && 'ds-input-wrapper--error']">
    <input
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
@layer ds-base {
  .ds-input-wrapper {
    display: flex;
    flex-direction: column;
  }

  .ds-input {
    width: 100%;
    padding: var(--ds-spacing-2, 0.5rem) 0;
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--ds-outline, #8a979d);
    border-radius: 0;
    outline: none;
    font-family: var(--ds-font-family, inherit);
    font-size: var(--ds-font-size-md, 0.875rem);
    color: var(--ds-on-surface, #2a3439);
    transition: border-color var(--ds-transition-normal, 250ms ease);
    box-sizing: border-box;
  }

  .ds-input:focus {
    border-bottom: 2px solid var(--ds-primary, #5f5e5e);
  }

  .ds-input::placeholder {
    color: var(--ds-on-surface-variant, #8a979d);
    opacity: 1;
  }

  .ds-input-wrapper--error .ds-input {
    border-bottom-color: var(--ds-error, #ef4444);
  }

  .ds-input-wrapper--error .ds-input:focus {
    border-bottom-color: var(--ds-error, #ef4444);
  }

  .ds-input-error {
    font-size: 0.75rem;
    color: var(--ds-error, #ef4444);
    margin-top: 0.25em;
    font-family: var(--ds-font-family, inherit);
  }
}
</style>
