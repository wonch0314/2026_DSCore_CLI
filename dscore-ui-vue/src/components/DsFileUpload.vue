<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  modelValue?: File[]
  accept?: string
  multiple?: boolean
  maxSize?: number
  maxFiles?: number
  disabled?: boolean
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  accept: '',
  multiple: false,
  maxSize: Infinity,
  maxFiles: Infinity,
  disabled: false,
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: File[]]
  error: [payload: { file: File; reason: string }]
}>()

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const isAccepted = (file: File): boolean => {
  if (!props.accept) return true
  const acceptTypes = props.accept.split(',').map(s => s.trim())
  return acceptTypes.some(type => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase())
    }
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.slice(0, -1))
    }
    return file.type === type
  })
}

const processFiles = (incoming: File[]) => {
  const current = [...(props.modelValue ?? [])]
  const added: File[] = []

  for (const file of incoming) {
    if (current.length + added.length >= props.maxFiles) {
      emit('error', { file, reason: 'maxFiles' })
      continue
    }
    if (!isAccepted(file)) {
      emit('error', { file, reason: 'accept' })
      continue
    }
    if (file.size > props.maxSize) {
      emit('error', { file, reason: 'maxSize' })
      continue
    }
    added.push(file)
  }

  if (added.length > 0) {
    emit('update:modelValue', props.multiple ? [...current, ...added] : [added[0]])
  }
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  if (props.disabled) return
  const files = Array.from(e.dataTransfer?.files ?? [])
  if (files.length) processFiles(files)
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  if (!props.disabled) isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleClick = () => {
  if (props.disabled) return
  fileInputRef.value?.click()
}

const handleInputChange = (e: Event) => {
  const files = Array.from((e.target as HTMLInputElement).files ?? [])
  if (files.length) processFiles(files)
  // Reset so same file can be re-selected
  if (fileInputRef.value) fileInputRef.value.value = ''
}

const removeFile = (index: number) => {
  const files = [...(props.modelValue ?? [])]
  files.splice(index, 1)
  emit('update:modelValue', files)
}
</script>

<template>
  <div
    :class="[
      isStyled && 'ds-file-upload',
      isStyled && disabled && 'ds-file-upload--disabled'
    ]"
  >
    <!-- Hidden file input -->
    <input
      ref="fileInputRef"
      type="file"
      :class="isStyled && 'ds-file-upload__input'"
      :accept="accept || undefined"
      :multiple="multiple"
      :disabled="disabled"
      @change="handleInputChange"
    />

    <!-- Drop zone -->
    <div
      :class="[
        isStyled && 'ds-file-upload__zone',
        isStyled && isDragging && 'ds-file-upload__zone--drag-over'
      ]"
      @click="handleClick"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
    >
      <slot>
        <div :class="isStyled && 'ds-file-upload__zone-content'">
          <svg :class="isStyled && 'ds-file-upload__icon'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p :class="isStyled && 'ds-file-upload__zone-text'">파일을 드래그하거나 클릭하여 업로드</p>
          <p :class="isStyled && 'ds-file-upload__zone-hint'">
            <template v-if="accept">{{ accept }}</template>
            <template v-if="maxSize !== Infinity"> &middot; 최대 {{ formatSize(maxSize) }}</template>
            <template v-if="maxFiles !== Infinity"> &middot; 최대 {{ maxFiles }}개</template>
          </p>
        </div>
      </slot>
    </div>

    <!-- File list -->
    <ul v-if="modelValue && modelValue.length > 0" :class="isStyled && 'ds-file-upload__list'">
      <li
        v-for="(file, index) in modelValue"
        :key="index"
        :class="isStyled && 'ds-file-upload__file'"
      >
        <div :class="isStyled && 'ds-file-upload__file-info'">
          <span :class="isStyled && 'ds-file-upload__file-name'">{{ file.name }}</span>
          <span :class="isStyled && 'ds-file-upload__file-size'">{{ formatSize(file.size) }}</span>
        </div>
        <button
          v-if="!disabled"
          type="button"
          :class="isStyled && 'ds-file-upload__file-remove'"
          @click="removeFile(index)"
          aria-label="파일 제거"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </li>
    </ul>
  </div>
</template>

<style>

  .ds-file-upload {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-family: var(--ds-font-family, inherit);
  }

  .ds-file-upload--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ds-file-upload__input {
    display: none;
  }

  .ds-file-upload__zone {
    border: 1px dashed var(--ds-border, rgba(0,0,0,0.1));
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    border-radius: 0.375rem;
    transition: background 250ms cubic-bezier(0.4,0,0.2,1),
                border-color 250ms cubic-bezier(0.4,0,0.2,1);
  }

  .ds-file-upload__zone--drag-over {
    background: var(--ds-accent, #e9ebef);
    border-color: var(--ds-primary, #030213);
  }

  .ds-file-upload--disabled .ds-file-upload__zone {
    cursor: not-allowed;
    pointer-events: none;
  }

  .ds-file-upload__zone-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .ds-file-upload__icon {
    color: var(--ds-muted-foreground, #717182);
  }

  .ds-file-upload__zone-text {
    margin: 0;
    font-size: 0.875rem;
    color: var(--ds-muted-foreground, #717182);
  }

  .ds-file-upload__zone-hint {
    margin: 0;
    font-size: 0.75rem;
    color: var(--ds-muted-foreground, #717182);
    opacity: 0.7;
  }

  .ds-file-upload__list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .ds-file-upload__file {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--ds-border, rgba(0,0,0,0.1));
  }

  .ds-file-upload__file-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .ds-file-upload__file-name {
    font-size: 0.875rem;
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-file-upload__file-size {
    font-size: 0.75rem;
    color: var(--ds-muted-foreground, #717182);
  }

  .ds-file-upload__file-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0.25rem;
    cursor: pointer;
    color: var(--ds-muted-foreground, #717182);
    opacity: 0.5;
    transition: opacity 150ms cubic-bezier(0.4,0,0.2,1);
    border-radius: 0.25rem;
  }

  .ds-file-upload__file-remove:hover {
    opacity: 1;
  }
</style>
