<script setup lang="ts">
import { computed, inject, provide, ref } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  label?: string
  required?: boolean
  error?: string
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  required: false,
  error: '',
  applyDefaultStyle: undefined
})

const config = useDsConfig()

const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const formContext = inject<{ registerField?: (field: any) => void } | null>('ds-form', null)
const internalError = ref('')

const displayError = computed(() => props.error || internalError.value)
const hasError = computed(() => !!displayError.value)

const setError = (error: string) => {
  internalError.value = error
}

const clearError = () => {
  internalError.value = ''
}

provide('ds-form-item', {
  setError,
  clearError,
  hasError
})

defineExpose({ setError, clearError, hasError })
</script>

<template>
  <div
    :class="[
      isStyled && 'ds-form-item',
      isStyled && hasError && 'ds-form-item--error',
      isStyled && required && 'ds-form-item--required'
    ]"
  >
    <label v-if="label" :class="isStyled && 'ds-form-item-label'">
      {{ label }}
      <span v-if="required" :class="isStyled && 'ds-form-item-required'">*</span>
    </label>
    <div :class="isStyled && 'ds-form-item-content'">
      <slot />
    </div>
    <span v-if="hasError" :class="isStyled && 'ds-form-item-error'">
      {{ displayError }}
    </span>
  </div>
</template>

<style>
@layer ds-base {
  .ds-form-item {
    display: flex;
    flex-direction: column;
    gap: var(--ds-spacing-1, 0.25rem);
    margin-bottom: var(--ds-spacing-4, 1rem);
    font-family: var(--ds-font-family, 'Inter', sans-serif);
  }

  .ds-form-item-label {
    font-size: var(--ds-font-size-xs, 0.75rem);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: var(--ds-letter-spacing-wide, 0.05em);
    color: var(--ds-on-surface-variant, #6b7b82);
  }

  .ds-form-item-required {
    color: var(--ds-error, #9f403d);
    margin-left: 0.25rem;
  }

  .ds-form-item-content {
    display: flex;
    flex-direction: column;
  }

  .ds-form-item-error {
    font-size: var(--ds-font-size-sm, 0.875rem);
    color: var(--ds-error, #9f403d);
    margin-top: var(--ds-spacing-1, 0.25rem);
  }

  .ds-form-item--error .ds-form-item-label {
    color: var(--ds-error, #9f403d);
  }
}
</style>
