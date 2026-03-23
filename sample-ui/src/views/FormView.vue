<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {
  DsSpinner,
  DsButton,
  DsInput,
  DsTextarea,
  DsSelect,
  DsCheckbox,
  DsRadio,
  DsRadioGroup,
  DsSwitch,
  DsNumberInput,
  DsFormItem,
  DsForm,
} from 'dscore-ui-vue'

// --- DsSpinner ---
// no state needed

// --- DsButton ---
const isLoading = ref(false)
const asyncResult = ref('')

const handleAsync = async () => {
  isLoading.value = true
  asyncResult.value = ''
  await new Promise(resolve => setTimeout(resolve, 1500))
  isLoading.value = false
  asyncResult.value = 'Done!'
}

// --- DsInput ---
const inputBasic = ref('')
const inputDebounce = ref('')
const inputDebounced = ref('')
const inputError = ref('invalid value')
let debounceTimer: ReturnType<typeof setTimeout>

const handleDebounceInput = (val: string) => {
  inputDebounce.value = val
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    inputDebounced.value = val
  }, 500)
}

// --- DsTextarea ---
const textareaBasic = ref('')
const textareaAuto = ref('')

// --- DsSelect ---
const selectValue = ref<string | null>(null)
const selectOptions = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C (disabled)', value: 'c', disabled: true },
]

// --- DsCheckbox ---
const checkSingle = ref(false)
const checkGroup = ref<string[]>([])
const checkIndeterminate = ref(false)

// --- DsRadio ---
const radioValue = ref('')

// --- DsRadioGroup ---
const radioGroupValue = ref('')
const radioGroupOptions = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma (disabled)', value: 'gamma', disabled: true },
]

// --- DsSwitch ---
const switchBasic = ref(false)
const switchLabel = ref(true)
const switchDisabled = ref(false)

// --- DsNumberInput ---
const numBasic = ref<number | null>(50)
const numFormatted = ref<number | null>(1234567)

// --- DsFormItem ---
// standalone demo — no backing form

// --- DsForm ---
const formModel = reactive({
  name: '',
  email: '',
  role: '',
  agree: false,
})
const formSubmitted = ref(false)
const formResult = ref('')

const handleFormSubmit = (data: Record<string, any>) => {
  formResult.value = JSON.stringify(data, null, 2)
  formSubmitted.value = true
}
</script>

