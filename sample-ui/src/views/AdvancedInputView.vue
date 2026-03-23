<script setup lang="ts">
import { ref } from 'vue'
import {
  DsDatePicker,
  DsDateRangePicker,
  DsTagInput,
  DsFileUpload,
  DsTreeSelect,
  DsTransfer,
} from 'dscore-ui-vue'

// DatePicker
const basicDate = ref('')
const restrictedDate = ref('')

// DateRangePicker
const basicRange = ref<{ start: string; end: string }>({ start: '', end: '' })
const presetRange = ref<{ start: string; end: string }>({ start: '', end: '' })

const today = new Date()
const yyyy = today.getFullYear()
const mm = String(today.getMonth() + 1).padStart(2, '0')
const dd = String(today.getDate()).padStart(2, '0')
const todayStr = `${yyyy}-${mm}-${dd}`
const minDateStr = `${yyyy}-${mm}-01`
const maxDateStr = `${yyyy}-${mm}-${dd}`

// TagInput
const basicTags = ref<string[]>(['Vue', 'TypeScript'])
const limitedTags = ref<string[]>(['태그1', '태그2', '태그3'])

// FileUpload
const basicFiles = ref<File[]>([])
const imageFiles = ref<File[]>([])
const fileError = ref('')

// TreeSelect
const treeData = [
  { key: '1', label: '경영지원', children: [
    { key: '1-1', label: '인사팀' },
    { key: '1-2', label: '재무팀' },
    { key: '1-3', label: '총무팀' },
  ]},
  { key: '2', label: '개발본부', children: [
    { key: '2-1', label: '프론트엔드팀' },
    { key: '2-2', label: '백엔드팀' },
    { key: '2-3', label: '인프라팀' },
  ]},
  { key: '3', label: '마케팅', children: [
    { key: '3-1', label: '브랜드팀' },
    { key: '3-2', label: '퍼포먼스팀' },
  ]},
]
const selectedDept = ref<string | number | null>(null)
const selectedMultiDept = ref<(string | number)[]>([])

// Transfer
const transferData = [
  { key: 'perm-1', label: '사용자 조회' },
  { key: 'perm-2', label: '사용자 생성' },
  { key: 'perm-3', label: '사용자 수정' },
  { key: 'perm-4', label: '사용자 삭제' },
  { key: 'perm-5', label: '콘텐츠 조회' },
  { key: 'perm-6', label: '콘텐츠 생성' },
  { key: 'perm-7', label: '콘텐츠 수정' },
  { key: 'perm-8', label: '콘텐츠 삭제' },
  { key: 'perm-9', label: '통계 조회' },
  { key: 'perm-10', label: '시스템 설정' },
]
const selectedPerms = ref<(string | number)[]>(['perm-1', 'perm-5'])

const handleFileError = (payload: { file: File; reason: string }) => {
  const reasonMap: Record<string, string> = {
    accept: '허용되지 않는 파일 형식입니다',
    maxSize: '파일 크기가 초과되었습니다 (최대 2MB)',
    maxFiles: '최대 파일 수를 초과했습니다',
  }
  fileError.value = `${payload.file.name}: ${reasonMap[payload.reason] ?? payload.reason}`
  setTimeout(() => { fileError.value = '' }, 3000)
}
</script>

