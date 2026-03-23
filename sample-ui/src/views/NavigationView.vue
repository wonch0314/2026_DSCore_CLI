<script setup lang="ts">
import { ref } from 'vue'
import {
  DsTabs,
  DsMenuTab,
  DsBreadcrumb,
  DsCard,
  DsCollapse,
  DsSteps,
  DsTimeline,
  DsButton,
} from 'dscore-ui-vue'

// --- DsTabs ---
const activeTab = ref('overview')
const tabs = [
  { key: 'overview', label: '개요' },
  { key: 'details', label: '상세 정보' },
  { key: 'history', label: '변경 이력' },
]

// --- DsMenuTab ---
const activeMenuTab = ref('tab-1')
const menuTabs = ref([
  { key: 'tab-1', label: '홈', closable: false },
  { key: 'tab-2', label: '대시보드', closable: true },
  { key: 'tab-3', label: '보고서', closable: true },
])
let menuTabCounter = menuTabs.value.length

function addMenuTab() {
  menuTabCounter++
  const key = `tab-${menuTabCounter}`
  menuTabs.value.push({ key, label: `새 탭 ${menuTabCounter}`, closable: true })
  activeMenuTab.value = key
}

function closeMenuTab(key: string | number) {
  const idx = menuTabs.value.findIndex(t => t.key === key)
  menuTabs.value.splice(idx, 1)
  if (activeMenuTab.value === key && menuTabs.value.length > 0) {
    activeMenuTab.value = menuTabs.value[Math.max(0, idx - 1)].key as string
  }
}

// --- DsBreadcrumb ---
const breadcrumbItems = [
  { label: '홈', href: '#' },
  { label: '관리', href: '#' },
  { label: '사용자 관리', href: '#' },
  { label: '상세' },
]

// --- DsCollapse ---
const faq1Open = ref(true)
const faq2Open = ref(false)
const faq3Open = ref(false)

// --- DsSteps ---
const currentStep = ref(1)
const steps = [
  { title: '정보 입력', description: '기본 정보를 입력하세요' },
  { title: '인증', description: '본인 인증을 완료하세요' },
  { title: '결제', description: '결제 정보를 입력하세요' },
  { title: '완료', description: '모든 절차가 완료되었습니다' },
]

function prevStep() {
  if (currentStep.value > 0) currentStep.value--
}
function nextStep() {
  if (currentStep.value < steps.length - 1) currentStep.value++
}

// --- DsTimeline ---
const timelineItems = [
  {
    title: '주문 접수',
    description: '주문이 정상적으로 접수되었습니다.',
    time: '2026-03-20 09:00',
    type: 'success',
  },
  {
    title: '결제 완료',
    description: '카드 결제가 승인되었습니다.',
    time: '2026-03-20 09:05',
    type: 'success',
  },
  {
    title: '배송 시작',
    description: '물류 센터에서 발송 준비 중입니다.',
    time: '2026-03-21 14:30',
    type: 'success',
  },
  {
    title: '배송 중',
    description: '택배사에서 배송 중입니다. (운송장: 1234-5678)',
    time: '2026-03-22 10:15',
    type: '',
  },
  {
    title: '배송 완료',
    description: '상품이 정상적으로 배달되었습니다.',
    time: '2026-03-23 14:00',
    type: '',
  },
]
</script>