<template>
  <div>
    <!-- DsSpinner -->
    <div class="demo-section">
      <h2 class="demo-section__title">DsSpinner</h2>
      <p class="demo-section__subtitle">Loading indicator in three sizes.</p>
      <div class="demo-row" style="align-items: center; gap: 2rem;">
        <div class="demo-column">
          <DsSpinner size="sm" />
          <span class="demo-value">sm</span>
        </div>
        <div class="demo-column">
          <DsSpinner size="md" />
          <span class="demo-value">md</span>
        </div>
        <div class="demo-column">
          <DsSpinner size="lg" />
          <span class="demo-value">lg</span>
        </div>
      </div>
    </div>

    <!-- DsButton -->
    <div class="demo-section">
      <h2 class="demo-section__title">DsButton</h2>
      <p class="demo-section__subtitle">Variants, states, and async interaction.</p>
      <div class="demo-row" style="flex-wrap: wrap; gap: 0.75rem;">
        <DsButton>Primary</DsButton>
        <DsButton class="ds-button--secondary">Secondary</DsButton>
        <DsButton class="ds-button--tertiary">Tertiary</DsButton>
        <DsButton :loading="true">Loading</DsButton>
        <DsButton disabled>Disabled</DsButton>
        <DsButton :loading="isLoading" @click="handleAsync">
          {{ isLoading ? 'Processing…' : 'Async Click' }}
        </DsButton>
      </div>
      <div v-if="asyncResult" class="demo-value">Result: {{ asyncResult }}</div>
    </div>

    <!-- DsInput -->
    <div class="demo-section">
      <h2 class="demo-section__title">DsInput</h2>
      <p class="demo-section__subtitle">Basic input, placeholder, debounce, and error state.</p>
      <div class="demo-grid" style="grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
        <div class="demo-column">
          <DsFormItem label="Basic">
            <DsInput v-model="inputBasic" />
          </DsFormItem>
          <div class="demo-value">Value: {{ inputBasic || '—' }}</div>
        </div>
        <div class="demo-column">
          <DsFormItem label="With placeholder">
            <DsInput placeholder="Enter something…" />
          </DsFormItem>
        </div>
        <div class="demo-column">
          <DsFormItem label="Debounce (500ms)">
            <DsInput :model-value="inputDebounce" @update:model-value="handleDebounceInput" placeholder="Type to debounce…" />
          </DsFormItem>
          <div class="demo-value">Debounced: {{ inputDebounced || '—' }}</div>
        </div>
        <div class="demo-column">
          <DsFormItem label="Error state" :error="'This field is required'">
            <DsInput v-model="inputError" />
          </DsFormItem>
        </div>
      </div>
    </div>

    <!-- DsTextarea -->
    <div class="demo-section">
      <h2 class="demo-section__title">DsTextarea</h2>
      <p class="demo-section__subtitle">Basic, auto-resize, and row constraints.</p>
      <div class="demo-grid" style="grid-template-columns: repeat(3, 1fr); gap: 1.5rem;">
        <div class="demo-column">
          <DsFormItem label="Basic">
            <DsTextarea v-model="textareaBasic" placeholder="Enter text…" />
          </DsFormItem>
          <div class="demo-value">{{ textareaBasic.length }} chars</div>
        </div>
        <div class="demo-column">
          <DsFormItem label="Auto-resize">
            <DsTextarea v-model="textareaAuto" :auto-resize="true" placeholder="Grows as you type…" />
          </DsFormItem>
        </div>
        <div class="demo-column">
          <DsFormItem label="Min 3 / Max 6 rows">
            <DsTextarea :min-rows="3" :max-rows="6" :auto-resize="true" placeholder="3–6 rows…" />
          </DsFormItem>
        </div>
      </div>
    </div>

    <!-- DsSelect -->
    <div class="demo-section">
      <h2 class="demo-section__title">DsSelect</h2>
      <p class="demo-section__subtitle">Dropdown with placeholder and disabled option.</p>
      <div style="max-width: 320px;">
        <DsFormItem label="Select option">
          <DsSelect
            v-model="selectValue"
            :options="selectOptions"
            placeholder="Choose one…"
          />
        </DsFormItem>
      </div>
      <div class="demo-value">Selected: {{ selectValue ?? '—' }}</div>
    </div>

    <!-- DsCheckbox -->
    <div class="demo-section">
      <h2 class="demo-section__title">DsCheckbox</h2>
      <p class="demo-section__subtitle">Single boolean, multi-select group, and indeterminate state.</p>
      <div class="demo-row" style="gap: 3rem; align-items: flex-start;">
        <div class="demo-column">
          <p style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--ds-on-surface-variant); margin-bottom:0.5rem;">Single</p>
          <DsCheckbox v-model="checkSingle">Accept terms</DsCheckbox>
          <div class="demo-value">{{ checkSingle }}</div>
        </div>
        <div class="demo-column">
          <p style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--ds-on-surface-variant); margin-bottom:0.5rem;">Multi-select</p>
          <DsCheckbox v-model="checkGroup" value="alpha">Alpha</DsCheckbox>
          <DsCheckbox v-model="checkGroup" value="beta">Beta</DsCheckbox>
          <DsCheckbox v-model="checkGroup" value="gamma">Gamma</DsCheckbox>
          <div class="demo-value">{{ checkGroup.join(', ') || '—' }}</div>
        </div>
        <div class="demo-column">
          <p style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--ds-on-surface-variant); margin-bottom:0.5rem;">Indeterminate</p>
          <DsCheckbox v-model="checkIndeterminate" :indeterminate="true">Partial</DsCheckbox>
          <div class="demo-value">{{ checkIndeterminate }}</div>
        </div>
      </div>
    </div>

    <!-- DsRadio -->
    <div class="demo-section">
      <h2 class="demo-section__title">DsRadio</h2>
      <p class="demo-section__subtitle">Manual radio group with v-model and a disabled option.</p>
      <div class="demo-column" style="gap: 0.5rem;">
        <DsRadio v-model="radioValue" value="one">One</DsRadio>
        <DsRadio v-model="radioValue" value="two">Two</DsRadio>
        <DsRadio v-model="radioValue" value="three" disabled>Three (disabled)</DsRadio>
      </div>
      <div class="demo-value">Selected: {{ radioValue || '—' }}</div>
    </div>

    <!-- DsRadioGroup -->
    <div class="demo-section">
      <h2 class="demo-section__title">DsRadioGroup</h2>
      <p class="demo-section__subtitle">Options prop with horizontal direction.</p>
      <DsRadioGroup
        v-model="radioGroupValue"
        :options="radioGroupOptions"
        direction="horizontal"
      />
      <div class="demo-value">Selected: {{ radioGroupValue || '—' }}</div>
    </div>

    <!-- DsSwitch -->
    <div class="demo-section">
      <h2 class="demo-section__title">DsSwitch</h2>
      <p class="demo-section__subtitle">Basic, labeled, and disabled variants.</p>
      <div class="demo-row" style="gap: 3rem; align-items: center;">
        <div class="demo-column">
          <DsSwitch v-model="switchBasic" />
          <div class="demo-value">{{ switchBasic }}</div>
        </div>
        <div class="demo-column">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <DsSwitch v-model="switchLabel" />
            <span style="font-size:0.875rem;">{{ switchLabel ? 'Enabled' : 'Disabled' }}</span>
          </div>
          <div class="demo-value">{{ switchLabel }}</div>
        </div>
        <div class="demo-column">
          <DsSwitch v-model="switchDisabled" disabled />
          <div class="demo-value">disabled</div>
        </div>
      </div>
    </div>

    <!-- DsNumberInput -->
    <div class="demo-section">
      <h2 class="demo-section__title">DsNumberInput</h2>
      <p class="demo-section__subtitle">Min/max clamping, step, and comma formatter.</p>
      <div class="demo-row" style="gap: 3rem; align-items: flex-start;">
        <div class="demo-column">
          <DsFormItem label="Min 0 / Max 100 / Step 5">
            <DsNumberInput v-model="numBasic" :min="0" :max="100" :step="5" />
          </DsFormItem>
          <div class="demo-value">{{ numBasic }}</div>
        </div>
        <div class="demo-column">
          <DsFormItem label="Comma formatted">
            <DsNumberInput
              v-model="numFormatted"
              :formatter="(v: number) => v.toLocaleString()"
            />
          </DsFormItem>
          <div class="demo-value">{{ numFormatted?.toLocaleString() }}</div>
        </div>
      </div>
    </div>

    <!-- DsFormItem -->
    <div class="demo-section">
      <h2 class="demo-section__title">DsFormItem</h2>
      <p class="demo-section__subtitle">Label, required mark, and error message composition.</p>
      <div class="demo-grid" style="grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 800px;">
        <DsFormItem label="Plain label">
          <DsInput placeholder="…" />
        </DsFormItem>
        <DsFormItem label="Required" :required="true">
          <DsInput placeholder="…" />
        </DsFormItem>
        <DsFormItem label="With error" error="This field is invalid">
          <DsInput model-value="bad" />
        </DsFormItem>
      </div>
    </div>

    <!-- DsForm -->
    <div class="demo-section">
      <h2 class="demo-section__title">DsForm</h2>
      <p class="demo-section__subtitle">Complete form wiring: model binding, validation, and submit.</p>
      <div style="max-width: 480px;">
        <DsForm :model="formModel" @submit="handleFormSubmit">
          <DsFormItem label="Name" :required="true">
            <DsInput v-model="formModel.name" placeholder="Full name" />
          </DsFormItem>
          <DsFormItem label="Email" :required="true">
            <DsInput v-model="formModel.email" placeholder="you@example.com" />
          </DsFormItem>
          <DsFormItem label="Role">
            <DsSelect
              v-model="formModel.role"
              :options="[
                { label: 'Admin', value: 'admin' },
                { label: 'Editor', value: 'editor' },
                { label: 'Viewer', value: 'viewer' },
              ]"
              placeholder="Select role…"
            />
          </DsFormItem>
          <DsFormItem>
            <DsCheckbox v-model="formModel.agree">I agree to the terms</DsCheckbox>
          </DsFormItem>
          <div style="display: flex; gap: 0.75rem;">
            <DsButton type="submit">Submit</DsButton>
            <DsButton type="reset" class="ds-button--secondary">Reset</DsButton>
          </div>
        </DsForm>
      </div>
      <div v-if="formSubmitted" class="demo-value" style="margin-top: 1rem; white-space: pre;">{{ formResult }}</div>
    </div>
  </div>
</template>
