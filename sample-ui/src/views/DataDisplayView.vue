<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  DsTable,
  DsPagination,
  DsEmpty,
  DsStatusTag,
  DsBadge,
  DsAvatar,
  DsDescription,
  DsStatCard,
  DsButton,
} from 'dscore-ui-vue'

// --- Table ---
const rawTableData = [
  { id: 1, name: '김철수', email: 'kim@example.com', status: 'active', date: '2026-03-20' },
  { id: 2, name: '이영희', email: 'lee@example.com', status: 'pending', date: '2026-03-19' },
  { id: 3, name: '박민수', email: 'park@example.com', status: 'inactive', date: '2026-03-18' },
  { id: 4, name: '정수진', email: 'jung@example.com', status: 'active', date: '2026-03-17' },
  { id: 5, name: '최동욱', email: 'choi@example.com', status: 'rejected', date: '2026-03-16' },
  { id: 6, name: '한지민', email: 'han@example.com', status: 'active', date: '2026-03-15' },
  { id: 7, name: '오승환', email: 'oh@example.com', status: 'pending', date: '2026-03-14' },
  { id: 8, name: '서유진', email: 'seo@example.com', status: 'active', date: '2026-03-13' },
]

const tableData = ref<typeof rawTableData>([])
const tableLoading = ref(true)

onMounted(() => {
  // 5초 후 데이터 로딩 시뮬레이션
  setTimeout(() => {
    tableData.value = rawTableData
    tableLoading.value = false
  }, 5000)
})

const tableColumns = [
  { key: 'id', label: 'ID', width: '60px', sortable: true, fixed: 'left' as const },
  { key: 'name', label: '이름', sortable: true, fixed: 'left' as const },
  { key: 'email', label: '이메일', sortable: true },
  { key: 'status', label: '상태' },
  { key: 'date', label: '가입일', sortable: true },
  { key: 'actions', label: '액션', width: '120px', fixed: 'right' as const },
]

const selectedRows = ref<number[]>([])
const sortKey = ref('')
const sortOrder = ref<'asc' | 'desc' | ''>('')

// 클라이언트 사이드 정렬
const sortedTableData = computed(() => {
  if (!sortKey.value || !sortOrder.value) return tableData.value
  const key = sortKey.value
  const order = sortOrder.value
  return [...tableData.value].sort((a: any, b: any) => {
    const valA = a[key]
    const valB = b[key]
    if (valA == null) return 1
    if (valB == null) return -1
    if (typeof valA === 'number' && typeof valB === 'number') {
      return order === 'asc' ? valA - valB : valB - valA
    }
    const strA = String(valA).toLowerCase()
    const strB = String(valB).toLowerCase()
    if (strA < strB) return order === 'asc' ? -1 : 1
    if (strA > strB) return order === 'asc' ? 1 : -1
    return 0
  })
})

const statusLabelMap: Record<string, string> = {
  active: '활성',
  inactive: '비활성',
  pending: '대기',
  rejected: '반려',
  completed: '완료',
}

// --- 코드 예시 토글 ---
const showTableCode = ref(false)

// --- Pagination ---
const currentPage = ref(1)
const pageSize = 10
const totalItems = 57

// --- Description ---
const descItems2col = [
  { label: '이름', value: '김철수' },
  { label: '이메일', value: 'kim@example.com' },
  { label: '전화번호', value: '010-1234-5678' },
  { label: '부서', value: '개발팀' },
  { label: '직급', value: '선임 개발자' },
  { label: '가입일', value: '2026-01-15' },
]

const descItems3col = [
  { label: '이름', value: '이영희' },
  { label: '이메일', value: 'lee@example.com' },
  { label: '전화번호', value: '010-9876-5432' },
  { label: '부서', value: '디자인팀' },
  { label: '직급', value: '수석 디자이너' },
  { label: '가입일', value: '2026-02-10' },
]
</script>

