<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  DsBreadcrumb,
  DsStatCard,
  DsSearchBar,
  DsFormItem,
  DsInput,
  DsSelect,
  DsDateRangePicker,
  DsActionBar,
  DsButton,
  DsTable,
  DsStatusTag,
  DsDropdown,
  DsPagination,
  DsModal,
  DsDrawer,
} from 'dscore-ui-vue'

// Breadcrumb
const breadcrumbItems = [
  { label: '홈', href: '/' },
  { label: '사용자 관리' },
]

// Search form
const searchName = ref('')
const searchStatus = ref<string | number | null>(null)
const searchDateRange = ref<{ start: string; end: string }>({ start: '', end: '' })
const isSearching = ref(false)

const statusOptions = [
  { value: '', label: '전체' },
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
  { value: 'pending', label: '대기' },
]

// Table data
const allUsers = ref([
  { id: 1,  name: '김철수', email: 'kim.cs@company.com',    status: 'active',   joinDate: '2025-01-15', dept: '개발팀' },
  { id: 2,  name: '이영희', email: 'lee.yh@company.com',    status: 'active',   joinDate: '2025-02-03', dept: '디자인팀' },
  { id: 3,  name: '박민준', email: 'park.mj@company.com',   status: 'inactive', joinDate: '2025-02-18', dept: '개발팀' },
  { id: 4,  name: '정수진', email: 'jung.sj@company.com',   status: 'active',   joinDate: '2025-03-07', dept: '기획팀' },
  { id: 5,  name: '최동욱', email: 'choi.dw@company.com',   status: 'pending',  joinDate: '2025-04-12', dept: '마케팅팀' },
  { id: 6,  name: '한지민', email: 'han.jm@company.com',    status: 'active',   joinDate: '2025-05-20', dept: '인사팀' },
  { id: 7,  name: '오세훈', email: 'oh.sh@company.com',     status: 'inactive', joinDate: '2025-06-01', dept: '재무팀' },
  { id: 8,  name: '윤아름', email: 'yoon.ar@company.com',   status: 'active',   joinDate: '2025-07-14', dept: '개발팀' },
  { id: 9,  name: '강태양', email: 'kang.ty@company.com',   status: 'pending',  joinDate: '2026-01-08', dept: '영업팀' },
  { id: 10, name: '임소연', email: 'lim.sy@company.com',    status: 'active',   joinDate: '2026-02-22', dept: '디자인팀' },
])

const tableColumns = [
  { key: 'name',     label: '이름',   sortable: true },
  { key: 'email',    label: '이메일', sortable: true },
  { key: 'dept',     label: '부서',   sortable: true },
  { key: 'status',   label: '상태' },
  { key: 'joinDate', label: '가입일', sortable: true },
  { key: 'actions',  label: '관리',   width: '80px' },
]

const statusLabelMap: Record<string, string> = {
  active:   '활성',
  inactive: '비활성',
  pending:  '대기',
}

// Selection
const selectedRows = ref<number[]>([])

// Pagination
const currentPage = ref(1)
const pageSize = 10
const totalItems = computed(() => allUsers.value.length)

// Stats
const totalCount   = computed(() => allUsers.value.length)
const activeCount  = computed(() => allUsers.value.filter(u => u.status === 'active').length)
const inactiveCount = computed(() => allUsers.value.filter(u => u.status === 'inactive').length)
const newCount     = computed(() => allUsers.value.filter(u => u.joinDate >= '2026-01-01').length)

// Edit Drawer
const editDrawerOpen = ref(false)
const editingUser = ref<typeof allUsers.value[0] | null>(null)
const editName = ref('')
const editEmail = ref('')
const editDept = ref<string | number | null>(null)
const editStatus = ref<string | number | null>(null)

const deptOptions = [
  { value: '개발팀', label: '개발팀' },
  { value: '디자인팀', label: '디자인팀' },
  { value: '기획팀', label: '기획팀' },
  { value: '마케팅팀', label: '마케팅팀' },
  { value: '인사팀', label: '인사팀' },
  { value: '재무팀', label: '재무팀' },
  { value: '영업팀', label: '영업팀' },
]

const editStatusOptions = [
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
  { value: 'pending', label: '대기' },
]

const openEdit = (user: typeof allUsers.value[0]) => {
  editingUser.value = user
  editName.value    = user.name
  editEmail.value   = user.email
  editDept.value    = user.dept
  editStatus.value  = user.status
  editDrawerOpen.value = true
}

const saveEdit = () => {
  if (!editingUser.value) return
  const idx = allUsers.value.findIndex(u => u.id === editingUser.value!.id)
  if (idx !== -1) {
    allUsers.value[idx] = {
      ...allUsers.value[idx],
      name:   editName.value,
      email:  editEmail.value,
      dept:   String(editDept.value ?? allUsers.value[idx].dept),
      status: String(editStatus.value ?? allUsers.value[idx].status),
    }
  }
  editDrawerOpen.value = false
}