<template>
  <div style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
    <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem;">Advanced Input</h1>

    <!-- DsDatePicker -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsDatePicker</h2>
      <p class="demo-section__subtitle">날짜를 선택하는 달력 피커입니다.</p>
      <div class="demo-row" style="align-items: flex-start; gap: 3rem; flex-wrap: wrap;">
        <div class="demo-column" style="gap: var(--ds-spacing-3, 0.75rem);">
          <p style="font-size: 0.75rem; color: var(--ds-on-surface-variant, #5a6970); margin: 0;">기본</p>
          <DsDatePicker v-model="basicDate" placeholder="날짜 선택" />
          <span class="demo-value">선택값: {{ basicDate || '없음' }}</span>
        </div>
        <div class="demo-column" style="gap: var(--ds-spacing-3, 0.75rem);">
          <p style="font-size: 0.75rem; color: var(--ds-on-surface-variant, #5a6970); margin: 0;">이번 달만 선택 가능 (min/max)</p>
          <DsDatePicker
            v-model="restrictedDate"
            placeholder="이번 달 날짜"
            :min-date="minDateStr"
            :max-date="maxDateStr"
          />
          <span class="demo-value">선택값: {{ restrictedDate || '없음' }}</span>
        </div>
      </div>
    </section>

    <!-- DsDateRangePicker -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsDateRangePicker</h2>
      <p class="demo-section__subtitle">시작일과 종료일 범위를 선택합니다.</p>
      <div class="demo-row" style="align-items: flex-start; gap: 3rem; flex-wrap: wrap;">
        <div class="demo-column" style="gap: var(--ds-spacing-3, 0.75rem);">
          <p style="font-size: 0.75rem; color: var(--ds-on-surface-variant, #5a6970); margin: 0;">기본</p>
          <DsDateRangePicker v-model="basicRange" />
          <span class="demo-value">
            {{ basicRange.start || '시작일' }} ~ {{ basicRange.end || '종료일' }}
          </span>
        </div>
        <div class="demo-column" style="gap: var(--ds-spacing-3, 0.75rem);">
          <p style="font-size: 0.75rem; color: var(--ds-on-surface-variant, #5a6970); margin: 0;">프리셋 포함</p>
          <DsDateRangePicker v-model="presetRange" />
          <span class="demo-value">
            {{ presetRange.start || '시작일' }} ~ {{ presetRange.end || '종료일' }}
          </span>
        </div>
      </div>
    </section>

    <!-- DsTagInput -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsTagInput</h2>
      <p class="demo-section__subtitle">Enter 또는 쉼표로 태그를 추가합니다.</p>
      <div class="demo-row" style="align-items: flex-start; gap: 3rem; flex-wrap: wrap;">
        <div class="demo-column" style="gap: var(--ds-spacing-3, 0.75rem); min-width: 300px;">
          <p style="font-size: 0.75rem; color: var(--ds-on-surface-variant, #5a6970); margin: 0;">기본</p>
          <DsTagInput v-model="basicTags" placeholder="태그 입력 후 Enter" />
          <span class="demo-value">태그 목록: {{ basicTags.join(', ') || '없음' }}</span>
        </div>
        <div class="demo-column" style="gap: var(--ds-spacing-3, 0.75rem); min-width: 300px;">
          <p style="font-size: 0.75rem; color: var(--ds-on-surface-variant, #5a6970); margin: 0;">최대 5개 제한</p>
          <DsTagInput v-model="limitedTags" :max-tags="5" placeholder="최대 5개까지" />
          <span class="demo-value">{{ limitedTags.length }} / 5개</span>
        </div>
      </div>
    </section>

    <!-- DsFileUpload -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsFileUpload</h2>
      <p class="demo-section__subtitle">드래그 앤 드롭 또는 클릭으로 파일을 업로드합니다.</p>
      <div class="demo-row" style="align-items: flex-start; gap: 3rem; flex-wrap: wrap;">
        <div class="demo-column" style="gap: var(--ds-spacing-3, 0.75rem); min-width: 280px;">
          <p style="font-size: 0.75rem; color: var(--ds-on-surface-variant, #5a6970); margin: 0;">기본 (다중 파일)</p>
          <DsFileUpload v-model="basicFiles" multiple />
          <span class="demo-value">{{ basicFiles.length }}개 파일 선택됨</span>
        </div>
        <div class="demo-column" style="gap: var(--ds-spacing-3, 0.75rem); min-width: 280px;">
          <p style="font-size: 0.75rem; color: var(--ds-on-surface-variant, #5a6970); margin: 0;">이미지만 (최대 2MB)</p>
          <DsFileUpload
            v-model="imageFiles"
            accept="image/*"
            :max-size="2 * 1024 * 1024"
            multiple
            @error="handleFileError"
          />
          <span class="demo-value">{{ imageFiles.length }}개 이미지 선택됨</span>
          <span v-if="fileError" style="font-size: 0.75rem; color: var(--ds-error, #d93025);">{{ fileError }}</span>
        </div>
      </div>
    </section>

    <!-- DsTreeSelect -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsTreeSelect</h2>
      <p class="demo-section__subtitle">트리 구조 데이터에서 항목을 선택합니다 (부서 목록).</p>
      <div class="demo-row" style="align-items: flex-start; gap: 3rem; flex-wrap: wrap;">
        <div class="demo-column" style="gap: var(--ds-spacing-3, 0.75rem); min-width: 260px;">
          <p style="font-size: 0.75rem; color: var(--ds-on-surface-variant, #5a6970); margin: 0;">단일 선택</p>
          <DsTreeSelect
            v-model="selectedDept"
            :data="treeData"
            mode="select"
            placeholder="부서 선택"
            searchable
          />
          <span class="demo-value">선택값: {{ selectedDept ?? '없음' }}</span>
        </div>
        <div class="demo-column" style="gap: var(--ds-spacing-3, 0.75rem); min-width: 260px;">
          <p style="font-size: 0.75rem; color: var(--ds-on-surface-variant, #5a6970); margin: 0;">다중 선택</p>
          <DsTreeSelect
            v-model="selectedMultiDept"
            :data="treeData"
            mode="select"
            multiple
            placeholder="부서 다중 선택"
            searchable
          />
          <span class="demo-value">선택값: {{ selectedMultiDept.length > 0 ? selectedMultiDept.join(', ') : '없음' }}</span>
        </div>
      </div>
    </section>

    <!-- DsTransfer -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsTransfer</h2>
      <p class="demo-section__subtitle">권한 목록에서 항목을 선택 패널로 이동합니다. 검색 가능합니다.</p>
      <DsTransfer
        v-model="selectedPerms"
        :data="transferData"
        :titles="['전체 권한', '부여된 권한']"
        searchable
      />
      <p class="demo-value" style="margin-top: var(--ds-spacing-3, 0.75rem);">
        부여된 권한 ({{ selectedPerms.length }}개): {{ selectedPerms.join(', ') || '없음' }}
      </p>
    </section>
  </div>
</template>

<style scoped>
.demo-section {
  margin-bottom: 3rem;
}

.demo-section__title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--ds-on-surface, #2a3439);
}

.demo-section__subtitle {
  font-size: 0.875rem;
  color: var(--ds-on-surface-variant, #5a6970);
  margin-bottom: 1rem;
}

.demo-row {
  display: flex;
  align-items: center;
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