<template>
  <div style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
    <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem;">Navigation & Layout</h1>

    <!-- DsBreadcrumb -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsBreadcrumb</h2>
      <p class="demo-section__subtitle">현재 페이지 위치를 계층 구조로 표시합니다.</p>
      <DsBreadcrumb :items="breadcrumbItems" separator=">" />
    </section>

    <!-- DsTabs -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsTabs</h2>
      <p class="demo-section__subtitle">콘텐츠를 탭으로 구분하여 표시합니다.</p>
      <DsTabs v-model="activeTab" :tabs="tabs">
        <template #panel-overview>
          <div class="demo-column" style="gap: 0.5rem;">
            <p style="font-size: 0.875rem; color: #2a3439; font-weight: 500;">개요 탭 콘텐츠</p>
            <p style="font-size: 0.875rem; color: #5a6970;">
              이 섹션에서는 프로젝트의 전체적인 개요와 현황을 확인할 수 있습니다.
              주요 지표와 최근 활동 내역을 한눈에 파악할 수 있습니다.
            </p>
          </div>
        </template>
        <template #panel-details>
          <div class="demo-column" style="gap: 0.5rem;">
            <p style="font-size: 0.875rem; color: #2a3439; font-weight: 500;">상세 정보 탭 콘텐츠</p>
            <p style="font-size: 0.875rem; color: #5a6970;">
              프로젝트의 상세 설정과 구성 정보를 확인하고 수정할 수 있습니다.
              각 항목을 클릭하면 더 자세한 정보를 볼 수 있습니다.
            </p>
          </div>
        </template>
        <template #panel-history>
          <div class="demo-column" style="gap: 0.5rem;">
            <p style="font-size: 0.875rem; color: #2a3439; font-weight: 500;">변경 이력 탭 콘텐츠</p>
            <p style="font-size: 0.875rem; color: #5a6970;">
              최근 30일간의 변경 이력을 확인할 수 있습니다.
              날짜, 변경자, 변경 내용이 기록됩니다.
            </p>
          </div>
        </template>
      </DsTabs>
    </section>

    <!-- DsMenuTab -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsMenuTab</h2>
      <p class="demo-section__subtitle">동적으로 탭을 추가하고 닫을 수 있는 메뉴 탭입니다.</p>
      <div class="demo-column" style="gap: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <DsMenuTab
            v-model="activeMenuTab"
            :tabs="menuTabs"
            @close="closeMenuTab"
            style="flex: 1;"
          />
          <DsButton @click="addMenuTab" style="white-space: nowrap; font-size: 0.75rem; padding: 0.4rem 0.75rem;">
            + 탭 추가
          </DsButton>
        </div>
        <div style="padding: 0.75rem 1rem; background: #f0f4f7; font-size: 0.875rem; color: #2a3439;">
          현재 활성 탭: <strong>{{ menuTabs.find(t => t.key === activeMenuTab)?.label }}</strong>
        </div>
      </div>
    </section>

    <!-- DsCard -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsCard</h2>
      <p class="demo-section__subtitle">다양한 형태의 카드 컴포넌트입니다.</p>
      <div class="demo-grid" style="grid-template-columns: repeat(3, 1fr);">
        <!-- Basic card -->
        <DsCard>
          <p style="font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem;">기본 카드</p>
          <p style="font-size: 0.875rem; color: #5a6970;">
            헤더와 푸터 없이 본문만 있는 기본 카드입니다.
            콘텐츠를 자유롭게 배치할 수 있습니다.
          </p>
        </DsCard>

        <!-- Card with header and footer -->
        <DsCard>
          <template #header>
            <p style="font-size: 1rem; font-weight: 600; margin: 0;">카드 제목</p>
          </template>
          <p style="font-size: 0.875rem; color: #5a6970; margin: 0;">
            헤더와 푸터가 있는 카드입니다. 제목과 액션 영역을 분리하여 구성할 수 있습니다.
          </p>
          <template #footer>
            <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
              <DsButton style="font-size: 0.75rem; padding: 0.25rem 0.75rem;">취소</DsButton>
              <DsButton style="font-size: 0.75rem; padding: 0.25rem 0.75rem;">확인</DsButton>
            </div>
          </template>
        </DsCard>

        <!-- Elevated card -->
        <DsCard>
          <div class="demo-column" style="gap: 0.5rem;">
            <p style="font-size: 0.875rem; font-weight: 500; margin: 0;">엘리베이티드 카드</p>
            <p style="font-size: 0.875rem; color: #5a6970; margin: 0;">
              그림자 효과로 카드에 입체감을 부여합니다. 주요 콘텐츠를 강조할 때 사용합니다.
            </p>
          </div>
        </DsCard>
      </div>
    </section>

    <!-- DsCollapse -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsCollapse</h2>
      <p class="demo-section__subtitle">FAQ 형식으로 내용을 접고 펼칠 수 있습니다.</p>
      <div class="demo-column" style="gap: 0.5rem;">
        <DsCollapse v-model="faq1Open">
          <template #header>
            <span style="font-size: 0.9rem; font-weight: 500;">배송은 얼마나 걸리나요?</span>
          </template>
          <p style="font-size: 0.875rem; color: #5a6970; margin: 0;">
            일반 배송은 주문 확인 후 영업일 기준 2~3일이 소요됩니다.
            도서 산간 지역의 경우 추가 1~2일이 더 소요될 수 있습니다.
            빠른 배송 옵션 선택 시 당일 또는 익일 배송이 가능합니다.
          </p>
        </DsCollapse>

        <DsCollapse v-model="faq2Open">
          <template #header>
            <span style="font-size: 0.9rem; font-weight: 500;">환불 정책은 어떻게 되나요?</span>
          </template>
          <p style="font-size: 0.875rem; color: #5a6970; margin: 0;">
            상품 수령 후 7일 이내에 반품 신청이 가능합니다.
            단순 변심의 경우 왕복 배송비는 고객 부담이며,
            상품 하자 또는 오배송의 경우 무료 반품이 가능합니다.
          </p>
        </DsCollapse>

        <DsCollapse v-model="faq3Open">
          <template #header>
            <span style="font-size: 0.9rem; font-weight: 500;">회원 등급 혜택은 무엇인가요?</span>
          </template>
          <p style="font-size: 0.875rem; color: #5a6970; margin: 0;">
            회원 등급은 브론즈, 실버, 골드, 플래티넘 4단계로 나뉩니다.
            등급에 따라 할인율, 포인트 적립률, 무료 배송 혜택이 달라집니다.
            전월 구매 금액 기준으로 매월 1일 등급이 갱신됩니다.
          </p>
        </DsCollapse>
      </div>
    </section>

    <!-- DsSteps -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsSteps</h2>
      <p class="demo-section__subtitle">4단계 마법사 형식의 진행 상태 표시입니다.</p>
      <div class="demo-column" style="gap: 1.5rem;">
        <DsSteps :steps="steps" :current="currentStep" direction="horizontal" />
        <div class="demo-row" style="gap: 0.75rem;">
          <DsButton :disabled="currentStep === 0" @click="prevStep">이전 단계</DsButton>
          <DsButton :disabled="currentStep === steps.length - 1" @click="nextStep">다음 단계</DsButton>
          <span class="demo-value">단계: {{ currentStep + 1 }} / {{ steps.length }} — {{ steps[currentStep].title }}</span>
        </div>
      </div>
    </section>

    <!-- DsTimeline -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsTimeline</h2>
      <p class="demo-section__subtitle">주문 진행 이력을 타임라인 형식으로 표시합니다.</p>
      <div style="max-width: 480px;">
        <DsTimeline :items="timelineItems" />
      </div>
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
  color: #2a3439;
}

.demo-section__subtitle {
  font-size: 0.875rem;
  color: #5a6970;
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
  color: #2a3439;
}

.demo-grid {
  display: grid;
  gap: 1rem;
}
</style>
