<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  format?: string
  minDate?: string
  maxDate?: string
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  disabled: false,
  format: 'YYYY-MM-DD',
  minDate: '',
  maxDate: '',
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const isOpen = ref(false)
const pickerRef = ref<HTMLElement | null>(null)

// Current view state
const viewYear = ref(new Date().getFullYear())
const viewMonth = ref(new Date().getMonth()) // 0-indexed

const DAYS = ['일', '월', '화', '수', '목', '금', '토']
const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

function parseDate(str: string): Date | null {
  if (!str) return null
  const d = new Date(str)
  return isNaN(d.getTime()) ? null : d
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function toYMD(str: string) {
  if (!str) return null
  const parts = str.split('-')
  if (parts.length !== 3) return null
  return { y: parseInt(parts[0]), m: parseInt(parts[1]) - 1, d: parseInt(parts[2]) }
}

const selectedYMD = computed(() => toYMD(props.modelValue))

const todayStr = computed(() => formatDate(new Date()))
const todayYMD = computed(() => toYMD(todayStr.value)!)

// Calendar grid
const calendarDays = computed(() => {
  const firstDay = new Date(viewYear.value, viewMonth.value, 1).getDay()
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const daysInPrevMonth = new Date(viewYear.value, viewMonth.value, 0).getDate()

  const cells: Array<{ y: number; m: number; d: number; current: boolean }> = []

  // prev month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const prevM = viewMonth.value === 0 ? 11 : viewMonth.value - 1
    const prevY = viewMonth.value === 0 ? viewYear.value - 1 : viewYear.value
    cells.push({ y: prevY, m: prevM, d: daysInPrevMonth - i, current: false })
  }

  // current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ y: viewYear.value, m: viewMonth.value, d, current: true })
  }

  // next month leading days
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    const nextM = viewMonth.value === 11 ? 0 : viewMonth.value + 1
    const nextY = viewMonth.value === 11 ? viewYear.value + 1 : viewYear.value
    cells.push({ y: nextY, m: nextM, d, current: false })
  }

  return cells
})

function cellStr(cell: { y: number; m: number; d: number }) {
  return `${cell.y}-${String(cell.m + 1).padStart(2, '0')}-${String(cell.d).padStart(2, '0')}`
}

function isSelected(cell: { y: number; m: number; d: number }) {
  const s = selectedYMD.value
  return s !== null && s.y === cell.y && s.m === cell.m && s.d === cell.d
}

function isToday(cell: { y: number; m: number; d: number }) {
  const t = todayYMD.value
  return t.y === cell.y && t.m === cell.m && t.d === cell.d
}

function isDisabledCell(cell: { y: number; m: number; d: number }) {
  const cs = cellStr(cell)
  if (props.minDate && cs < props.minDate) return true
  if (props.maxDate && cs > props.maxDate) return true
  return false
}

function prevMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value--
  } else {
    viewMonth.value--
  }
}

function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value++
  } else {
    viewMonth.value++
  }
}

function selectDay(cell: { y: number; m: number; d: number; current: boolean }) {
  if (isDisabledCell(cell)) return
  const val = cellStr(cell)
  emit('update:modelValue', val)
  emit('change', val)
  isOpen.value = false
}

