import type { Component } from 'vue'

export interface DsCoreOptions {
  applyDefaultStyle?: boolean
  spinner?: Component
  icons?: {
    check?: Component
    close?: Component
    arrow?: Component
    calendar?: Component
    search?: Component
  }
  empty?: {
    icon?: Component
    description?: string
  }
  defaults?: {
    button?: { throttle?: number }
    input?: { debounce?: number }
    modal?: { closeOnOverlay?: boolean; closeOnEsc?: boolean }
    pagination?: { pageSize?: number }
  }
}

export interface DsButtonProps {
  loading?: boolean
  throttle?: number
  spinner?: Component
  disabled?: boolean
  showSuccess?: boolean
  successDuration?: number
  type?: 'button' | 'submit' | 'reset'
}

export interface DsInputProps {
  modelValue?: string
  debounce?: number
  rules?: ((value: string) => string | boolean)[]
  error?: string
}

export interface DsTextareaProps {
  modelValue?: string
  autoResize?: boolean
  minRows?: number
  maxRows?: number
}

export interface DsSelectProps {
  modelValue?: string | number | null
  options?: { value: string | number; label: string; icon?: Component; description?: string; disabled?: boolean }[]
  placeholder?: string
  searchable?: boolean
  clearable?: boolean
  disabled?: boolean
}

export interface DsCheckboxProps {
  modelValue?: boolean
  indeterminate?: boolean
  disabled?: boolean
  checkIcon?: Component
  value?: string | number
}

export interface DsRadioProps {
  modelValue?: string | number | boolean
  value: string | number | boolean
  disabled?: boolean
  checkIcon?: Component
}

export interface DsRadioGroupProps {
  modelValue?: string | number | boolean
  options?: { value: string | number | boolean; label: string; disabled?: boolean }[]
  direction?: 'horizontal' | 'vertical'
  disabled?: boolean
}

export interface DsSwitchProps {
  modelValue?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export interface DsNumberInputProps {
  modelValue?: number | null
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  placeholder?: string
  formatter?: (value: number) => string
  parser?: (value: string) => number
}

export interface DsFormItemProps {
  label?: string
  required?: boolean
  error?: string
}

export interface DsFormProps {
  model?: Record<string, any>
  initialData?: Record<string, any>
  warnOnLeave?: boolean
}

export interface DsModalProps {
  modelValue?: boolean
  closeIcon?: Component
  closeOnOverlay?: boolean
  closeOnEsc?: boolean
  showClose?: boolean
  confirmBeforeClose?: boolean
  confirmMessage?: string
}

export interface DsToastProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  duration?: number
}

export interface DsConfirmProps {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  type?: 'info' | 'warning' | 'danger'
  icon?: Component
}

export interface DsAlertProps {
  type?: 'success' | 'error' | 'warning' | 'info'
  closable?: boolean
  icon?: Component
  showIcon?: boolean
}

export interface DsProgressProps {
  value?: number
  max?: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  striped?: boolean
  animated?: boolean
}

export interface DsSkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export interface DsSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | number
}
