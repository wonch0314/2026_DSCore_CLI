<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  DsToast,
  DsConfirm,
  DsAlert,
  DsProgress,
  DsSkeleton,
  DsErrorFallback,
} from 'dscore-ui-vue'

// --- DsToast ---
const toastRef = ref<InstanceType<typeof DsToast> | null>(null)

const showToast = (type: 'success' | 'error' | 'warning' | 'info') => {
  const messages = {
    success: 'Operation completed successfully.',
    error: 'Something went wrong. Please try again.',
    warning: 'This action cannot be undone.',
    info: 'Your session will expire in 5 minutes.',
  }
  toastRef.value?.[type](messages[type])
}

const showToastWithAction = () => {
  toastRef.value?.addToast({
    type: 'info',
    message: 'New update available.',
    duration: 6000,
    action: { label: 'Reload', onClick: () => {} },
    cancel: { label: 'Dismiss', onClick: () => {} },
  })
}

// --- DsConfirm ---
const confirmInfo = ref<InstanceType<typeof DsConfirm> | null>(null)
const confirmWarning = ref<InstanceType<typeof DsConfirm> | null>(null)
const confirmDanger = ref<InstanceType<typeof DsConfirm> | null>(null)
const confirmResults = reactive<Record<string, string>>({})

const openTypedConfirm = async (type: 'info' | 'warning' | 'danger') => {
  const refs = { info: confirmInfo, warning: confirmWarning, danger: confirmDanger }
  confirmResults[type] = ''
  const result = await refs[type].value?.open()
  confirmResults[type] = result ? 'Confirmed' : 'Cancelled'
}

// --- DsAlert ---
const alertVisible = reactive({
  info: true,
  success: true,
  warning: true,
  error: true,
})
const resetAlerts = () => {
  alertVisible.info = true
  alertVisible.success = true
  alertVisible.warning = true
  alertVisible.error = true
}

// --- DsProgress ---
const progressValue = ref(40)
const progressAnimated = ref(false)

// --- DsSkeleton ---
const skeletonAnimate = ref<'pulse' | 'wave' | 'none'>('pulse')
const skeletonAnimOptions = ['pulse', 'wave', 'none'] as const

// --- DsErrorFallback ---
const errorRetryCount = ref(0)
const handleRetry = () => {
  errorRetryCount.value++
}
</script>

