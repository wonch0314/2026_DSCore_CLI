<script setup lang="ts">
import { provide } from 'vue'
import DsRadio from './DsRadio.vue'
import { useDsConfig } from '../plugin'

interface Option {
  value: string | number | boolean
  label: string
  disabled?: boolean
}

interface Props {
  modelValue?: string | number | boolean
  options?: Option[]
  direction?: 'horizontal' | 'vertical'
  disabled?: boolean
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  direction: 'vertical',
  disabled: false,
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
  'change': [value: string | number | boolean]
}>()

const config = useDsConfig()

const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const updateValue = (value: string | number | boolean) => {
  emit('update:modelValue', value)
  emit('change', value)
}

provide('ds-radio-group', {
  get modelValue() { return props.modelValue },
  updateValue
})
</script>

<template>
  <div
    :class="[isStyled && 'ds-radio-group', isStyled && `ds-radio-group--${direction}`]"
    role="radiogroup"
  >
    <slot>
      <DsRadio
        v-for="option in options"
        :key="String(option.value)"
        :value="option.value"
        :disabled="disabled || option.disabled"
      >
        {{ option.label }}
      </DsRadio>
    </slot>
  </div>
</template>

<style>

  .ds-radio-group {
    display: grid;
    gap: 0.75rem;
  }

  .ds-radio-group--vertical {
    grid-auto-flow: row;
  }

  .ds-radio-group--horizontal {
    grid-auto-flow: column;
    grid-auto-columns: max-content;
  }
</style>
