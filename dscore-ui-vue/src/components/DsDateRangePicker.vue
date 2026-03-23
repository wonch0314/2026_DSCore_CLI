<script lang="ts">
interface DateRange {
  start: string
  end: string
}

interface Preset {
  label: string
  value: DateRange
}

function fmtDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function todayStr() {
  return fmtDate(new Date())
}

function offsetDate(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return fmtDate(d)
}

function startOfWeek(): string {
  const d = new Date()
  d.setDate(d.getDate() - d.getDay())
  return fmtDate(d)
}

function endOfWeek(): string {
  const d = new Date()
  d.setDate(d.getDate() + (6 - d.getDay()))
  return fmtDate(d)
}

function startOfMonth(): string {
  const d = new Date()
  d.setDate(1)
  return fmtDate(d)
}

function endOfMonth(): string {
  const d = new Date()
  d.setMonth(d.getMonth() + 1, 0)
  return fmtDate(d)
}

const defaultPresets: Preset[] = [
  { label: '오늘', value: { start: todayStr(), end: todayStr() } },
  { label: '최근 7일', value: { start: offsetDate(-6), end: todayStr() } },
  { label: '이번 주', value: { start: startOfWeek(), end: endOfWeek() } },
  { label: '이번 달', value: { start: startOfMonth(), end: endOfMonth() } },
  { label: '최근 30일', value: { start: offsetDate(-29), end: todayStr() } }
]

export { DateRange, Preset, defaultPresets, todayStr, fmtDate }
</script>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  modelValue?: DateRange
  placeholder?: { start: string; end: string }
  disabled?: boolean
  presets?: Preset[]
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({ start: '', end: '' }),
  placeholder: () => ({ start: '시작일', end: '종료일' }),
  disabled: false,
  presets: () => defaultPresets,
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: DateRange]
  'change': [value: DateRange]
}>()

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const isOpen = ref(false)
const pickerRef = ref<HTMLElement | null>(null)

// Selecting state: 'start' | 'end' | null
const selectingPhase = ref<'start' | 'end'>('start')
const hoverDate = ref('')
const pendingStart = ref('')

// View months (left and right)
const leftYear = ref(new Date().getFullYear())
const leftMonth = ref(new Date().getMonth())

const rightYear = computed(() => leftMonth.value === 11 ? leftYear.value + 1 : leftYear.value)
const rightMonth = computed(() => leftMonth.value === 11 ? 0 : leftMonth.value + 1)

const DAYS = ['일', '월', '화', '수', '목', '금', '토']
const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

function prevMonth() {
  if (leftMonth.value === 0) {
    leftMonth.value = 11
    leftYear.value--
  } else {
    leftMonth.value--
  }
}

function nextMonth() {
  if (leftMonth.value === 11) {
    leftMonth.value = 0
    leftYear.value++
  } else {
    leftMonth.value++
  }
}

function buildGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells: Array<{ y: number; m: number; d: number; current: boolean }> = []

  for (let i = firstDay - 1; i >= 0; i--) {
    const prevM = month === 0 ? 11 : month - 1
    const prevY = month === 0 ? year - 1 : year
    cells.push({ y: prevY, m: prevM, d: daysInPrevMonth - i, current: false })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ y: year, m: month, d, current: true })
  }

  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    const nextM = month === 11 ? 0 : month + 1
    const nextY = month === 11 ? year + 1 : year
    cells.push({ y: nextY, m: nextM, d, current: false })
  }

  return cells
}

const leftGrid = computed(() => buildGrid(leftYear.value, leftMonth.value))
const rightGrid = computed(() => buildGrid(rightYear.value, rightMonth.value))

function cellStr(cell: { y: number; m: number; d: number }) {
  return `${cell.y}-${String(cell.m + 1).padStart(2, '0')}-${String(cell.d).padStart(2, '0')}`
}

// Effective range for highlighting (including pending + hover)
const effectiveStart = computed(() => {
  if (selectingPhase.value === 'end' && pendingStart.value) {
    return pendingStart.value
  }
  return props.modelValue.start
})