<template>
  <div style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
    <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem;">Data Display</h1>

    <!-- DsStatCard -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsStatCard</h2>
      <p class="demo-section__subtitle">주요 지표를 카드 형식으로 표시합니다.</p>
      <div class="demo-grid" style="grid-template-columns: repeat(4, 1fr);">
        <DsStatCard title="총 회원수" value="12,456" :change="12.5" />
        <DsStatCard title="신규 가입" value="342" :change="8.2" />
        <DsStatCard title="매출" value="₩45,230,000" :change="-3.1" />
        <DsStatCard title="방문자" value="8,721" :change="15.7" />
      </div>
    </section>

    <!-- DsTable -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsTable</h2>
      <p class="demo-section__subtitle">선택 가능하고 정렬 가능한 데이터 테이블입니다. ID/이름 컬럼은 좌측 고정, 액션 컬럼은 우측 고정됩니다. 페이지 진입 후 5초간 로딩 상태를 시뮬레이션합니다.</p>
      <DsTable
        :data="sortedTableData"
        :columns="tableColumns"
        selectable
        sortable
        :loading="tableLoading"
        v-model:selected="selectedRows"
        v-model:sort-key="sortKey"
        v-model:sort-order="sortOrder"
      >
        <template #cell-status="{ row }">
          <DsStatusTag v-if="row" :status="row.status">
            {{ statusLabelMap[row.status] ?? row.status }}
          </DsStatusTag>
        </template>
        <template #cell-actions="{ row }">
          <div v-if="row" style="display: flex; gap: 0.5rem;">
            <DsButton style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">편집</DsButton>
            <DsButton style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">삭제</DsButton>
          </div>
        </template>
      </DsTable>
      <p style="font-size: 0.875rem; color: #5a6970; margin-top: 0.5rem;">
        선택된 행 ID: {{ selectedRows.length > 0 ? selectedRows.join(', ') : '없음' }}
        <span v-if="sortKey"> · 정렬: {{ sortKey }} ({{ sortOrder }})</span>
      </p>

      <!-- 코드 예시 -->
      <button class="demo-code-toggle" @click="showTableCode = !showTableCode">
        {{ showTableCode ? '코드 숨기기' : '코드 보기' }}
      </button>
      <div v-show="showTableCode" class="demo-code">
        <pre v-pre><code>&lt;script setup lang="ts"&gt;
import { ref, computed, onMounted } from 'vue'
import { DsTable, DsStatusTag, DsButton } from 'dscore-ui-vue'

const tableData = ref([])
const tableLoading = ref(true)
const sortKey = ref('')
const sortOrder = ref('')

onMounted(() =&gt; {
  // API 호출 시뮬레이션
  setTimeout(() =&gt; {
    tableData.value = [...] // 서버에서 받은 데이터
    tableLoading.value = false
  }, 5000)
})

const columns = [
  { key: 'id', label: 'ID', width: '60px', sortable: true, fixed: 'left' },
  { key: 'name', label: '이름', sortable: true, fixed: 'left' },
  { key: 'email', label: '이메일', sortable: true },
  { key: 'status', label: '상태' },
  { key: 'date', label: '가입일', sortable: true },
]