function open() {
  if (props.disabled) return
  // sync view to selected date
  if (selectedYMD.value) {
    viewYear.value = selectedYMD.value.y
    viewMonth.value = selectedYMD.value.m
  }
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

function toggle() {
  isOpen.value ? close() : open()
}

const displayValue = computed(() => props.modelValue || '')

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

function handleClickOutside(e: MouseEvent) {
  if (pickerRef.value && !pickerRef.value.contains(e.target as Node)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div
    ref="pickerRef"
    :class="[
      isStyled && 'ds-datepicker',
      isStyled && isOpen && 'ds-datepicker--open',
      isStyled && disabled && 'ds-datepicker--disabled'
    ]"
    @keydown="handleKeydown"
  >
    <slot name="trigger" :open="toggle" :value="displayValue">
      <div
        :class="isStyled && 'ds-datepicker-trigger'"
        tabindex="0"
        @click="toggle"
      >
        <span v-if="displayValue" :class="isStyled && 'ds-datepicker-value'">{{ displayValue }}</span>
        <span v-else :class="isStyled && 'ds-datepicker-placeholder'">{{ placeholder || 'YYYY-MM-DD' }}</span>
        <span :class="isStyled && 'ds-datepicker-icon'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="4" width="18" height="18" rx="0" ry="0" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="16" y1="2" x2="16" y2="6" />
          </svg>
        </span>
      </div>
    </slot>

    <Transition name="ds-datepicker-dropdown">
      <div v-if="isOpen" :class="isStyled && 'ds-datepicker-calendar'">
        <!-- Header -->
        <div :class="isStyled && 'ds-datepicker-header'">
          <button type="button" :class="isStyled && 'ds-datepicker-nav'" @click="prevMonth">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span :class="isStyled && 'ds-datepicker-month-label'">
            {{ viewYear }}년 {{ MONTHS[viewMonth] }}
          </span>
          <button type="button" :class="isStyled && 'ds-datepicker-nav'" @click="nextMonth">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <!-- Day headers -->
        <div :class="isStyled && 'ds-datepicker-grid'">
          <div
            v-for="day in DAYS"
            :key="day"
            :class="isStyled && 'ds-datepicker-day-header'"
          >{{ day }}</div>

          <!-- Day cells -->
          <div
            v-for="(cell, idx) in calendarDays"
            :key="idx"
            :class="[
              isStyled && 'ds-datepicker-day',
              isStyled && !cell.current && 'ds-datepicker-day--other-month',
              isStyled && isSelected(cell) && 'ds-datepicker-day--selected',
              isStyled && isToday(cell) && 'ds-datepicker-day--today',
              isStyled && isDisabledCell(cell) && 'ds-datepicker-day--disabled'
            ]"
            @click="selectDay(cell)"
          >{{ cell.d }}</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>

  .ds-datepicker {
    position: relative;
    display: inline-block;
    font-family: var(--ds-font-family, inherit);
    font-size: 0.875rem;
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-datepicker--disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .ds-datepicker-trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    transition: border-color 150ms cubic-bezier(0.4,0,0.2,1);
    min-width: 148px;
    font-size: 0.875rem;
  }

  .ds-datepicker-trigger:focus {
    outline: none;
    border-bottom: 2px solid var(--ds-primary, #030213);
    padding-bottom: calc(0.5rem - 1px);
  }

  .ds-datepicker--open .ds-datepicker-trigger {
    border-bottom: 2px solid var(--ds-primary, #030213);
    padding-bottom: calc(0.5rem - 1px);
  }

  .ds-datepicker-value {
    flex: 1;
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-datepicker-placeholder {
    flex: 1;
    color: var(--ds-muted-foreground, #717182);
    opacity: 0.7;
  }

  .ds-datepicker-icon {
    display: flex;
    align-items: center;
    color: var(--ds-muted-foreground, #717182);
    flex-shrink: 0;
  }

  .ds-datepicker-icon svg {
    width: 15px;
    height: 15px;
  }

  .ds-datepicker-calendar {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    z-index: 200;
    background: var(--ds-popover, #fff);
    border: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
    padding: 0.75rem;
    min-width: 268px;
  }

  .ds-datepicker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    padding: 0 2px;
  }

  .ds-datepicker-month-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-datepicker-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    width: 1.75rem;
    height: 1.75rem;
    color: var(--ds-foreground, #1a1a1a);
    border-radius: 0.375rem;
    opacity: 0.5;
    transition: opacity 150ms cubic-bezier(0.4,0,0.2,1);
  }

  .ds-datepicker-nav:hover {
    opacity: 1;
  }

  .ds-datepicker-nav svg {
    width: 15px;
    height: 15px;
  }

  .ds-datepicker-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }

  .ds-datepicker-day-header {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--ds-muted-foreground, #717182);
    padding: 0.25rem 0;
    margin-bottom: 2px;
  }

  .ds-datepicker-day {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    font-size: 0.875rem;
    cursor: pointer;
    border-radius: 0.375rem;
    transition: background 150ms cubic-bezier(0.4,0,0.2,1),
                color 150ms cubic-bezier(0.4,0,0.2,1);
    user-select: none;
    position: relative;
  }

  .ds-datepicker-day:hover:not(.ds-datepicker-day--disabled):not(.ds-datepicker-day--selected) {
    background: var(--ds-accent, #e9ebef);
  }

  .ds-datepicker-day--other-month {
    color: var(--ds-muted-foreground, #717182);
    opacity: 0.3;
  }

  .ds-datepicker-day--selected {
    background: var(--ds-primary, #030213);
    color: var(--ds-primary-foreground, #fff);
    font-weight: 600;
  }

  .ds-datepicker-day--today:not(.ds-datepicker-day--selected) {
    background: var(--ds-accent, #e9ebef);
    font-weight: 600;
  }

  .ds-datepicker-day--disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }

  .ds-datepicker-dropdown-enter-active,
  .ds-datepicker-dropdown-leave-active {
    transition: opacity 150ms cubic-bezier(0.4,0,0.2,1),
                transform 150ms cubic-bezier(0.4,0,0.2,1);
  }

  .ds-datepicker-dropdown-enter-from,
  .ds-datepicker-dropdown-leave-to {
    opacity: 0;
    transform: translateY(-6px);
  }
</style>