const effectiveEnd = computed(() => {
  if (selectingPhase.value === 'end' && pendingStart.value && hoverDate.value) {
    const a = pendingStart.value
    const b = hoverDate.value
    return a <= b ? b : a
  }
  return props.modelValue.end
})

const effectiveStartActual = computed(() => {
  if (selectingPhase.value === 'end' && pendingStart.value && hoverDate.value) {
    const a = pendingStart.value
    const b = hoverDate.value
    return a <= b ? a : b
  }
  return effectiveStart.value
})

function isStart(cell: { y: number; m: number; d: number }) {
  return cellStr(cell) === effectiveStartActual.value && effectiveStartActual.value !== ''
}

function isEnd(cell: { y: number; m: number; d: number }) {
  const cs = cellStr(cell)
  return cs === effectiveEnd.value && effectiveEnd.value !== '' && cs !== effectiveStartActual.value
}

function isInRange(cell: { y: number; m: number; d: number }) {
  const cs = cellStr(cell)
  const s = effectiveStartActual.value
  const e = effectiveEnd.value
  if (!s || !e) return false
  return cs > s && cs < e
}

function isToday(cell: { y: number; m: number; d: number }) {
  return cellStr(cell) === todayStr()
}

function handleDayClick(cell: { y: number; m: number; d: number }) {
  const cs = cellStr(cell)

  if (selectingPhase.value === 'start') {
    pendingStart.value = cs
    selectingPhase.value = 'end'
    hoverDate.value = cs
  } else {
    // end phase
    let start = pendingStart.value
    let end = cs
    if (start > end) {
      ;[start, end] = [end, start]
    }
    const val = { start, end }
    emit('update:modelValue', val)
    emit('change', val)
    pendingStart.value = ''
    hoverDate.value = ''
    selectingPhase.value = 'start'
    isOpen.value = false
  }
}

function handleDayHover(cell: { y: number; m: number; d: number }) {
  if (selectingPhase.value === 'end') {
    hoverDate.value = cellStr(cell)
  }
}

function applyPreset(preset: Preset) {
  emit('update:modelValue', { ...preset.value })
  emit('change', { ...preset.value })
  pendingStart.value = ''
  hoverDate.value = ''
  selectingPhase.value = 'start'
  isOpen.value = false
}

function open() {
  if (props.disabled) return
  // Sync left panel to start date or current month
  if (props.modelValue?.start) {
    const parts = props.modelValue.start.split('-')
    if (parts.length >= 2 && !isNaN(parseInt(parts[0])) && !isNaN(parseInt(parts[1]))) {
      leftYear.value = parseInt(parts[0])
      leftMonth.value = parseInt(parts[1]) - 1
      // Ensure right panel is next month
      if (leftMonth.value === 11) {
        leftMonth.value = 10 // show Nov + Dec when start is Dec
      }
    }
  }
  selectingPhase.value = 'start'
  pendingStart.value = ''
  hoverDate.value = ''
  isOpen.value = true
}

function close() {
  isOpen.value = false
  selectingPhase.value = 'start'
  pendingStart.value = ''
  hoverDate.value = ''
}

