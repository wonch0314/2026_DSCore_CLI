<script setup lang="ts">
import { computed, provide } from 'vue'
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
  modelValue: computed(() => props.modelValue),
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
@layer ds-base {
  .ds-radio-group {
    display: flex;
  }

  .ds-radio-group--vertical {
    flex-direction: column;
    gap: 0.5rem;
  }

  .ds-radio-group--horizontal {
    flex-direction: row;
    gap: 1rem;
  }
}
</style>