<template>
  <div>
    <!-- DsToast (global instance, teleported to body) -->
    <DsToast ref="toastRef" position="top-right" :duration="3000" />

    <!-- DsConfirm instances -->
    <DsConfirm
      ref="confirmInfo"
      title="정보 확인"
      message="이 항목을 진행하시겠습니까?"
      type="info"
      confirm-text="확인"
      cancel-text="취소"
    />
    <DsConfirm
      ref="confirmWarning"
      title="경고"
      message="변경 사항이 저장되지 않을 수 있습니다."
      type="warning"
      confirm-text="계속"
      cancel-text="취소"
    />
    <DsConfirm
      ref="confirmDanger"
      title="삭제 확인"
      message="이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?"
      type="danger"
      confirm-text="삭제"
      cancel-text="취소"
    />

    <!-- DsToast -->
    <div class="demo-section">
      <h2 class="demo-section__title">DsToast</h2>
      <p class="demo-section__subtitle">
        Triggered via <code>toastRef.success/error/warning/info()</code>. Exposed methods on the component instance.
      </p>
      <div class="demo-row" style="flex-wrap: wrap; gap: 0.75rem;">
        <button
          class="ds-button"
          style="background: var(--ds-success); color: #fff; border: none; padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;"
          @click="showToast('success')"
        >Success</button>
        <button
          class="ds-button"
          style="background: var(--ds-error); color: #fff; border: none; padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;"
          @click="showToast('error')"
        >Error</button>
        <button
          class="ds-button"
          style="background: var(--ds-warning); color: #fff; border: none; padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;"
          @click="showToast('warning')"
        >Warning</button>
        <button
          class="ds-button"
          style="background: var(--ds-info); color: #fff; border: none; padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;"
          @click="showToast('info')"
        >Info</button>
        <button
          class="ds-button"
          style="background: var(--ds-surface-container); color: var(--ds-on-surface); border: 1px solid rgba(169,180,185,0.3); padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;"
          @click="showToastWithAction"
        >With Action</button>
      </div>
    </div>

    <!-- DsConfirm -->
    <div class="demo-section">
      <h2 class="demo-section__title">DsConfirm</h2>
      <p class="demo-section__subtitle">
        Promise-based confirmation dialog. Returns <code>true</code> or <code>false</code>.
      </p>
      <div class="demo-row" style="flex-wrap: wrap; gap: 0.75rem;">
        <button
          class="ds-button"
          style="border: 1px solid var(--ds-info); color: var(--ds-info); background: none; padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;"
          @click="openTypedConfirm('info')"
        >Info Confirm</button>
        <button
          class="ds-button"
          style="border: 1px solid var(--ds-warning); color: var(--ds-warning); background: none; padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;"
          @click="openTypedConfirm('warning')"
        >Warning Confirm</button>
        <button
          class="ds-button"
          style="border: 1px solid var(--ds-error); color: var(--ds-error); background: none; padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;"
          @click="openTypedConfirm('danger')"
        >Danger Confirm</button>
      </div>
      <div v-if="confirmResults.info || confirmResults.warning || confirmResults.danger" class="demo-row" style="gap: 2rem; margin-top: 0.5rem;">
        <div v-if="confirmResults.info" class="demo-value">info: {{ confirmResults.info }}</div>
        <div v-if="confirmResults.warning" class="demo-value">warning: {{ confirmResults.warning }}</div>
        <div v-if="confirmResults.danger" class="demo-value">danger: {{ confirmResults.danger }}</div>
      </div>
    </div>

    <!-- DsAlert -->
    <div class="demo-section">
      <h2 class="demo-section__title">DsAlert</h2>
      <p class="demo-section__subtitle">All four types with closable dismiss.</p>
      <div class="demo-column" style="gap: 0.75rem; max-width: 600px;">
        <DsAlert v-if="alertVisible.info" type="info" :closable="true" @close="alertVisible.info = false">
          This is an informational message.
        </DsAlert>
        <DsAlert v-if="alertVisible.success" type="success" :closable="true" @close="alertVisible.success = false">
          Your changes have been saved successfully.
        </DsAlert>
        <DsAlert v-if="alertVisible.warning" type="warning" :closable="true" @close="alertVisible.warning = false">
          Please review before continuing — some fields are incomplete.
        </DsAlert>
        <DsAlert v-if="alertVisible.error" type="error" :closable="true" @close="alertVisible.error = false">
          Failed to submit. Check your connection and try again.
        </DsAlert>
        <div
          v-if="!alertVisible.info && !alertVisible.success && !alertVisible.warning && !alertVisible.error"
        >
          <button
            style="background: none; border: 1px solid rgba(169,180,185,0.4); padding: 0.4rem 0.9rem; cursor: pointer; font-size: 0.8125rem; color: var(--ds-on-surface-variant);"
            @click="resetAlerts"
          >Reset alerts</button>
        </div>
      </div>
    </div>

    <!-- DsProgress -->
    <div class="demo-section">
      <h2 class="demo-section__title">DsProgress</h2>
      <p class="demo-section__subtitle">Sizes, striped, animated, and slider-controlled value.</p>
      <div class="demo-column" style="gap: 1.5rem; max-width: 560px;">
        <div>
          <p style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--ds-on-surface-variant); margin-bottom:0.5rem;">sm</p>
          <DsProgress size="sm" :value="progressValue" />
        </div>
        <div>
          <p style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--ds-on-surface-variant); margin-bottom:0.5rem;">md — show label</p>
          <DsProgress size="md" :value="progressValue" :show-label="true" />
        </div>
        <div>
          <p style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--ds-on-surface-variant); margin-bottom:0.5rem;">lg — striped + animated</p>
          <DsProgress size="lg" :value="progressValue" :striped="true" :animated="progressAnimated" />
        </div>

        <!-- Controls -->
        <div class="demo-row" style="align-items: center; gap: 1rem;">
          <input
            type="range"
            :value="progressValue"
            min="0"
            max="100"
            step="1"
            style="flex: 1;"
            @input="progressValue = Number(($event.target as HTMLInputElement).value)"
          />
          <span class="demo-value" style="min-width: 3ch;">{{ progressValue }}%</span>
          <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.875rem; color:var(--ds-on-surface-variant);">
            <input type="checkbox" v-model="progressAnimated" /> Animate
          </label>
        </div>
      </div>
    </div>

    <!-- DsSkeleton -->
    <div class="demo-section">
      <h2 class="demo-section__title">DsSkeleton</h2>
      <p class="demo-section__subtitle">Text lines, circular avatar, rectangular block, with animation toggle.</p>

      <div class="demo-row" style="gap: 1rem; margin-bottom: 1rem; align-items: center;">
        <span style="font-size:0.8125rem; color:var(--ds-on-surface-variant);">Animation:</span>
        <template v-for="opt in skeletonAnimOptions" :key="opt">
          <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.875rem; cursor:pointer;">
            <input type="radio" :value="opt" v-model="skeletonAnimate" />
            {{ opt }}
          </label>
        </template>
      </div>

      <div class="demo-grid" style="grid-template-columns: repeat(3, 1fr); gap: 2rem;">
        <!-- Text lines -->
        <div class="demo-column" style="gap: 0.5rem;">
          <p style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--ds-on-surface-variant); margin-bottom:0.25rem;">Text lines</p>
          <DsSkeleton variant="text" :animation="skeletonAnimate" />
          <DsSkeleton variant="text" :animation="skeletonAnimate" width="80%" />
          <DsSkeleton variant="text" :animation="skeletonAnimate" width="60%" />
        </div>

        <!-- Circular -->
        <div class="demo-column" style="gap: 0.75rem;">
          <p style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--ds-on-surface-variant); margin-bottom:0.25rem;">Circular</p>
          <div class="demo-row" style="gap: 1rem; align-items: flex-end;">
            <DsSkeleton variant="circular" :animation="skeletonAnimate" width="32" height="32" />
            <DsSkeleton variant="circular" :animation="skeletonAnimate" width="48" height="48" />
            <DsSkeleton variant="circular" :animation="skeletonAnimate" width="64" height="64" />
          </div>
        </div>

        <!-- Rectangular card mock -->
        <div class="demo-column" style="gap: 0.5rem;">
          <p style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--ds-on-surface-variant); margin-bottom:0.25rem;">Rectangular</p>
          <DsSkeleton variant="rectangular" :animation="skeletonAnimate" width="100%" height="120" />
          <DsSkeleton variant="text" :animation="skeletonAnimate" width="70%" />
          <DsSkeleton variant="text" :animation="skeletonAnimate" width="50%" />
        </div>
      </div>
    </div>

    <!-- DsSkeleton Presets -->
    <div class="demo-section">
      <h2 class="demo-section__title">DsSkeleton — 레이아웃 프리셋</h2>
      <p class="demo-section__subtitle">Table, Card, Form, List 형태의 스켈레톤 프리셋입니다.</p>

      <div class="demo-grid" style="grid-template-columns: repeat(2, 1fr); gap: 2rem;">
        <!-- Table preset -->
        <div class="demo-column" style="gap: 0.5rem;">
          <p style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--ds-on-surface-variant); margin-bottom:0.25rem;">Table</p>
          <div style="border: 1px solid rgba(0,0,0,0.08); border-radius: 0.5rem; padding: 1rem;">
            <DsSkeleton preset="table" :rows="4" :animation="skeletonAnimate" />
          </div>
        </div>

        <!-- Card preset -->
        <div class="demo-column" style="gap: 0.5rem;">
          <p style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--ds-on-surface-variant); margin-bottom:0.25rem;">Card</p>
          <div style="border: 1px solid rgba(0,0,0,0.08); border-radius: 0.5rem; overflow: hidden;">
            <DsSkeleton preset="card" :animation="skeletonAnimate" />
          </div>
        </div>

        <!-- Form preset -->
        <div class="demo-column" style="gap: 0.5rem;">
          <p style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--ds-on-surface-variant); margin-bottom:0.25rem;">Form</p>
          <div style="border: 1px solid rgba(0,0,0,0.08); border-radius: 0.5rem; padding: 1rem;">
            <DsSkeleton preset="form" :rows="3" :animation="skeletonAnimate" />
          </div>
        </div>

        <!-- List preset -->
        <div class="demo-column" style="gap: 0.5rem;">
          <p style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--ds-on-surface-variant); margin-bottom:0.25rem;">List</p>
          <div style="border: 1px solid rgba(0,0,0,0.08); border-radius: 0.5rem; padding: 1rem;">
            <DsSkeleton preset="list" :rows="4" :animation="skeletonAnimate" />
          </div>
        </div>
      </div>
    </div>

    <!-- DsErrorFallback -->
    <div class="demo-section">
      <h2 class="demo-section__title">DsErrorFallback</h2>
      <p class="demo-section__subtitle">API 에러 발생 시 표시하는 공통 에러 UI입니다. 상태 코드별로 기본 메시지를 제공합니다.</p>

      <div class="demo-grid" style="grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
        <div style="border: 1px solid rgba(0,0,0,0.08); border-radius: 0.5rem;">
          <DsErrorFallback :status="404" @retry="handleRetry" />
        </div>
        <div style="border: 1px solid rgba(0,0,0,0.08); border-radius: 0.5rem;">
          <DsErrorFallback :status="403" :show-retry="false" />
        </div>
        <div style="border: 1px solid rgba(0,0,0,0.08); border-radius: 0.5rem;">
          <DsErrorFallback :status="500" @retry="handleRetry" />
        </div>
        <div style="border: 1px solid rgba(0,0,0,0.08); border-radius: 0.5rem;">
          <DsErrorFallback
            title="커스텀 에러"
            description="사용자 정의 에러 메시지를 표시할 수 있습니다."
            retry-text="새로고침"
            @retry="handleRetry"
          />
        </div>
      </div>
      <p v-if="errorRetryCount > 0" class="demo-value" style="margin-top: 0.75rem;">
        재시도 횟수: {{ errorRetryCount }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.demo-grid {
  display: grid;
  gap: 1rem;
}

.demo-column {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.demo-value {
  font-size: 0.875rem;
  color: var(--ds-on-surface, #2a3439);
}
</style>
