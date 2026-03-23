<script setup lang="ts">
import { ref } from 'vue'
import {
  DsDropdown,
  DsTooltip,
  DsPopover,
  DsDrawer,
  DsModal,
  DsButton,
  DsInput,
  DsSelect,
  DsFormItem,
} from 'dscore-ui-vue'

// Dropdown
const lastAction = ref('')

// Popover filter
const filterName = ref('')
const filterStatus = ref<string | number | null>(null)
const statusOptions = [
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
  { value: 'pending', label: '대기' },
]

// Drawer
const rightDrawerOpen = ref(false)
const leftDrawerOpen = ref(false)

// Modal
const smallModalOpen = ref(false)
const largeModalOpen = ref(false)
const confirmModalOpen = ref(false)
</script>

<template>
  <div style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
    <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem;">Overlay</h1>

    <!-- DsDropdown -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsDropdown</h2>
      <p class="demo-section__subtitle">트리거 버튼을 클릭하면 액션 메뉴가 나타납니다.</p>
      <div class="demo-row" style="align-items: flex-start; gap: 2rem; flex-wrap: wrap;">
        <div class="demo-column" style="gap: 0.75rem;">
          <DsDropdown>
            <template #trigger>
              <DsButton>액션 메뉴 열기</DsButton>
            </template>
            <div class="ds-dropdown__item" @click="lastAction = '수정'">수정</div>
            <div class="ds-dropdown__item" @click="lastAction = '복제'">복제</div>
            <div class="ds-dropdown__item" @click="lastAction = '이동'">이동</div>
            <div class="ds-dropdown__item" @click="lastAction = '삭제'" style="color: var(--ds-error, #d93025);">삭제</div>
          </DsDropdown>
          <span v-if="lastAction" class="demo-value">마지막 선택: {{ lastAction }}</span>
        </div>

        <div class="demo-column" style="gap: 0.75rem;">
          <p style="font-size: 0.75rem; color: var(--ds-on-surface-variant, #5a6970);">비활성 상태</p>
          <DsDropdown disabled>
            <template #trigger>
              <DsButton disabled>비활성 드롭다운</DsButton>
            </template>
            <div class="ds-dropdown__item">항목 1</div>
          </DsDropdown>
        </div>
      </div>
    </section>

    <!-- DsTooltip -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsTooltip</h2>
      <p class="demo-section__subtitle">4가지 방향으로 툴팁을 표시합니다. 버튼에 마우스를 올려보세요.</p>
      <div class="demo-row" style="gap: 1.5rem; flex-wrap: wrap; align-items: center; padding: 2rem 0;">
        <DsTooltip content="위쪽 툴팁입니다" position="top">
          <DsButton>Top</DsButton>
        </DsTooltip>
        <DsTooltip content="오른쪽 툴팁입니다" position="right">
          <DsButton>Right</DsButton>
        </DsTooltip>
        <DsTooltip content="아래쪽 툴팁입니다" position="bottom">
          <DsButton>Bottom</DsButton>
        </DsTooltip>
        <DsTooltip content="왼쪽 툴팁입니다" position="left">
          <DsButton>Left</DsButton>
        </DsTooltip>
        <DsTooltip content="지연 없이 바로 표시" :delay="0" position="top">
          <DsButton>No Delay</DsButton>
        </DsTooltip>
      </div>
    </section>

    <!-- DsPopover -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsPopover</h2>
      <p class="demo-section__subtitle">버튼을 클릭하면 팝오버 패널이 열립니다. 필터 폼 예시입니다.</p>
      <div class="demo-row" style="gap: 2rem; align-items: flex-start; flex-wrap: wrap; padding-bottom: 2rem;">
        <DsPopover position="bottom">
          <template #trigger>
            <DsButton>필터 설정</DsButton>
          </template>
          <div style="width: 280px; display: flex; flex-direction: column; gap: var(--ds-spacing-4, 1rem);">
            <p style="font-size: 0.875rem; font-weight: 600; margin: 0;">필터 조건</p>
            <DsFormItem label="이름">
              <DsInput v-model="filterName" placeholder="이름 입력" />
            </DsFormItem>
            <DsFormItem label="상태">
              <DsSelect v-model="filterStatus" :options="statusOptions" placeholder="상태 선택" />
            </DsFormItem>
            <div style="display: flex; gap: var(--ds-spacing-2, 0.5rem); justify-content: flex-end;">
              <DsButton class="ds-button--secondary" @click="filterName = ''; filterStatus = null">초기화</DsButton>
              <DsButton>적용</DsButton>
            </div>
          </div>
        </DsPopover>

        <DsPopover position="right">
          <template #trigger>
            <DsButton class="ds-button--secondary">오른쪽 팝오버</DsButton>
          </template>
          <div style="width: 200px;">
            <p style="font-size: 0.875rem; margin: 0;">오른쪽에서 열리는 팝오버입니다.</p>
          </div>
        </DsPopover>
      </div>
    </section>

    <!-- DsDrawer -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsDrawer</h2>
      <p class="demo-section__subtitle">우측 및 좌측 드로어를 열고 닫습니다.</p>
      <div class="demo-row" style="gap: 1rem;">
        <DsButton @click="rightDrawerOpen = true">우측 드로어 열기</DsButton>
        <DsButton class="ds-button--secondary" @click="leftDrawerOpen = true">좌측 드로어 열기</DsButton>
      </div>

      <!-- Right Drawer -->
      <DsDrawer v-model="rightDrawerOpen" position="right" width="420px">
        <template #header>
          <div>
            <h3 style="font-size: 1rem; font-weight: 600; margin: 0;">사용자 상세 정보</h3>
            <p style="font-size: 0.813rem; color: var(--ds-on-surface-variant, #5a6970); margin: 0.25rem 0 0;">우측에서 슬라이드로 열립니다</p>
          </div>
        </template>

        <div style="display: flex; flex-direction: column; gap: var(--ds-spacing-5, 1.25rem);">
          <DsFormItem label="이름">
            <DsInput placeholder="이름을 입력하세요" />
          </DsFormItem>
          <DsFormItem label="이메일">
            <DsInput placeholder="이메일을 입력하세요" type="email" />
          </DsFormItem>
          <DsFormItem label="부서">
            <DsSelect
              :options="[
                { value: 'dev', label: '개발팀' },
                { value: 'design', label: '디자인팀' },
                { value: 'pm', label: '기획팀' },
              ]"
              placeholder="부서 선택"
            />
          </DsFormItem>
          <DsFormItem label="직급">
            <DsInput placeholder="직급을 입력하세요" />
          </DsFormItem>
        </div>

        <template #footer>
          <div style="display: flex; gap: var(--ds-spacing-2, 0.5rem); justify-content: flex-end;">
            <DsButton class="ds-button--secondary" @click="rightDrawerOpen = false">취소</DsButton>
            <DsButton @click="rightDrawerOpen = false">저장</DsButton>
          </div>
        </template>
      </DsDrawer>

      <!-- Left Drawer -->
      <DsDrawer v-model="leftDrawerOpen" position="left" width="300px">
        <template #header>
          <h3 style="font-size: 1rem; font-weight: 600; margin: 0;">네비게이션 메뉴</h3>
        </template>

        <nav style="display: flex; flex-direction: column; gap: var(--ds-spacing-1, 0.25rem);">
          <div v-for="menu in ['대시보드', '사용자 관리', '콘텐츠 관리', '통계', '설정']" :key="menu"
            style="padding: var(--ds-spacing-3, 0.75rem) var(--ds-spacing-4, 1rem); cursor: pointer; border-radius: 0; font-size: 0.875rem;"
            @mouseenter="(e) => (e.target as HTMLElement).style.background = 'var(--ds-surface-container-low, rgba(169,180,185,0.08))'"
            @mouseleave="(e) => (e.target as HTMLElement).style.background = ''"
          >
            {{ menu }}
          </div>
        </nav>

        <template #footer>
          <DsButton class="ds-button--secondary" style="width: 100%;" @click="leftDrawerOpen = false">닫기</DsButton>
        </template>
      </DsDrawer>
    </section>

    <!-- DsModal -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsModal</h2>
      <p class="demo-section__subtitle">소형, 대형, 닫기 확인 모달의 세 가지 변형입니다.</p>
      <div class="demo-row" style="gap: 1rem; flex-wrap: wrap;">
        <DsButton @click="smallModalOpen = true">소형 모달</DsButton>
        <DsButton class="ds-button--secondary" @click="largeModalOpen = true">대형 모달</DsButton>
        <DsButton class="ds-button--secondary" @click="confirmModalOpen = true">닫기 확인 모달</DsButton>
      </div>

      <!-- Small Modal -->
      <DsModal v-model="smallModalOpen">
        <template #header>
          <span style="font-size: 1rem; font-weight: 600;">알림</span>
        </template>
        <div style="width: 320px;">
          <p style="font-size: 0.875rem; color: var(--ds-on-surface-variant, #5a6970); margin: 0;">
            작업이 완료되었습니다. 계속 진행하시겠습니까?
          </p>
        </div>
        <template #footer>
          <DsButton class="ds-button--secondary" @click="smallModalOpen = false">취소</DsButton>
          <DsButton @click="smallModalOpen = false">확인</DsButton>
        </template>
      </DsModal>

      <!-- Large Modal -->
      <DsModal v-model="largeModalOpen">
        <template #header>
          <span style="font-size: 1rem; font-weight: 600;">사용자 등록</span>
        </template>
        <div style="width: 600px; display: flex; flex-direction: column; gap: var(--ds-spacing-4, 1rem);">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--ds-spacing-4, 1rem);">
            <DsFormItem label="이름" required>
              <DsInput placeholder="이름 입력" />
            </DsFormItem>
            <DsFormItem label="이메일" required>
              <DsInput placeholder="이메일 입력" />
            </DsFormItem>
            <DsFormItem label="부서">
              <DsSelect
                :options="[
                  { value: 'dev', label: '개발팀' },
                  { value: 'design', label: '디자인팀' },
                  { value: 'pm', label: '기획팀' },
                ]"
                placeholder="부서 선택"
              />
            </DsFormItem>
            <DsFormItem label="직급">
              <DsInput placeholder="직급 입력" />
            </DsFormItem>
            <DsFormItem label="전화번호">
              <DsInput placeholder="010-0000-0000" />
            </DsFormItem>
            <DsFormItem label="입사일">
              <DsInput placeholder="YYYY-MM-DD" />
            </DsFormItem>
          </div>
          <DsFormItem label="비고">
            <DsInput placeholder="메모 입력" />
          </DsFormItem>
        </div>
        <template #footer>
          <DsButton class="ds-button--secondary" @click="largeModalOpen = false">취소</DsButton>
          <DsButton @click="largeModalOpen = false">등록</DsButton>
        </template>
      </DsModal>

      <!-- Confirm Before Close Modal -->
      <DsModal
        v-model="confirmModalOpen"
        :confirm-before-close="true"
        confirm-message="입력한 내용이 있습니다. 정말 닫으시겠습니까?"
      >
        <template #header>
          <span style="font-size: 1rem; font-weight: 600;">닫기 확인 (confirmBeforeClose)</span>
        </template>
        <div style="width: 440px; display: flex; flex-direction: column; gap: var(--ds-spacing-4, 1rem);">
          <p style="font-size: 0.875rem; color: var(--ds-on-surface-variant, #5a6970); margin: 0;">
            X 버튼이나 오버레이를 클릭하면 브라우저 confirm 다이얼로그가 표시됩니다.
          </p>
          <DsFormItem label="중요 데이터">
            <DsInput placeholder="무언가를 입력하세요" />
          </DsFormItem>
        </div>
        <template #footer>
          <DsButton class="ds-button--secondary" @click="confirmModalOpen = false">취소</DsButton>
          <DsButton @click="confirmModalOpen = false">저장</DsButton>
        </template>
      </DsModal>
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
