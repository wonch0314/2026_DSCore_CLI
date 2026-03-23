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

  .ds-form-item {
    display: grid;
    gap: 0.5rem;
    font-family: var(--ds-font-family, inherit);
  }

  .ds-form-item-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1;
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-form-item-required {
    color: var(--ds-destructive, #d4183d);
    margin-left: 0.2em;
  }

  .ds-form-item-content {
    display: flex;
    flex-direction: column;
  }

  .ds-form-item-error {
    font-size: 0.875rem;
    color: var(--ds-destructive, #d4183d);
    animation: ds-form-error-in 200ms ease both;
  }

  @keyframes ds-form-error-in {
    from { opacity: 0; transform: translateY(-3px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ds-form-item--error .ds-form-item-label {
    color: var(--ds-destructive, #d4183d);
  }
</style>
