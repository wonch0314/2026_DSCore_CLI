<script setup lang="ts">
import { ref, provide, reactive, computed, watch } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  model?: Record<string, any>
  initialData?: Record<string, any>
  warnOnLeave?: boolean
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  model: () => ({}),
  warnOnLeave: false,
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'submit': [data: Record<string, any>]
  'reset': []
  'validate': [isValid: boolean]
}>()

const config = useDsConfig()

const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const fields = ref<Map<string, { validate: () => boolean; reset: () => void }>>(new Map())
const isSubmitting = ref(false)

const initialDataSnapshot = ref<Record<string, any>>({})

// Track if form is dirty
const isDirty = computed(() => {
  if (!props.initialData && Object.keys(initialDataSnapshot.value).length === 0) return false
  const initial = props.initialData || initialDataSnapshot.value
  return JSON.stringify(props.model) !== JSON.stringify(initial)
})

// Warn before leave
if (props.warnOnLeave && typeof window !== 'undefined') {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirty.value) {
      e.preventDefault()
      e.returnValue = ''
    }
  }

  watch(() => props.warnOnLeave, (warn) => {
    if (warn) {
      window.addEventListener('beforeunload', handleBeforeUnload)
    } else {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, { immediate: true })
}

const registerField = (name: string, field: { validate: () => boolean; reset: () => void }) => {
  fields.value.set(name, field)
}

const unregisterField = (name: string) => {
  fields.value.delete(name)
}

const validate = async (): Promise<boolean> => {
  let isValid = true
  for (const [_, field] of fields.value) {
    const fieldValid = field.validate()
    if (!fieldValid) isValid = false
  }
  emit('validate', isValid)
  return isValid
}

const reset = () => {
  const initial = props.initialData || initialDataSnapshot.value
  Object.keys(props.model).forEach(key => {
    props.model[key] = initial[key] ?? ''
  })
  for (const [_, field] of fields.value) {
    field.reset()
  }
  emit('reset')
}

const handleSubmit = async (event: Event) => {
  event.preventDefault()

  const isValid = await validate()
  if (!isValid) return

  isSubmitting.value = true
  try {
    emit('submit', { ...props.model })
  } finally {
    isSubmitting.value = false
  }
}

// Snapshot initial data on mount
if (props.model && Object.keys(props.model).length > 0) {
  initialDataSnapshot.value = JSON.parse(JSON.stringify(props.model))
}

provide('ds-form', {
  registerField,
  unregisterField,
  model: props.model
})

defineExpose({
  validate,
  reset,
  isDirty,
  isSubmitting
})
</script>

<template>
  <form :class="isStyled && 'ds-form'" @submit="handleSubmit">
    <slot />
  </form>
</template>

<style>
@layer ds-base {
  .ds-form {
    display: flex;
    flex-direction: column;
    gap: var(--ds-spacing-4, 1rem);
    font-family: var(--ds-font-family, 'Inter', sans-serif);
    color: var(--ds-on-surface, #2a3439);
  }
}
</style>