function toggle() {
  isOpen.value ? close() : open()
}

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
      isStyled && 'ds-daterange',
      isStyled && isOpen && 'ds-daterange--open',
      isStyled && disabled && 'ds-daterange--disabled'
    ]"
    @keydown="handleKeydown"
  >
    <!-- Trigger -->
    <div :class="isStyled && 'ds-daterange-trigger'" tabindex="0" @click="toggle">
      <div :class="[isStyled && 'ds-daterange-input', isStyled && isOpen && 'ds-daterange-input--active']">
        <span v-if="modelValue.start" :class="isStyled && 'ds-daterange-value'">{{ modelValue.start }}</span>
        <span v-else :class="isStyled && 'ds-daterange-placeholder'">{{ placeholder.start }}</span>
      </div>
      <span :class="isStyled && 'ds-daterange-sep'">~</span>
      <div :class="[isStyled && 'ds-daterange-input', isStyled && isOpen && 'ds-daterange-input--active']">
        <span v-if="modelValue.end" :class="isStyled && 'ds-daterange-value'">{{ modelValue.end }}</span>
        <span v-else :class="isStyled && 'ds-daterange-placeholder'">{{ placeholder.end }}</span>
      </div>
      <span :class="isStyled && 'ds-daterange-icon'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="4" width="18" height="18" rx="0" ry="0" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="16" y1="2" x2="16" y2="6" />
        </svg>
      </span>
    </div>

    <!-- Calendar panel -->
    <Transition name="ds-daterange-dropdown">
      <div v-if="isOpen" :class="isStyled && 'ds-daterange-panel'">
        <!-- Presets sidebar -->
        <div :class="isStyled && 'ds-daterange-presets'">
          <button
            v-for="preset in presets"
            :key="preset.label"
            type="button"
            :class="isStyled && 'ds-daterange-preset-btn'"
            @click="applyPreset(preset)"
          >
            {{ preset.label }}
          </button>
        </div>

        <!-- Calendars -->
        <div :class="isStyled && 'ds-daterange-calendars'">
          <!-- Left month -->
          <div :class="isStyled && 'ds-daterange-calendar'">
            <div :class="isStyled && 'ds-daterange-cal-header'">
              <button type="button" :class="isStyled && 'ds-daterange-nav'" @click="prevMonth">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <span :class="isStyled && 'ds-daterange-month-label'">
                {{ leftYear }}년 {{ MONTHS[leftMonth] }}
              </span>
              <button type="button" :class="[isStyled && 'ds-daterange-nav', isStyled && 'ds-daterange-nav--hidden']" disabled>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
            <div :class="isStyled && 'ds-daterange-grid'">
              <div v-for="day in DAYS" :key="day" :class="isStyled && 'ds-daterange-day-header'">{{ day }}</div>
              <div
                v-for="(cell, idx) in leftGrid"
                :key="idx"
                :class="[
                  isStyled && 'ds-daterange-day',
                  isStyled && !cell.current && 'ds-daterange-day--other-month',
                  isStyled && isStart(cell) && 'ds-daterange-day--start',
                  isStyled && isEnd(cell) && 'ds-daterange-day--end',
                  isStyled && isInRange(cell) && 'ds-daterange-day--in-range',
                  isStyled && isToday(cell) && 'ds-daterange-day--today'
                ]"
                @click="handleDayClick(cell)"
                @mouseenter="handleDayHover(cell)"
              >{{ cell.d }}</div>
            </div>
          </div>

          <!-- Right month -->
          <div :class="isStyled && 'ds-daterange-calendar'">
            <div :class="isStyled && 'ds-daterange-cal-header'">
              <button type="button" :class="[isStyled && 'ds-daterange-nav', isStyled && 'ds-daterange-nav--hidden']" disabled>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <span :class="isStyled && 'ds-daterange-month-label'">
                {{ rightYear }}년 {{ MONTHS[rightMonth] }}
              </span>
              <button type="button" :class="isStyled && 'ds-daterange-nav'" @click="nextMonth">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
            <div :class="isStyled && 'ds-daterange-grid'">
              <div v-for="day in DAYS" :key="day" :class="isStyled && 'ds-daterange-day-header'">{{ day }}</div>
              <div
                v-for="(cell, idx) in rightGrid"
                :key="idx"
                :class="[
                  isStyled && 'ds-daterange-day',
                  isStyled && !cell.current && 'ds-daterange-day--other-month',
                  isStyled && isStart(cell) && 'ds-daterange-day--start',
                  isStyled && isEnd(cell) && 'ds-daterange-day--end',
                  isStyled && isInRange(cell) && 'ds-daterange-day--in-range',
                  isStyled && isToday(cell) && 'ds-daterange-day--today'
                ]"
                @click="handleDayClick(cell)"
                @mouseenter="handleDayHover(cell)"
              >{{ cell.d }}</div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>

  .ds-daterange {
    position: relative;
    display: inline-block;
    font-family: var(--ds-font-family, inherit);
    font-size: 0.875rem;
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-daterange--disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  .ds-daterange-trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .ds-daterange-input {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    transition: border-bottom-color 150ms cubic-bezier(0.4,0,0.2,1);
    min-width: 100px;
  }

  .ds-daterange-input--active {
    border-bottom: 2px solid var(--ds-primary, #030213);
  }

  .ds-daterange-trigger:focus {
    outline: none;
  }

  .ds-daterange-value {
    white-space: nowrap;
  }

  .ds-daterange-placeholder {
    color: var(--ds-muted-foreground, #717182);
    opacity: 0.7;
    white-space: nowrap;
  }

  .ds-daterange-sep {
    color: var(--ds-muted-foreground, #717182);
    font-size: 0.875rem;
  }

  .ds-daterange-icon {
    display: flex;
    align-items: center;
    color: var(--ds-muted-foreground, #717182);
    margin-left: 0.25rem;
  }

  .ds-daterange-icon svg {
    width: 16px;
    height: 16px;
  }

  .ds-daterange-panel {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 200;
    display: flex;
    background: var(--ds-popover, #fff);
    border: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
  }

  .ds-daterange-presets {
    display: flex;
    flex-direction: column;
    padding: 0.75rem 0;
    border-right: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    min-width: 90px;
  }

  .ds-daterange-preset-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    color: var(--ds-foreground, #1a1a1a);
    text-align: left;
    white-space: nowrap;
    font-family: var(--ds-font-family, inherit);
    transition: background 150ms cubic-bezier(0.4,0,0.2,1);
    border-radius: 0.125rem;
  }

  .ds-daterange-preset-btn:hover {
    background: var(--ds-accent, #e9ebef);
    color: var(--ds-accent-foreground, #030213);
  }

  .ds-daterange-calendars {
    display: flex;
    gap: 0;
  }

  .ds-daterange-calendar {
    padding: 0.75rem;
  }

  .ds-daterange-calendar + .ds-daterange-calendar {
    border-left: 1px solid var(--ds-border, rgba(0,0,0,0.1));
  }

  .ds-daterange-cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .ds-daterange-month-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-daterange-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    color: var(--ds-foreground, #1a1a1a);
    border-radius: 0.375rem;
    opacity: 0.5;
    width: 1.75rem;
    height: 1.75rem;
    transition: opacity 150ms cubic-bezier(0.4,0,0.2,1);
  }

  .ds-daterange-nav:hover:not(:disabled) {
    opacity: 1;
  }

  .ds-daterange-nav--hidden {
    visibility: hidden;
    cursor: default;
  }

  .ds-daterange-nav svg {
    width: 16px;
    height: 16px;
  }

  .ds-daterange-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }

  .ds-daterange-day-header {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--ds-muted-foreground, #717182);
    padding: 0.25rem 0;
  }

  .ds-daterange-day {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    font-size: 0.875rem;
    cursor: pointer;
    border-radius: 0.375rem;
    transition: background 150ms cubic-bezier(0.4,0,0.2,1);
    user-select: none;
    position: relative;
  }

  .ds-daterange-day:hover:not(.ds-daterange-day--start):not(.ds-daterange-day--end) {
    background: var(--ds-accent, #e9ebef);
  }

  .ds-daterange-day--other-month {
    color: var(--ds-muted-foreground, #717182);
    opacity: 0.35;
  }

  .ds-daterange-day--in-range {
    background: color-mix(in srgb, var(--ds-accent, #e9ebef) 50%, transparent);
    border-radius: 0;
  }

  .ds-daterange-day--start,
  .ds-daterange-day--end {
    background: var(--ds-primary, #030213);
    color: var(--ds-primary-foreground, #fff);
    border-radius: 0.375rem;
  }

  .ds-daterange-day--today:not(.ds-daterange-day--start):not(.ds-daterange-day--end) {
    background: var(--ds-accent, #e9ebef);
    font-weight: 600;
  }

  .ds-daterange-dropdown-enter-active,
  .ds-daterange-dropdown-leave-active {
    transition: opacity 150ms cubic-bezier(0.4,0,0.2,1), transform 150ms cubic-bezier(0.4,0,0.2,1);
  }

  .ds-daterange-dropdown-enter-from,
  .ds-daterange-dropdown-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }
</style>