// 클라이언트 사이드 정렬
const sortedData = computed(() =&gt; {
  if (!sortKey.value || !sortOrder.value) return tableData.value
  return [...tableData.value].sort((a, b) =&gt; {
    const valA = a[sortKey.value]
    const valB = b[sortKey.value]
    if (valA &lt; valB) return sortOrder.value === 'asc' ? -1 : 1
    if (valA &gt; valB) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})
&lt;/script&gt;

&lt;template&gt;
  &lt;DsTable
    :data="sortedData"
    :columns="columns"
    selectable
    sortable
    :loading="tableLoading"
    v-model:sort-key="sortKey"
    v-model:sort-order="sortOrder"
  &gt;
    &lt;template #cell-status="{ row }"&gt;
      &lt;DsStatusTag :status="row.status"&gt;{{ row.status }}&lt;/DsStatusTag&gt;
    &lt;/template&gt;
  &lt;/DsTable&gt;
&lt;/template&gt;</code></pre>
      </div>
    </section>

    <!-- DsPagination -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsPagination</h2>
      <p class="demo-section__subtitle">페이지 이동을 위한 페이지네이션입니다.</p>
      <div class="demo-row" style="align-items: center; gap: 1.5rem; flex-wrap: wrap;">
        <DsPagination
          v-model="currentPage"
          :total="totalItems"
          :page-size="pageSize"
        />
        <span class="demo-value">현재 페이지: {{ currentPage }} / {{ Math.ceil(totalItems / pageSize) }}</span>
      </div>
    </section>

    <!-- DsEmpty -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsEmpty</h2>
      <p class="demo-section__subtitle">데이터가 없는 빈 상태를 표시합니다.</p>
      <div class="demo-row" style="gap: 2rem; flex-wrap: wrap; align-items: flex-start;">
        <!-- Basic -->
        <div style="flex: 1; min-width: 200px; border: 1px solid rgba(169,180,185,0.2); padding: 1rem;">
          <p style="font-size: 0.75rem; color: #5a6970; margin-bottom: 0.5rem;">기본</p>
          <DsEmpty title="데이터가 없습니다" description="조건에 맞는 항목이 없습니다." />
        </div>
        <!-- With icon slot -->
        <div style="flex: 1; min-width: 200px; border: 1px solid rgba(169,180,185,0.2); padding: 1rem;">
          <p style="font-size: 0.75rem; color: #5a6970; margin-bottom: 0.5rem;">아이콘 슬롯</p>
          <DsEmpty title="검색 결과 없음" description="다른 검색어로 시도해 보세요.">
            <template #icon>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </template>
          </DsEmpty>
        </div>
        <!-- With action slot -->
        <div style="flex: 1; min-width: 200px; border: 1px solid rgba(169,180,185,0.2); padding: 1rem;">
          <p style="font-size: 0.75rem; color: #5a6970; margin-bottom: 0.5rem;">액션 슬롯</p>
          <DsEmpty title="항목이 없습니다" description="새 항목을 추가해 시작하세요.">
            <template #action>
              <DsButton>새 항목 추가</DsButton>
            </template>
          </DsEmpty>
        </div>
      </div>
    </section>

    <!-- DsStatusTag -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsStatusTag</h2>
      <p class="demo-section__subtitle">상태를 시각적으로 표시하는 태그입니다.</p>
      <div class="demo-row" style="flex-wrap: wrap; gap: 0.75rem;">
        <DsStatusTag status="active">활성</DsStatusTag>
        <DsStatusTag status="inactive">비활성</DsStatusTag>
        <DsStatusTag status="pending">대기</DsStatusTag>
        <DsStatusTag status="rejected">반려</DsStatusTag>
        <DsStatusTag status="completed">완료</DsStatusTag>
      </div>
    </section>

    <!-- DsBadge -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsBadge</h2>
      <p class="demo-section__subtitle">알림 수, 점 형태, 아바타에 적용한 뱃지입니다.</p>
      <div class="demo-row" style="align-items: center; gap: 2rem; flex-wrap: wrap;">
        <div class="demo-column" style="align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.75rem; color: #5a6970;">숫자 뱃지</span>
          <DsBadge :value="5">
            <div style="width: 40px; height: 40px; background: #e8eff3; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">알림</div>
          </DsBadge>
        </div>
        <div class="demo-column" style="align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.75rem; color: #5a6970;">최대 초과 (99+)</span>
          <DsBadge :value="120" :max="99">
            <div style="width: 40px; height: 40px; background: #e8eff3; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">메일</div>
          </DsBadge>
        </div>
        <div class="demo-column" style="align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.75rem; color: #5a6970;">점 모드</span>
          <DsBadge dot>
            <div style="width: 40px; height: 40px; background: #e8eff3; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">채팅</div>
          </DsBadge>
        </div>
        <div class="demo-column" style="align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.75rem; color: #5a6970;">아바타에 적용</span>
          <DsBadge :value="3">
            <DsAvatar name="김철수" size="2.5rem" />
          </DsBadge>
        </div>
      </div>
    </section>

    <!-- DsAvatar -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsAvatar</h2>
      <p class="demo-section__subtitle">이미지, 이니셜, 다양한 크기의 아바타입니다.</p>
      <div class="demo-row" style="align-items: flex-end; gap: 1.5rem; flex-wrap: wrap;">
        <div class="demo-column" style="align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.75rem; color: #5a6970;">이미지</span>
          <DsAvatar src="https://i.pravatar.cc/100?img=1" alt="사용자 1" size="3rem" />
        </div>
        <div class="demo-column" style="align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.75rem; color: #5a6970;">이니셜 폴백</span>
          <DsAvatar name="김철수" size="3rem" />
        </div>
        <div class="demo-column" style="align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.75rem; color: #5a6970;">소형 (2rem)</span>
          <DsAvatar src="https://i.pravatar.cc/100?img=2" alt="사용자 2" size="2rem" />
        </div>
        <div class="demo-column" style="align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.75rem; color: #5a6970;">중형 (3rem)</span>
          <DsAvatar src="https://i.pravatar.cc/100?img=3" alt="사용자 3" size="3rem" />
        </div>
        <div class="demo-column" style="align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.75rem; color: #5a6970;">대형 (5rem)</span>
          <DsAvatar src="https://i.pravatar.cc/100?img=4" alt="사용자 4" size="5rem" />
        </div>
        <div class="demo-column" style="align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.75rem; color: #5a6970;">이니셜 (대형)</span>
          <DsAvatar name="이영희" size="5rem" />
        </div>
      </div>
    </section>

    <!-- DsDescription -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsDescription</h2>
      <p class="demo-section__subtitle">상세 정보를 레이블-값 쌍으로 표시합니다.</p>

      <div class="demo-column" style="gap: 1.5rem;">
        <div>
          <p style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.75rem;">2열 레이아웃</p>
          <DsDescription :items="descItems2col" :columns="2" layout="vertical" />
        </div>
        <div>
          <p style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.75rem;">3열 레이아웃</p>
          <DsDescription :items="descItems3col" :columns="3" layout="vertical" />
        </div>
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

.demo-code-toggle {
  margin-top: 1rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  color: #5a6970;
  background: #f0f4f7;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background 150ms;
}
.demo-code-toggle:hover {
  background: #e4eaef;
}

.demo-code {
  margin-top: 0.75rem;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 0.375rem;
  overflow: hidden;
}
.demo-code pre {
  margin: 0;
  padding: 1rem;
  background: #1e1e2e;
  overflow-x: auto;
}
.demo-code code {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.8rem;
  line-height: 1.6;
  color: #cdd6f4;
  white-space: pre;
}
</style>