// Delete Modal
const deleteModalOpen = ref(false)
const deletingUser = ref<typeof allUsers.value[0] | null>(null)

const openDelete = (user: typeof allUsers.value[0]) => {
  deletingUser.value = user
  deleteModalOpen.value = true
}

const confirmDelete = () => {
  if (!deletingUser.value) return
  allUsers.value = allUsers.value.filter(u => u.id !== deletingUser.value!.id)
  selectedRows.value = selectedRows.value.filter(id => id !== deletingUser.value!.id)
  deleteModalOpen.value = false
}

// Add Modal
const addModalOpen = ref(false)
const newName   = ref('')
const newEmail  = ref('')
const newDept   = ref<string | number | null>(null)
const newStatus = ref<string | number | null>('active')

const openAdd = () => {
  newName.value   = ''
  newEmail.value  = ''
  newDept.value   = null
  newStatus.value = 'active'
  addModalOpen.value = true
}

const confirmAdd = () => {
  if (!newName.value || !newEmail.value) return
  const maxId = Math.max(...allUsers.value.map(u => u.id), 0)
  allUsers.value.push({
    id:       maxId + 1,
    name:     newName.value,
    email:    newEmail.value,
    dept:     String(newDept.value ?? '미지정'),
    status:   String(newStatus.value ?? 'pending'),
    joinDate: new Date().toISOString().slice(0, 10),
  })
  addModalOpen.value = false
}

// Bulk delete
const bulkDelete = () => {
  if (selectedRows.value.length === 0) return
  allUsers.value = allUsers.value.filter(u => !selectedRows.value.includes(u.id))
  selectedRows.value = []
}

// Search
const handleSearch = () => {
  isSearching.value = true
  setTimeout(() => { isSearching.value = false }, 600)
  currentPage.value = 1
}

const handleReset = () => {
  searchName.value = ''
  searchStatus.value = null
  searchDateRange.value = { start: '', end: '' }
  currentPage.value = 1
}

// Excel export (mock)
const handleExcelDownload = () => {
  alert('엑셀 다운로드 기능 (실제 구현 필요)')
}
</script>

