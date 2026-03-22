# dscore-ui-vue Skill Guide

> Vue 3 UI Component Library (18개 컴포넌트) - dscore-starter-vue 기반

## 설치

```bash
npm install dscore-ui-vue dscore-starter-vue
```

## 컴포넌트 요약

| 구분 | 컴포넌트 | 파일 |
|------|----------|------|
| **Core** | DsSpinner, DsButton, DsInput, DsModal | [guide.md](./guide.md#phase-1-core) |
| **Form** | DsTextarea, DsSelect, DsCheckbox, DsRadio, DsRadioGroup, DsSwitch, DsNumberInput, DsFormItem, DsForm | [guide.md](./guide.md#phase-2-form) |
| **Feedback** | DsToast, DsConfirm, DsAlert, DsProgress, DsSkeleton | [guide.md](./guide.md#phase-3-feedback) |

## 전체 Import

```typescript
import {
  // Plugin
  DsCore,

  // Phase 1: Core
  DsSpinner,
  DsButton,
  DsInput,
  DsModal,

  // Phase 2: Form
  DsTextarea,
  DsSelect,
  DsCheckbox,
  DsRadio,
  DsRadioGroup,
  DsSwitch,
  DsNumberInput,
  DsFormItem,
  DsForm,

  // Phase 3: Feedback
  DsToast,
  useToast,
  DsConfirm,
  useConfirm,
  DsAlert,
  DsProgress,
  DsSkeleton,

  // Types
  type DsCoreOptions,
  type DsButtonProps,
  type DsInputProps,
  type DsModalProps,
  type DsSelectProps,
  // ...
} from 'dscore-ui-vue'
```

## 빠른 참조

### 플러그인 설정

```typescript
// main.ts
import { createApp } from 'vue'
import { DsCore } from 'dscore-ui-vue'
import App from './App.vue'

const app = createApp(App)

app.use(DsCore, {
  // 전역 스피너
  spinner: MyCustomSpinner,

  // 전역 아이콘
  icons: {
    success: CheckIcon,
    error: XIcon,
    warning: AlertIcon,
    close: CloseIcon,
    arrow: ChevronDownIcon
  },

  // 컴포넌트 기본값
  defaults: {
    button: { throttle: 300, showSuccess: false },
    modal: { closeOnEscape: true, closeOnOverlay: true },
    toast: { duration: 3000, position: 'top-right' }
  }
})

app.mount('#app')
```

### 자주 사용하는 패턴

```vue
<template>
  <!-- 버튼: 비동기 클릭 자동 로딩 -->
  <DsButton @click="handleSave">저장</DsButton>
  <DsButton :show-success="true" @click="handleSave">저장 (성공 아이콘)</DsButton>

  <!-- 입력 필드 -->
  <DsInput v-model="form.name" placeholder="이름" />
  <DsInput v-model="form.email" type="email" :error="!!errors.email" :error-message="errors.email" />

  <!-- 셀렉트: 개별 옵션 스타일링 -->
  <DsSelect v-model="form.status" :options="statusOptions" :searchable="true" />

  <!-- 체크박스 / 라디오 -->
  <DsCheckbox v-model="form.agree">약관 동의</DsCheckbox>
  <DsRadioGroup v-model="form.type" :options="typeOptions" direction="horizontal" />

  <!-- 모달 -->
  <DsModal v-model="isOpen" title="확인" :confirm-before-close="isDirty">
    <p>내용</p>
    <template #footer>
      <DsButton @click="isOpen = false">취소</DsButton>
      <DsButton @click="handleSubmit">확인</DsButton>
    </template>
  </DsModal>

  <!-- 알림 -->
  <DsAlert type="success" :closable="true">저장되었습니다</DsAlert>

  <!-- 진행률 -->
  <DsProgress :value="progress" :show-text="true" />

  <!-- 스켈레톤 -->
  <DsSkeleton v-if="loading" :rows="3" />
</template>

<script setup>
import { ref } from 'vue'
import {
  DsButton, DsInput, DsSelect, DsCheckbox, DsRadioGroup,
  DsModal, DsAlert, DsProgress, DsSkeleton,
  useToast, useConfirm
} from 'dscore-ui-vue'

const toast = useToast()
const confirm = useConfirm()

const form = ref({ name: '', email: '', status: null, type: 'A', agree: false })
const isOpen = ref(false)
const isDirty = ref(false)
const loading = ref(true)
const progress = ref(50)

const statusOptions = [
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
  { value: 'pending', label: '대기중' }
]

const typeOptions = [
  { value: 'A', label: '타입 A' },
  { value: 'B', label: '타입 B' }
]

// 비동기 함수 → 자동 로딩 처리
const handleSave = async () => {
  await api.save(form.value)
  toast.success('저장되었습니다')
}

const handleDelete = async () => {
  const confirmed = await confirm({
    title: '삭제 확인',
    message: '정말 삭제하시겠습니까?',
    type: 'danger'
  })
  if (confirmed) {
    await api.delete(id)
    toast.success('삭제되었습니다')
  }
}
</script>

<style>
/* 옵션별 스타일링 */
.ds-select-option-active { color: green; }
.ds-select-option-inactive { color: gray; }
.ds-select-option-pending { color: orange; }
</style>
```

### CSS 커스터마이징

```css
/* 버튼 */
.ds-button { background: var(--primary); border-radius: 8px; }
.ds-button--loading { opacity: 0.7; }

/* 입력 필드 */
.ds-input { border: 1px solid #e5e7eb; border-radius: 6px; }
.ds-input--error { border-color: #ef4444; }

/* 모달 */
.ds-modal-overlay { background: rgba(0, 0, 0, 0.5); }
.ds-modal-content { border-radius: 12px; }

/* 셀렉트 */
.ds-select-option { padding: 8px 12px; }
.ds-select-option--selected { background: #eff6ff; }
.ds-select-option--highlighted { background: #f3f4f6; }
```

## 설계 원칙

1. **스타일 자유도**: 모든 컴포넌트에 고정 class 제공, CSS로 자유롭게 스타일링
2. **커스터마이징 우선순위**: prop > 전역 설정 > 기본값
3. **비동기 자동 감지**: DsButton은 async 클릭 핸들러를 자동 감지하여 로딩 상태 관리
4. **dscore-starter-vue 통합**: useToast, useConfirm 등 composables 활용
