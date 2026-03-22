<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  DsSpinner,
  DsButton,
  DsInput,
  DsModal,
  DsTextarea,
  DsSelect,
  DsCheckbox,
  DsRadio,
  DsRadioGroup,
  DsSwitch,
  DsNumberInput,
  DsFormItem,
  DsForm,
  DsAlert,
  DsProgress,
  DsSkeleton
} from 'dscore-ui-vue'

// State
const isModalOpen = ref(false)
const loading = ref(false)
const progress = ref(65)

// Form data
const form = reactive({
  name: '',
  email: '',
  description: '',
  status: null as string | null,
  category: 'A',
  agree: false,
  notifications: true,
  quantity: 1
})

// Options
const statusOptions = [
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
  { value: 'pending', label: '대기중', description: '승인 대기' }
]

const categoryOptions = [
  { value: 'A', label: '카테고리 A' },
  { value: 'B', label: '카테고리 B' },
  { value: 'C', label: '카테고리 C', disabled: true }
]

// Handlers
const handleAsyncClick = async () => {
  // 2초 후 완료 (자동 로딩 상태)
  await new Promise(resolve => setTimeout(resolve, 2000))
  console.log('Async action completed!')
}

const handleSyncClick = () => {
  console.log('Sync action!')
}

const handleSubmit = () => {
  console.log('Form submitted:', form)
  isModalOpen.value = false
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>dscore-ui-vue Sample</h1>
      <p>Vue 3 UI Component Library Demo</p>
    </header>

    <main class="main">
      <!-- Section: Spinner -->
      <section class="section">
        <h2>DsSpinner</h2>
        <div class="demo-row">
          <DsSpinner size="sm" />
          <DsSpinner size="md" />
          <DsSpinner size="lg" />
        </div>
      </section>

      <!-- Section: Button -->
      <section class="section">
        <h2>DsButton</h2>
        <div class="demo-row">
          <DsButton @click="handleSyncClick">기본 버튼</DsButton>
          <DsButton @click="handleAsyncClick">비동기 버튼 (자동 로딩)</DsButton>
          <DsButton :show-success="true" @click="handleAsyncClick">성공 아이콘</DsButton>
          <DsButton :disabled="true">비활성화</DsButton>
          <DsButton :loading="true">수동 로딩</DsButton>
        </div>
      </section>

      <!-- Section: Input -->
      <section class="section">
        <h2>DsInput</h2>
        <div class="demo-column">
          <DsInput v-model="form.name" placeholder="이름 입력" />
          <DsInput v-model="form.email" type="email" placeholder="이메일 입력" />
          <DsInput model-value="" placeholder="읽기 전용" :readonly="true" />
          <DsInput model-value="" :error="true" error-message="필수 입력 항목입니다" placeholder="에러 상태" />
        </div>
      </section>

      <!-- Section: Textarea -->
      <section class="section">
        <h2>DsTextarea</h2>
        <div class="demo-column">
          <DsTextarea v-model="form.description" placeholder="설명 입력" :rows="3" />
          <DsTextarea v-model="form.description" :auto-resize="true" placeholder="자동 높이 조절" />
          <DsTextarea v-model="form.description" :max-length="100" :show-count="true" placeholder="글자 수 제한" />
        </div>
      </section>

      <!-- Section: Select -->
      <section class="section">
        <h2>DsSelect</h2>
        <div class="demo-column">
          <DsSelect v-model="form.status" :options="statusOptions" placeholder="상태 선택" />
          <DsSelect v-model="form.status" :options="statusOptions" :searchable="true" placeholder="검색 가능" />
          <DsSelect v-model="form.status" :options="statusOptions" :clearable="true" placeholder="초기화 가능" />
        </div>
        <p class="demo-value">선택된 값: {{ form.status ?? '없음' }}</p>
      </section>

      <!-- Section: Checkbox -->
      <section class="section">
        <h2>DsCheckbox</h2>
        <div class="demo-row">
          <DsCheckbox v-model="form.agree">약관에 동의합니다</DsCheckbox>
          <DsCheckbox :model-value="false" :disabled="true">비활성화</DsCheckbox>
          <DsCheckbox :model-value="true" :indeterminate="true">불확정 상태</DsCheckbox>
        </div>
        <p class="demo-value">동의 여부: {{ form.agree }}</p>
      </section>

      <!-- Section: Radio -->
      <section class="section">
        <h2>DsRadio / DsRadioGroup</h2>
        <div class="demo-column">
          <div class="demo-row">
            <DsRadio v-model="form.category" value="A">카테고리 A</DsRadio>
            <DsRadio v-model="form.category" value="B">카테고리 B</DsRadio>
          </div>
          <DsRadioGroup v-model="form.category" :options="categoryOptions" direction="horizontal" />
        </div>
        <p class="demo-value">선택된 카테고리: {{ form.category }}</p>
      </section>

      <!-- Section: Switch -->
      <section class="section">
        <h2>DsSwitch</h2>
        <div class="demo-row">
          <DsSwitch v-model="form.notifications" />
          <DsSwitch v-model="form.notifications">알림 받기</DsSwitch>
          <DsSwitch :model-value="false" :disabled="true">비활성화</DsSwitch>
        </div>
        <p class="demo-value">알림 설정: {{ form.notifications }}</p>
      </section>

      <!-- Section: NumberInput -->
      <section class="section">
        <h2>DsNumberInput</h2>
        <div class="demo-column">
          <DsNumberInput v-model="form.quantity" :min="1" :max="100" />
          <DsNumberInput v-model="form.quantity" :step="5" placeholder="5단위 증감" />
          <DsNumberInput :model-value="99.99" :precision="2" placeholder="소수점 2자리" />
        </div>
        <p class="demo-value">수량: {{ form.quantity }}</p>
      </section>

      <!-- Section: Form -->
      <section class="section">
        <h2>DsForm / DsFormItem</h2>
        <DsForm @submit="handleSubmit" class="demo-form">
          <DsFormItem label="이름" :required="true">
            <DsInput v-model="form.name" placeholder="이름 입력" />
          </DsFormItem>
          <DsFormItem label="이메일" error="올바른 이메일을 입력하세요">
            <DsInput v-model="form.email" type="email" placeholder="이메일 입력" />
          </DsFormItem>
          <DsFormItem label="설명">
            <DsTextarea v-model="form.description" placeholder="설명 입력" />
          </DsFormItem>
          <DsButton type="submit">제출</DsButton>
        </DsForm>
      </section>

      <!-- Section: Alert -->
      <section class="section">
        <h2>DsAlert</h2>
        <div class="demo-column">
          <DsAlert type="success">성공 메시지입니다</DsAlert>
          <DsAlert type="error" :closable="true">에러 메시지입니다</DsAlert>
          <DsAlert type="warning">경고 메시지입니다</DsAlert>
          <DsAlert type="info">안내 메시지입니다</DsAlert>
        </div>
      </section>

      <!-- Section: Progress -->
      <section class="section">
        <h2>DsProgress</h2>
        <div class="demo-column">
          <DsProgress :value="progress" />
          <DsProgress :value="progress" :show-text="true" />
          <DsProgress :value="100" status="success" :show-text="true" />
          <DsProgress :value="30" status="error" :show-text="true" />
        </div>
        <input type="range" v-model.number="progress" min="0" max="100" class="demo-range" />
      </section>

      <!-- Section: Skeleton -->
      <section class="section">
        <h2>DsSkeleton</h2>
        <div class="demo-row skeleton-demo">
          <DsSkeleton type="circle" :width="60" :height="60" />
          <div class="skeleton-content">
            <DsSkeleton :rows="1" :width="150" />
            <DsSkeleton :rows="2" />
          </div>
        </div>
        <div class="demo-row">
          <DsSkeleton type="rect" :width="200" :height="120" />
          <DsSkeleton type="rect" :width="200" :height="120" />
          <DsSkeleton type="rect" :width="200" :height="120" />
        </div>
      </section>

      <!-- Section: Modal -->
      <section class="section">
        <h2>DsModal</h2>
        <DsButton @click="isModalOpen = true">모달 열기</DsButton>

        <DsModal v-model="isModalOpen" title="모달 제목">
          <p>모달 내용입니다. ESC 키나 오버레이 클릭으로 닫을 수 있습니다.</p>
          <DsInput v-model="form.name" placeholder="이름 입력" />

          <template #footer>
            <DsButton @click="isModalOpen = false">취소</DsButton>
            <DsButton @click="handleSubmit">확인</DsButton>
          </template>
        </DsModal>
      </section>
    </main>

    <footer class="footer">
      <p>dscore-ui-vue &copy; 2026</p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
}

.header h1 {
  margin: 0 0 0.5rem;
  font-size: 2rem;
}

.header p {
  margin: 0;
  opacity: 0.9;
}

.main {
  flex: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}

.section {
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section h2 {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  color: #1f2937;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.demo-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.demo-value {
  margin-top: 1rem;
  padding: 0.5rem;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #6b7280;
}

.demo-form {
  max-width: 400px;
}

.demo-range {
  width: 100%;
  margin-top: 1rem;
}

.skeleton-demo {
  align-items: flex-start;
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer {
  text-align: center;
  padding: 1rem;
  background: #f9fafb;
  color: #6b7280;
  font-size: 0.875rem;
}
</style>