<template>
  <div style="padding: 2rem; max-width: 1400px; margin: 0 auto;">

    <!-- Breadcrumb -->
    <DsBreadcrumb :items="breadcrumbItems" style="margin-bottom: var(--ds-spacing-4, 1rem);" />

    <!-- Page Title -->
    <h1 style="font-size: 1.75rem; font-weight: 700; color: var(--ds-on-surface, #2a3439); margin: 0 0 var(--ds-spacing-6, 1.5rem);">
      사용자 관리
    </h1>

    <!-- Stat Cards -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--ds-spacing-4, 1rem); margin-bottom: var(--ds-spacing-6, 1.5rem);">
      <DsStatCard title="전체 회원" :value="totalCount" />
      <DsStatCard title="활성" :value="activeCount" :change="12.5" />
      <DsStatCard title="비활성" :value="inactiveCount" :change="-5.2" />
      <DsStatCard title="신규 가입" :value="newCount" :change="8.0" change-unit="%" />
    </div>

    <!-- Search Bar -->
    <div style="margin-bottom: var(--ds-spacing-4, 1rem);">
      <DsSearchBar :loading="isSearching" @search="handleSearch" @reset="handleReset">
        <DsFormItem label="이름">
          <DsInput v-model="searchName" placeholder="이름 검색" style="width: 180px;" />
        </DsFormItem>
        <DsFormItem label="상태">
          <DsSelect
            v-model="searchStatus"
            :options="statusOptions"
            placeholder="전체"
            style="width: 140px;"
          />
        </DsFormItem>
        <DsFormItem label="가입일">
          <DsDateRangePicker v-model="searchDateRange" />
        </DsFormItem>
      </DsSearchBar>
    </div>

    <!-- Action Bar -->
    <DsActionBar :selected-count="selectedRows.length">
      <template #default>
        <DsButton @click="openAdd">추가</DsButton>
        <DsButton
          class="ds-button--secondary"
          :disabled="selectedRows.length === 0"
          @click="bulkDelete"
        >
          선택 삭제{{ selectedRows.length > 0 ? ` (${selectedRows.length})` : '' }}
        </DsButton>
        <DsButton class="ds-button--secondary" @click="handleExcelDownload">
          엑셀 다운로드
        </DsButton>
      </template>
    </DsActionBar>

    <!-- Table -->
    <DsTable
      :data="allUsers"
      :columns="tableColumns"
      selectable
      sortable
      row-key="id"
      v-model:selected="selectedRows"
      style="margin-bottom: var(--ds-spacing-4, 1rem);"
    >
      <template #cell-status="{ row }">
        <DsStatusTag :status="row.status">
          {{ statusLabelMap[row.status] ?? row.status }}
        </DsStatusTag>
      </template>

      <template #cell-actions="{ row }">
        <DsDropdown>
          <template #trigger>
            <button
              style="background: none; border: 1px solid var(--ds-outline-variant, rgba(169,180,185,0.4)); cursor: pointer; padding: 0.25rem 0.6rem; font-size: 0.813rem; color: var(--ds-on-surface, #2a3439); border-radius: 0;"
            >
              ···
            </button>
          </template>
          <div class="ds-dropdown__item" @click="openEdit(row)">수정</div>
          <div
            class="ds-dropdown__item"
            style="color: var(--ds-error, #d93025);"
            @click="openDelete(row)"
          >삭제</div>
        </DsDropdown>
      </template>
    </DsTable>

    <!-- Pagination -->
    <div style="display: flex; justify-content: flex-end;">
      <DsPagination
        v-model="currentPage"
        :total="totalItems"
        :page-size="pageSize"
      />
    </div>

    <!-- Edit Drawer -->
    <DsDrawer v-model="editDrawerOpen" position="right" width="420px">
      <template #header>
        <div>
          <h3 style="font-size: 1rem; font-weight: 600; margin: 0;">사용자 수정</h3>
          <p style="font-size: 0.813rem; color: var(--ds-on-surface-variant, #5a6970); margin: 0.25rem 0 0;">
            {{ editingUser?.name }}
          </p>
        </div>
      </template>

      <div style="display: flex; flex-direction: column; gap: var(--ds-spacing-5, 1.25rem);">
        <DsFormItem label="이름" required>
          <DsInput v-model="editName" placeholder="이름 입력" />
        </DsFormItem>
        <DsFormItem label="이메일" required>
          <DsInput v-model="editEmail" placeholder="이메일 입력" />
        </DsFormItem>
        <DsFormItem label="부서">
          <DsSelect v-model="editDept" :options="deptOptions" placeholder="부서 선택" />
        </DsFormItem>
        <DsFormItem label="상태">
          <DsSelect v-model="editStatus" :options="editStatusOptions" placeholder="상태 선택" />
        </DsFormItem>
      </div>

      <template #footer>
        <div style="display: flex; gap: var(--ds-spacing-2, 0.5rem); justify-content: flex-end;">
          <DsButton class="ds-button--secondary" @click="editDrawerOpen = false">취소</DsButton>
          <DsButton @click="saveEdit">저장</DsButton>
        </div>
      </template>
    </DsDrawer>

    <!-- Delete Confirm Modal -->
    <DsModal v-model="deleteModalOpen">
      <template #header>
        <span style="font-size: 1rem; font-weight: 600;">사용자 삭제</span>
      </template>
      <div style="width: 360px;">
        <p style="font-size: 0.875rem; color: var(--ds-on-surface-variant, #5a6970); margin: 0;">
          <strong style="color: var(--ds-on-surface, #2a3439);">{{ deletingUser?.name }}</strong> ({{ deletingUser?.email }}) 사용자를 삭제하시겠습니까?<br />
          <span style="color: var(--ds-error, #d93025); font-size: 0.813rem; margin-top: 0.5rem; display: block;">이 작업은 되돌릴 수 없습니다.</span>
        </p>
      </div>
      <template #footer>
        <DsButton class="ds-button--secondary" @click="deleteModalOpen = false">취소</DsButton>
        <DsButton style="background: var(--ds-error, #d93025); color: #fff;" @click="confirmDelete">삭제</DsButton>
      </template>
    </DsModal>

    <!-- Add User Modal -->
    <DsModal v-model="addModalOpen">
      <template #header>
        <span style="font-size: 1rem; font-weight: 600;">사용자 추가</span>
      </template>
      <div style="width: 480px; display: flex; flex-direction: column; gap: var(--ds-spacing-4, 1rem);">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--ds-spacing-4, 1rem);">
          <DsFormItem label="이름" required>
            <DsInput v-model="newName" placeholder="이름 입력" />
          </DsFormItem>
          <DsFormItem label="이메일" required>
            <DsInput v-model="newEmail" placeholder="이메일 입력" />
          </DsFormItem>
          <DsFormItem label="부서">
            <DsSelect v-model="newDept" :options="deptOptions" placeholder="부서 선택" />
          </DsFormItem>
          <DsFormItem label="상태">
            <DsSelect v-model="newStatus" :options="editStatusOptions" />
          </DsFormItem>
        </div>
      </div>
      <template #footer>
        <DsButton class="ds-button--secondary" @click="addModalOpen = false">취소</DsButton>
        <DsButton :disabled="!newName || !newEmail" @click="confirmAdd">추가</DsButton>
      </template>
    </DsModal>

  </div>
</template>

<style scoped>
/* No custom component styles — layout only */
</style>
