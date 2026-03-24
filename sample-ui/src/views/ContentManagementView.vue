<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
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
  DsSpinner,
  DsSteps,
  DsTimeline,
  DsTextarea,
  DsFileUpload,
  DsSwitch,
} from 'dscore-ui-vue'

// ─── 영화 포스터 이미지 import ───
import posterLobster from '../../assets/image.png'
import posterParasite from '../../assets/image copy.png'
import posterCrime4 from '../../assets/image copy 2.png'
import posterBusan from '../../assets/image copy 3.png'
import posterWhiplash from '../../assets/image copy 4.png'
import posterJoker from '../../assets/image copy 5.png'
import posterExit from '../../assets/image copy 6.png'
import posterOldboy from '../../assets/image copy 7.png'
import posterEndgame from '../../assets/image copy 8.png'
import posterDrugKing from '../../assets/image copy 9.png'
import posterMarathon from '../../assets/image copy 10.png'
import posterSilence from '../../assets/image copy 11.png'

// ─── 초성 검색 유틸 ───
const CHOSUNG_LIST = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']

function getChosung(str: string): string {
  return [...str].map(ch => {
    const code = ch.charCodeAt(0)
    if (code >= 0xAC00 && code <= 0xD7A3) {
      return CHOSUNG_LIST[Math.floor((code - 0xAC00) / 588)]
    }
    return ch
  }).join('')
}

function isChosungOnly(str: string): boolean {
  return [...str].every(ch => CHOSUNG_LIST.includes(ch))
}

function matchesSearch(text: string, query: string): boolean {
  const q = query.toLowerCase()
  if (text.toLowerCase().includes(q)) return true
  if (isChosungOnly(query)) {
    return getChosung(text).includes(query)
  }
  return false
}

// ─── 콘텐츠 타입 ───
interface ContentItem {
  id: number
  title: string
  category: string
  author: string
  status: 'draft' | 'review' | 'approved' | 'published' | 'rejected'
  createdAt: string
  publishedAt: string | null
  views: number
  thumbnail: string | null
}

// ─── 대시보드 ───
const totalContents = ref(0)
const publishedCount = ref(0)
const reviewCount = ref(0)
const draftCount = ref(0)
const dashboardLoading = ref(true)

// ─── 콘텐츠 목록 데이터 ───
const rawContents: ContentItem[] = [
  { id: 1,  title: '2026 봄 시즌 배너 캠페인',       category: '배너',   author: '김민지', status: 'published', createdAt: '2026-03-01', publishedAt: '2026-03-05', views: 3420, thumbnail: null },
  { id: 2,  title: '신규 아티스트 프로필 업데이트',    category: '아티스트', author: '이서준', status: 'published', createdAt: '2026-03-03', publishedAt: '2026-03-04', views: 1280, thumbnail: null },
  { id: 3,  title: '3월 프로모션 랜딩 페이지',         category: '프로모션', author: '박지유', status: 'review',    createdAt: '2026-03-10', publishedAt: null, views: 0, thumbnail: null },
  { id: 4,  title: '이벤트 안내 팝업 배너',            category: '배너',   author: '정하늘', status: 'review',    createdAt: '2026-03-12', publishedAt: null, views: 0, thumbnail: null },
  { id: 5,  title: '앱 메인 캐러셀 이미지 교체',       category: '배너',   author: '김민지', status: 'approved',  createdAt: '2026-03-14', publishedAt: null, views: 0, thumbnail: null },
  { id: 6,  title: '봄 신보 소개 페이지',              category: '아티스트', author: '최유나', status: 'draft',     createdAt: '2026-03-15', publishedAt: null, views: 0, thumbnail: null },
  { id: 7,  title: 'FAQ 페이지 리뉴얼',               category: '가이드',  author: '이서준', status: 'draft',     createdAt: '2026-03-18', publishedAt: null, views: 0, thumbnail: null },
  { id: 8,  title: '할인 쿠폰 캠페인 상세',            category: '프로모션', author: '박지유', status: 'rejected',  createdAt: '2026-03-08', publishedAt: null, views: 0, thumbnail: null },
  { id: 9,  title: '공지사항 — 서비스 점검 안내',      category: '공지',   author: '정하늘', status: 'published', createdAt: '2026-02-28', publishedAt: '2026-03-01', views: 5640, thumbnail: null },
  { id: 10, title: '아티스트 인터뷰 콘텐츠',           category: '아티스트', author: '최유나', status: 'published', createdAt: '2026-02-20', publishedAt: '2026-02-25', views: 2180, thumbnail: null },
]

const contents = ref<ContentItem[]>([])
const tableLoading = ref(true)

onMounted(() => {
  // 대시보드 + 테이블 로딩 시뮬레이션
  setTimeout(() => {
    contents.value = rawContents
    totalContents.value = rawContents.length
    publishedCount.value = rawContents.filter(c => c.status === 'published').length
    reviewCount.value = rawContents.filter(c => c.status === 'review').length
    draftCount.value = rawContents.filter(c => c.status === 'draft').length
    dashboardLoading.value = false
    tableLoading.value = false
  }, 2000)
})

// ─── 검색 ───
const searchTitle = ref('')
const searchCategory = ref<string | number | null>(null)
const searchStatus = ref<string | number | null>(null)
const searchDateRange = ref<{ start: string; end: string }>({ start: '', end: '' })
const isSearching = ref(false)

const categoryOptions = [
  { value: '', label: '전체' },
  { value: '배너', label: '배너' },
  { value: '아티스트', label: '아티스트' },
  { value: '프로모션', label: '프로모션' },
  { value: '가이드', label: '가이드' },
  { value: '공지', label: '공지' },
]

const statusOptions = [
  { value: '', label: '전체' },
  { value: 'draft', label: '임시저장' },
  { value: 'review', label: '심사중' },
  { value: 'approved', label: '승인' },
  { value: 'published', label: '게시됨' },
  { value: 'rejected', label: '반려' },
]

const handleSearch = () => {
  isSearching.value = true
  setTimeout(() => { isSearching.value = false }, 600)
  currentPage.value = 1
}

const handleReset = () => {
  searchTitle.value = ''
  searchCategory.value = null
  searchStatus.value = null
  searchDateRange.value = { start: '', end: '' }
  currentPage.value = 1
}

// ─── 테이블 ───
const tableColumns = [
  { key: 'id', label: 'ID', width: '60px', sortable: true },
  { key: 'title', label: '콘텐츠 제목', sortable: true },
  { key: 'category', label: '카테고리', width: '100px', sortable: true },
  { key: 'author', label: '작성자', width: '90px', sortable: true },
  { key: 'status', label: '상태', width: '90px' },
  { key: 'createdAt', label: '등록일', width: '110px', sortable: true },
  { key: 'views', label: '조회수', width: '80px', sortable: true },
  { key: 'actions', label: '관리', width: '70px' },
]

const selectedRows = ref<number[]>([])
const sortKey = ref('')
const sortOrder = ref<'asc' | 'desc' | ''>('')

const sortedContents = computed(() => {
  if (!sortKey.value || !sortOrder.value) return contents.value
  const key = sortKey.value as keyof ContentItem
  const order = sortOrder.value
  return [...contents.value].sort((a, b) => {
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
  draft: '임시저장',
  review: '심사중',
  approved: '승인',
  published: '게시됨',
  rejected: '반려',
}

const currentPage = ref(1)
const pageSize = 10

// ─── CRUD ───
const deleteModalOpen = ref(false)
const deletingContent = ref<ContentItem | null>(null)

const openDelete = (row: ContentItem) => {
  deletingContent.value = row
  deleteModalOpen.value = true
}

const confirmDelete = () => {
  if (!deletingContent.value) return
  contents.value = contents.value.filter(c => c.id !== deletingContent.value!.id)
  selectedRows.value = selectedRows.value.filter(id => id !== deletingContent.value!.id)
  deleteModalOpen.value = false
}

const bulkDelete = () => {
  if (selectedRows.value.length === 0) return
  contents.value = contents.value.filter(c => !selectedRows.value.includes(c.id))
  selectedRows.value = []
}

// ─── 콘텐츠 등록 (스텝퍼) ───
const registerDrawerOpen = ref(false)
const currentStep = ref(0)

const registerSteps = [
  { title: '기본 정보', description: '제목, 카테고리 설정' },
  { title: '콘텐츠 작성', description: '본문 및 이미지 첨부' },
  { title: '게시 설정', description: '공개 여부, 예약 게시' },
]

const formTitle = ref('')
const formCategory = ref<string | number | null>(null)
const formBody = ref('')
const formFiles = ref<File[]>([])
const formIsPublic = ref(true)
const formScheduleDate = ref('')

const openRegister = () => {
  currentStep.value = 0
  formTitle.value = ''
  formCategory.value = null
  formBody.value = ''
  formFiles.value = []
  formIsPublic.value = true
  formScheduleDate.value = ''
  registerDrawerOpen.value = true
}

const nextStep = () => {
  if (currentStep.value < registerSteps.length - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const submitContent = () => {
  const maxId = Math.max(...contents.value.map(c => c.id), 0)
  contents.value.unshift({
    id: maxId + 1,
    title: formTitle.value || '(제목 없음)',
    category: String(formCategory.value ?? '미분류'),
    author: '김민지',
    status: 'draft',
    createdAt: new Date().toISOString().slice(0, 10),
    publishedAt: null,
    views: 0,
    thumbnail: null,
  })
  registerDrawerOpen.value = false
}

// ─── 콘텐츠 상태 흐름 ───
const statusFlowItems = [
  { title: '콘텐츠 등록',         description: '김민지 — 초안 작성 완료',                         time: '2026-03-14 09:30', type: 'success' },
  { title: '1차 검토 요청',       description: '편집팀에 검토 요청',                              time: '2026-03-14 10:15', type: 'success' },
  { title: '편집팀 피드백',       description: '이서준 — 썸네일 해상도 조정 요청',                time: '2026-03-15 14:00', type: 'warning' },
  { title: '수정 완료 · 재검토',  description: '김민지 — 이미지 교체 후 재요청',                  time: '2026-03-15 16:45', type: 'info' },
  { title: '최종 승인',           description: '박지유 — 게시 승인',                              time: '2026-03-16 11:00', type: 'success' },
  { title: '게시 대기',           description: '예약 게시 설정됨 (2026-03-18 00:00)',             time: '',                type: '' },
]

// ─── 배너 순서 편집 ───
const bannerItems = ref([
  { id: 1, title: '봄 시즌 메인 배너',     position: 1 },
  { id: 2, title: '신규 가입 프로모션',     position: 2 },
  { id: 3, title: '아티스트 컴백 안내',     position: 3 },
  { id: 4, title: '이벤트 응모 배너',       position: 4 },
  { id: 5, title: '앱 다운로드 유도',       position: 5 },
])

const moveBanner = (index: number, direction: -1 | 1) => {
  const target = index + direction
  if (target < 0 || target >= bannerItems.value.length) return
  const items = [...bannerItems.value]
  const temp = items[index]
  items[index] = items[target]
  items[target] = temp
  items.forEach((item, i) => { item.position = i + 1 })
  bannerItems.value = items
}

// ─── 히어로 배너 캐러셀 ───
interface CarouselSlide {
  id: number
  title: string
  subtitle: string
  gradient: string
  badge?: string
}

const heroSlides: CarouselSlide[] = [
  { id: 1, title: '2026 봄 시즌 캠페인',     subtitle: '새로운 아티스트를 만나보세요',     gradient: 'linear-gradient(155deg, #5f5e5e, #535252)', badge: 'NEW' },
  { id: 2, title: '신규 가입 프로모션',       subtitle: '첫 달 무료 구독 혜택',            gradient: 'linear-gradient(155deg, #3a5a7c, #2a4a6c)' },
  { id: 3, title: '인기 아티스트 TOP 10',     subtitle: '이번 주 가장 많이 검색된 아티스트', gradient: 'linear-gradient(155deg, #6b4c3b, #5a3b2a)', badge: 'TOP 10' },
  { id: 4, title: '한정 이벤트 응모',         subtitle: '3월 31일까지 참여 가능',           gradient: 'linear-gradient(155deg, #4a6b5c, #3a5b4c)' },
]

const heroIndex = ref(0)
const heroLoading = ref(true)
const heroAutoPlay = ref(true)
let heroTimer: ReturnType<typeof setInterval> | null = null

const startHeroAutoPlay = () => {
  stopHeroAutoPlay()
  if (heroAutoPlay.value) {
    heroTimer = setInterval(() => {
      heroIndex.value = (heroIndex.value + 1) % heroSlides.length
    }, 4000)
  }
}

const stopHeroAutoPlay = () => {
  if (heroTimer) { clearInterval(heroTimer); heroTimer = null }
}

const heroNext = () => {
  heroIndex.value = (heroIndex.value + 1) % heroSlides.length
  startHeroAutoPlay()
}

const heroPrev = () => {
  heroIndex.value = (heroIndex.value - 1 + heroSlides.length) % heroSlides.length
  startHeroAutoPlay()
}

watch(heroAutoPlay, () => {
  if (heroAutoPlay.value) startHeroAutoPlay()
  else stopHeroAutoPlay()
})

// ─── 콘텐츠 캐러셀 (가로 스크롤) ───
interface CarouselCard {
  id: number
  title: string
  category: string
  gradient: string
  badge?: string
  views: number
}

const carouselCards: CarouselCard[] = [
  { id: 1,  title: '봄 신보 소개',        category: '아티스트', gradient: 'linear-gradient(155deg, #7c6b5a, #6b5a49)', badge: 'NEW', views: 3420 },
  { id: 2,  title: '3월 프로모션',         category: '프로모션', gradient: 'linear-gradient(155deg, #5a6b7c, #495a6b)', views: 1280 },
  { id: 3,  title: '앱 배너 A',           category: '배너',    gradient: 'linear-gradient(155deg, #6b7c5a, #5a6b49)', badge: 'TOP 10', views: 5640 },
  { id: 4,  title: 'FAQ 리뉴얼',          category: '가이드',  gradient: 'linear-gradient(155deg, #7c5a6b, #6b495a)', views: 420 },
  { id: 5,  title: '컴백 안내',            category: '아티스트', gradient: 'linear-gradient(155deg, #5a7c6b, #496b5a)', badge: 'NEW', views: 2180 },
  { id: 6,  title: '구독 혜택 안내',       category: '프로모션', gradient: 'linear-gradient(155deg, #6b5a7c, #5a496b)', views: 890 },
  { id: 7,  title: '서비스 점검 공지',     category: '공지',    gradient: 'linear-gradient(155deg, #5e5f5f, #4e4f4f)', views: 7200 },
  { id: 8,  title: '신규 기능 소개',       category: '가이드',  gradient: 'linear-gradient(155deg, #7c7c5a, #6b6b49)', views: 1560 },
]

const carouselLoading = ref(true)
const carouselScrollRef = ref<HTMLElement | null>(null)

const scrollCarousel = (direction: -1 | 1) => {
  const el = carouselScrollRef.value
  if (!el) return
  el.scrollBy({ left: direction * 280, behavior: 'smooth' })
}

// ─── 미디어 카드 (가로/세로/정방형) ───
type CardVariant = 'horizontal' | 'vertical' | 'square'
const cardVariant = ref<CardVariant>('vertical')

const mediaCards = [
  { id: 1, title: '봄 시즌 메인 배너',     category: '배너',    badge: 'NEW',    gradient: 'linear-gradient(155deg, #5f5e5e, #535252)', views: 3420 },
  { id: 2, title: '아티스트 인터뷰',        category: '아티스트', badge: undefined, gradient: 'linear-gradient(155deg, #3a5a7c, #2a4a6c)', views: 1280 },
  { id: 3, title: '인기 콘텐츠 모음',       category: '프로모션', badge: 'TOP 10', gradient: 'linear-gradient(155deg, #6b4c3b, #5a3b2a)', views: 5640 },
  { id: 4, title: '19+ 콘텐츠 관리 가이드', category: '가이드',  badge: '19+',    gradient: 'linear-gradient(155deg, #7c5a6b, #6b495a)', views: 420 },
  { id: 5, title: '할인 쿠폰 캠페인',       category: '프로모션', badge: undefined, gradient: 'linear-gradient(155deg, #4a6b5c, #3a5b4c)', views: 890 },
  { id: 6, title: '신규 아티스트 프로필',    category: '아티스트', badge: 'NEW',    gradient: 'linear-gradient(155deg, #6b5a7c, #5a496b)', views: 2180 },
]

const lazyLoaded = ref<Set<number>>(new Set())
const cardContainerRef = ref<HTMLElement | null>(null)

const setupLazyObserver = () => {
  nextTick(() => {
    const container = cardContainerRef.value
    if (!container) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = Number((entry.target as HTMLElement).dataset.cardId)
          // 레이지 로딩 시뮬레이션: 랜덤 딜레이
          setTimeout(() => {
            lazyLoaded.value = new Set([...lazyLoaded.value, id])
          }, 300 + Math.random() * 700)
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    container.querySelectorAll('[data-card-id]').forEach(el => observer.observe(el))
  })
}

// ─── 실시간 검색 (AutoComplete) ───
const autoCompleteQuery = ref('')
const debouncedQuery = ref('')
const autoCompleteResults = ref<MovieItem[]>([])
const autoCompleteOpen = ref(false)
let acDebounceTimer: ReturnType<typeof setTimeout> | null = null

const handleAutoComplete = (val: string) => {
  autoCompleteQuery.value = val
  if (acDebounceTimer) clearTimeout(acDebounceTimer)
  if (!val.trim()) {
    autoCompleteOpen.value = false
    debouncedQuery.value = ''
    return
  }
  acDebounceTimer = setTimeout(() => {
    debouncedQuery.value = val
    autoCompleteResults.value = filterDemoData.filter(c =>
      matchesSearch(c.title, val) || matchesSearch(c.category, val)
    )
    autoCompleteOpen.value = true
  }, 300)
}

const highlightMatch = (text: string) => {
  if (!autoCompleteQuery.value.trim()) return text
  const regex = new RegExp(`(${autoCompleteQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="cm__highlight">$1</mark>')
}

const selectAutoComplete = (title: string) => {
  autoCompleteQuery.value = title
  debouncedQuery.value = title
  autoCompleteOpen.value = false
}

// ─── 멀티 필터 칩 ───
const filterCategories = ['드라마', '액션', '스릴러', '코미디']
const activeFilters = ref<string[]>([])

const toggleFilter = (cat: string) => {
  const idx = activeFilters.value.indexOf(cat)
  if (idx > -1) activeFilters.value.splice(idx, 1)
  else activeFilters.value.push(cat)
}

const clearFilters = () => { activeFilters.value = [] }

// ─── 정렬 드롭다운 ───
const sortOptions = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
  { value: 'views', label: '조회순' },
  { value: 'name', label: '이름순' },
]
const currentSort = ref<string | number | null>('latest')

// 필터 + 검색 + 정렬 적용된 결과 데이터 (영화 포스터)
interface MovieItem {
  id: number
  title: string
  category: string
  views: number
  date: string
  poster: string
  badge?: string
  rating: number
}

const filterDemoData: MovieItem[] = [
  { id: 101, title: '기생충',              category: '드라마',  views: 42800, date: '2019-05-30', poster: posterParasite,  badge: 'TOP 10', rating: 9.2 },
  { id: 102, title: '부산행',              category: '액션',    views: 38500, date: '2016-07-20', poster: posterBusan,     badge: undefined, rating: 8.7 },
  { id: 103, title: '범죄도시 4',           category: '액션',    views: 31200, date: '2024-04-24', poster: posterCrime4,    badge: 'NEW',    rating: 7.8 },
  { id: 104, title: '올드보이',             category: '스릴러',  views: 28900, date: '2003-11-21', poster: posterOldboy,    badge: undefined, rating: 9.0 },
  { id: 105, title: '더 랍스터',            category: '드라마',  views: 8420,  date: '2015-10-29', poster: posterLobster,   badge: undefined, rating: 7.9 },
  { id: 106, title: '조커',                category: '스릴러',  views: 35600, date: '2019-10-02', poster: posterJoker,     badge: undefined, rating: 8.8 },
  { id: 107, title: '위플래쉬',             category: '드라마',  views: 22100, date: '2015-03-12', poster: posterWhiplash,  badge: 'TOP 10', rating: 9.1 },
  { id: 108, title: '어벤져스: 엔드게임',    category: '액션',    views: 54200, date: '2019-04-24', poster: posterEndgame,   badge: undefined, rating: 8.5 },
  { id: 109, title: '엑시트',              category: '코미디',  views: 18700, date: '2019-07-31', poster: posterExit,      badge: undefined, rating: 7.6 },
  { id: 110, title: '마약왕',              category: '스릴러',  views: 14300, date: '2018-12-19', poster: posterDrugKing,  badge: '19+',    rating: 7.4 },
  { id: 111, title: '말아톤',              category: '드라마',  views: 16800, date: '2005-01-27', poster: posterMarathon,  badge: undefined, rating: 8.3 },
  { id: 112, title: '양들의 침묵',          category: '스릴러',  views: 32400, date: '1991-02-14', poster: posterSilence,   badge: '19+',    rating: 9.0 },
]

const filteredResults = computed(() => {
  let results = [...filterDemoData]

  // 검색어 필터 (초성검색 포함, 디바운스 적용)
  if (debouncedQuery.value.trim()) {
    const q = debouncedQuery.value
    results = results.filter(r => matchesSearch(r.title, q) || matchesSearch(r.category, q))
  }

  // 카테고리 필터
  if (activeFilters.value.length > 0) {
    results = results.filter(r => activeFilters.value.includes(r.category))
  }

  // 정렬
  const sort = currentSort.value as string
  if (sort === 'latest') results.sort((a, b) => b.date.localeCompare(a.date))
  else if (sort === 'popular' || sort === 'views') results.sort((a, b) => b.views - a.views)
  else if (sort === 'name') results.sort((a, b) => a.title.localeCompare(b.title))

  return results
})

// ─── 코드 보기 토글 ───
const showListCode = ref(false)
const showStepperCode = ref(false)
const showStatusCode = ref(false)
const showBannerCode = ref(false)
const showCarouselCode = ref(false)
const showCardCode = ref(false)
const showFilterCode = ref(false)

// ─── 마운트 ───
onMounted(() => {
  // 캐러셀 로딩 시뮬레이션
  setTimeout(() => {
    heroLoading.value = false
    carouselLoading.value = false
    startHeroAutoPlay()
    setupLazyObserver()
  }, 2500)
})

onUnmounted(() => {
  stopHeroAutoPlay()
})
</script>

<template>
  <div class="cm">

    <!-- Breadcrumb -->
    <DsBreadcrumb
      :items="[{ label: '홈', href: '/' }, { label: '콘텐츠 관리' }]"
      style="margin-bottom: 1.5rem;"
    />

    <!-- Page title -->
    <div class="cm__header">
      <div>
        <h1 class="cm__title">콘텐츠 관리</h1>
        <p class="cm__subtitle">배너, 아티스트, 프로모션 등 콘텐츠를 등록·관리합니다.</p>
      </div>
    </div>

    <!-- ━━━ 대시보드 ━━━ -->
    <section class="cm__section">
      <div class="cm__stat-grid">
        <template v-if="dashboardLoading">
          <div v-for="i in 4" :key="i" class="cm__stat-skeleton">
            <DsSpinner size="sm" />
          </div>
        </template>
        <template v-else>
          <DsStatCard title="전체 콘텐츠" :value="totalContents" />
          <DsStatCard title="게시됨" :value="publishedCount" :change="12.5" />
          <DsStatCard title="심사중" :value="reviewCount" />
          <DsStatCard title="임시저장" :value="draftCount" />
        </template>
      </div>
    </section>

    <!-- ━━━ 콘텐츠 목록 (ContentListPage 패턴) ━━━ -->
    <section class="cm__section">
      <h2 class="cm__section-title">콘텐츠 목록</h2>
      <p class="cm__section-desc">SearchBar + Table + Pagination 조합으로 구성한 목록 페이지 패턴입니다.</p>

      <!-- 검색 -->
      <div style="margin-bottom: 1rem;">
        <DsSearchBar :loading="isSearching" @search="handleSearch" @reset="handleReset">
          <DsFormItem label="제목">
            <DsInput v-model="searchTitle" placeholder="콘텐츠 제목 검색" style="width: 200px;" />
          </DsFormItem>
          <DsFormItem label="카테고리">
            <DsSelect v-model="searchCategory" :options="categoryOptions" placeholder="전체" style="width: 130px;" />
          </DsFormItem>
          <DsFormItem label="상태">
            <DsSelect v-model="searchStatus" :options="statusOptions" placeholder="전체" style="width: 130px;" />
          </DsFormItem>
          <DsFormItem label="등록일">
            <DsDateRangePicker v-model="searchDateRange" />
          </DsFormItem>
        </DsSearchBar>
      </div>

      <!-- 액션바 -->
      <DsActionBar :selected-count="selectedRows.length">
        <template #default>
          <DsButton @click="openRegister">콘텐츠 등록</DsButton>
          <DsButton
            class="ds-button--secondary"
            :disabled="selectedRows.length === 0"
            @click="bulkDelete"
          >
            선택 삭제{{ selectedRows.length > 0 ? ` (${selectedRows.length})` : '' }}
          </DsButton>
        </template>
      </DsActionBar>

      <!-- 테이블 -->
      <DsTable
        :data="sortedContents"
        :columns="tableColumns"
        selectable
        sortable
        row-key="id"
        :loading="tableLoading"
        v-model:selected="selectedRows"
        v-model:sort-key="sortKey"
        v-model:sort-order="sortOrder"
        style="margin-bottom: 1rem;"
      >
        <template #loading>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 2.5rem 0;">
            <DsSpinner size="sm" />
            <span style="font-size: 0.813rem; color: #5a6970;">콘텐츠를 불러오는 중...</span>
          </div>
        </template>
        <template #cell-status="{ row }">
          <DsStatusTag v-if="row" :status="row.status === 'published' ? 'active' : row.status === 'rejected' ? 'rejected' : row.status === 'approved' ? 'completed' : row.status === 'review' ? 'pending' : 'inactive'">
            {{ statusLabelMap[row.status] ?? row.status }}
          </DsStatusTag>
        </template>
        <template #cell-views="{ row }">
          <span v-if="row" style="font-variant-numeric: tabular-nums;">
            {{ row.views.toLocaleString() }}
          </span>
        </template>
        <template #cell-actions="{ row }">
          <DsDropdown v-if="row">
            <template #trigger>
              <button class="cm__action-trigger">···</button>
            </template>
            <div class="ds-dropdown__item">수정</div>
            <div class="ds-dropdown__item" style="color: #9f403d;" @click="openDelete(row)">삭제</div>
          </DsDropdown>
        </template>
      </DsTable>

      <!-- 페이지네이션 -->
      <div style="display: flex; justify-content: flex-end;">
        <DsPagination v-model="currentPage" :total="contents.length" :page-size="pageSize" />
      </div>

      <!-- 코드 보기 -->
      <button class="cm__code-toggle" @click="showListCode = !showListCode">
        {{ showListCode ? '코드 숨기기' : '코드 보기' }}
      </button>
      <div v-show="showListCode" class="cm__code">
        <pre v-pre><code>&lt;!-- ContentListPage 패턴 --&gt;
&lt;DsSearchBar :loading="isSearching" @search="handleSearch" @reset="handleReset"&gt;
  &lt;DsFormItem label="제목"&gt;
    &lt;DsInput v-model="searchTitle" placeholder="콘텐츠 제목 검색" /&gt;
  &lt;/DsFormItem&gt;
  &lt;DsFormItem label="카테고리"&gt;
    &lt;DsSelect v-model="searchCategory" :options="categoryOptions" /&gt;
  &lt;/DsFormItem&gt;
  &lt;DsFormItem label="상태"&gt;
    &lt;DsSelect v-model="searchStatus" :options="statusOptions" /&gt;
  &lt;/DsFormItem&gt;
&lt;/DsSearchBar&gt;

&lt;DsActionBar :selected-count="selectedRows.length"&gt;
  &lt;DsButton @click="openRegister"&gt;콘텐츠 등록&lt;/DsButton&gt;
  &lt;DsButton class="ds-button--secondary" :disabled="!selectedRows.length" @click="bulkDelete"&gt;
    선택 삭제
  &lt;/DsButton&gt;
&lt;/DsActionBar&gt;

&lt;DsTable
  :data="sortedContents"
  :columns="columns"
  selectable sortable
  :loading="tableLoading"
  v-model:selected="selectedRows"
  v-model:sort-key="sortKey"
  v-model:sort-order="sortOrder"
&gt;
  &lt;template #cell-status="{ row }"&gt;
    &lt;DsStatusTag :status="row.status"&gt;{{ statusLabel[row.status] }}&lt;/DsStatusTag&gt;
  &lt;/template&gt;
&lt;/DsTable&gt;

&lt;DsPagination v-model="currentPage" :total="contents.length" :page-size="10" /&gt;</code></pre>
      </div>
    </section>

    <!-- ━━━ 콘텐츠 등록 폼 (ContentFormPage — 스텝퍼 패턴) ━━━ -->
    <section class="cm__section">
      <h2 class="cm__section-title">콘텐츠 등록 (다단계 폼)</h2>
      <p class="cm__section-desc">DsSteps + DsForm 조합으로 구성한 다단계 등록 패턴입니다. 아래 버튼으로 Drawer를 열어 체험해 보세요.</p>

      <DsButton @click="openRegister">등록 폼 열기</DsButton>

      <!-- 코드 보기 -->
      <button class="cm__code-toggle" @click="showStepperCode = !showStepperCode">
        {{ showStepperCode ? '코드 숨기기' : '코드 보기' }}
      </button>
      <div v-show="showStepperCode" class="cm__code">
        <pre v-pre><code>&lt;!-- ContentFormPage 패턴 — 다단계 폼 --&gt;
&lt;script setup&gt;
const currentStep = ref(0)
const steps = [
  { title: '기본 정보', description: '제목, 카테고리 설정' },
  { title: '콘텐츠 작성', description: '본문 및 이미지 첨부' },
  { title: '게시 설정', description: '공개 여부, 예약 게시' },
]
&lt;/script&gt;

&lt;DsDrawer v-model="drawerOpen" position="right" width="560px"&gt;
  &lt;template #header&gt;
    &lt;DsSteps :steps="steps" :current="currentStep" /&gt;
  &lt;/template&gt;

  &lt;!-- Step 0: 기본 정보 --&gt;
  &lt;div v-show="currentStep === 0"&gt;
    &lt;DsFormItem label="콘텐츠 제목" required&gt;
      &lt;DsInput v-model="formTitle" /&gt;
    &lt;/DsFormItem&gt;
    &lt;DsFormItem label="카테고리" required&gt;
      &lt;DsSelect v-model="formCategory" :options="categoryOptions" /&gt;
    &lt;/DsFormItem&gt;
  &lt;/div&gt;

  &lt;!-- Step 1: 콘텐츠 작성 --&gt;
  &lt;div v-show="currentStep === 1"&gt;
    &lt;DsFormItem label="본문"&gt;
      &lt;DsTextarea v-model="formBody" :min-rows="6" /&gt;
    &lt;/DsFormItem&gt;
    &lt;DsFormItem label="이미지 첨부"&gt;
      &lt;DsFileUpload v-model="formFiles" accept="image/*" /&gt;
    &lt;/DsFormItem&gt;
  &lt;/div&gt;

  &lt;!-- Step 2: 게시 설정 --&gt;
  &lt;div v-show="currentStep === 2"&gt;
    &lt;DsFormItem label="공개 여부"&gt;
      &lt;DsSwitch v-model="formIsPublic" /&gt;
    &lt;/DsFormItem&gt;
  &lt;/div&gt;

  &lt;template #footer&gt;
    &lt;DsButton v-if="currentStep &gt; 0" @click="currentStep--"&gt;이전&lt;/DsButton&gt;
    &lt;DsButton v-if="currentStep &lt; steps.length - 1" @click="currentStep++"&gt;다음&lt;/DsButton&gt;
    &lt;DsButton v-if="currentStep === steps.length - 1" @click="submitContent"&gt;등록&lt;/DsButton&gt;
  &lt;/template&gt;
&lt;/DsDrawer&gt;</code></pre>
      </div>
    </section>

    <!-- ━━━ 콘텐츠 상태 흐름 (ContentStatusFlow 패턴) ━━━ -->
    <section class="cm__section">
      <h2 class="cm__section-title">콘텐츠 상태 흐름</h2>
      <p class="cm__section-desc">DsTimeline + DsStatusTag 조합으로 콘텐츠의 심사·승인·게시 상태 전이를 시각화합니다.</p>

      <div class="cm__status-flow">
        <div class="cm__status-flow-left">
          <div class="cm__status-current">
            <span class="cm__status-label">현재 상태</span>
            <div class="cm__status-badges">
              <DsStatusTag status="completed">승인</DsStatusTag>
              <span style="font-size: 0.75rem; color: #5a6970;">→ 게시 예약됨 (2026-03-18)</span>
            </div>
          </div>
          <div class="cm__status-current" style="margin-top: 1.5rem;">
            <span class="cm__status-label">상태 전이 규칙</span>
            <div class="cm__flow-chips">
              <span class="cm__flow-chip">임시저장</span>
              <span class="cm__flow-arrow">→</span>
              <span class="cm__flow-chip">심사중</span>
              <span class="cm__flow-arrow">→</span>
              <span class="cm__flow-chip cm__flow-chip--active">승인</span>
              <span class="cm__flow-arrow">→</span>
              <span class="cm__flow-chip">게시</span>
            </div>
            <div class="cm__flow-chips" style="margin-top: 0.5rem;">
              <span class="cm__flow-chip">심사중</span>
              <span class="cm__flow-arrow">→</span>
              <span class="cm__flow-chip cm__flow-chip--error">반려</span>
              <span class="cm__flow-arrow">→</span>
              <span class="cm__flow-chip">임시저장</span>
            </div>
          </div>
        </div>
        <div class="cm__status-flow-right">
          <span class="cm__status-label">이력</span>
          <DsTimeline :items="statusFlowItems" />
        </div>
      </div>

      <!-- 코드 보기 -->
      <button class="cm__code-toggle" @click="showStatusCode = !showStatusCode">
        {{ showStatusCode ? '코드 숨기기' : '코드 보기' }}
      </button>
      <div v-show="showStatusCode" class="cm__code">
        <pre v-pre><code>&lt;!-- ContentStatusFlow 패턴 --&gt;
&lt;script setup&gt;
const statusFlowItems = [
  { title: '콘텐츠 등록',    description: '초안 작성 완료', time: '03-14 09:30', type: 'success' },
  { title: '1차 검토 요청',  description: '편집팀에 검토',  time: '03-14 10:15', type: 'success' },
  { title: '편집팀 피드백',  description: '썸네일 수정 요청', time: '03-15 14:00', type: 'warning' },
  { title: '수정 완료',      description: '이미지 교체',    time: '03-15 16:45', type: 'info' },
  { title: '최종 승인',      description: '게시 승인',      time: '03-16 11:00', type: 'success' },
  { title: '게시 대기',      description: '예약 게시 설정됨', time: '', type: '' },
]
&lt;/script&gt;

&lt;DsTimeline :items="statusFlowItems" /&gt;

&lt;!-- 상태 전이 규칙: 임시저장 → 심사중 → 승인 → 게시 --&gt;
&lt;!--                 심사중 → 반려 → 임시저장 (되돌림) --&gt;</code></pre>
      </div>
    </section>

    <!-- ━━━ 배너 순서 편집 (BannerOrderEditor 패턴) ━━━ -->
    <section class="cm__section">
      <h2 class="cm__section-title">배너 순서 편집</h2>
      <p class="cm__section-desc">DsSortableList 구현 전, 버튼 기반 순서 편집 프로토타입입니다. 실제 구현 시 드래그 앤 드롭으로 대체됩니다.</p>

      <div class="cm__banner-list">
        <div
          v-for="(banner, index) in bannerItems"
          :key="banner.id"
          class="cm__banner-item"
        >
          <div class="cm__banner-pos">{{ banner.position }}</div>
          <div class="cm__banner-thumb"></div>
          <div class="cm__banner-info">
            <span class="cm__banner-title">{{ banner.title }}</span>
            <span class="cm__banner-id">ID: {{ banner.id }}</span>
          </div>
          <div class="cm__banner-actions">
            <button
              class="cm__banner-btn"
              :disabled="index === 0"
              @click="moveBanner(index, -1)"
              title="위로 이동"
            >▲</button>
            <button
              class="cm__banner-btn"
              :disabled="index === bannerItems.length - 1"
              @click="moveBanner(index, 1)"
              title="아래로 이동"
            >▼</button>
          </div>
        </div>
      </div>

      <!-- 코드 보기 -->
      <button class="cm__code-toggle" @click="showBannerCode = !showBannerCode">
        {{ showBannerCode ? '코드 숨기기' : '코드 보기' }}
      </button>
      <div v-show="showBannerCode" class="cm__code">
        <pre v-pre><code>&lt;!-- BannerOrderEditor 패턴 (프로토타입) --&gt;
&lt;script setup&gt;
const bannerItems = ref([
  { id: 1, title: '봄 시즌 메인 배너', position: 1 },
  { id: 2, title: '신규 가입 프로모션', position: 2 },
  // ...
])

const moveBanner = (index: number, direction: -1 | 1) =&gt; {
  const target = index + direction
  if (target &lt; 0 || target &gt;= bannerItems.value.length) return
  const items = [...bannerItems.value]
  ;[items[index], items[target]] = [items[target], items[index]]
  items.forEach((item, i) =&gt; { item.position = i + 1 })
  bannerItems.value = items
}
&lt;/script&gt;

&lt;!-- 실제 구현 시: &lt;DsSortableList v-model="bannerItems" /&gt; --&gt;
&lt;div v-for="(banner, index) in bannerItems" :key="banner.id"&gt;
  &lt;span&gt;{{ banner.position }}. {{ banner.title }}&lt;/span&gt;
  &lt;button @click="moveBanner(index, -1)"&gt;▲&lt;/button&gt;
  &lt;button @click="moveBanner(index, 1)"&gt;▼&lt;/button&gt;
&lt;/div&gt;</code></pre>
      </div>
    </section>

    <!-- ━━━ 히어로 배너 캐러셀 ━━━ -->
    <section class="cm__section">
      <h2 class="cm__section-title">히어로 배너 슬라이더</h2>
      <p class="cm__section-desc">자동재생, 페이드 트랜지션, 인디케이터를 갖춘 배너 슬라이더입니다. 로딩 중 스켈레톤 → 로드 완료 상태를 모두 보여줍니다.</p>

      <!-- 로딩/자동재생 컨트롤 -->
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
        <DsButton class="ds-button--secondary" @click="heroLoading = !heroLoading" style="font-size: 0.75rem; padding: 0.375rem 0.75rem;">
          {{ heroLoading ? '로딩 완료 시뮬레이션' : '로딩 상태 보기' }}
        </DsButton>
        <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: #5a6970; cursor: pointer;">
          <DsSwitch v-model="heroAutoPlay" />
          자동재생
        </label>
      </div>

      <!-- 히어로 슬라이더 -->
      <div class="cm__hero">
        <!-- 로딩 스켈레톤 -->
        <template v-if="heroLoading">
          <div class="cm__hero-skeleton">
            <div class="cm__hero-skeleton-shimmer"></div>
            <div class="cm__hero-skeleton-content">
              <div class="cm__hero-skeleton-line" style="width: 40%; height: 1.5rem;"></div>
              <div class="cm__hero-skeleton-line" style="width: 60%; height: 0.875rem; margin-top: 0.75rem;"></div>
            </div>
          </div>
        </template>

        <!-- 로드된 슬라이더 -->
        <template v-else>
          <div class="cm__hero-viewport">
            <div
              v-for="(slide, idx) in heroSlides"
              :key="slide.id"
              class="cm__hero-slide"
              :class="{ 'cm__hero-slide--active': idx === heroIndex }"
              :style="{ background: slide.gradient }"
            >
              <!-- 오버레이 배지 -->
              <span v-if="slide.badge" class="cm__overlay-badge" :class="{
                'cm__overlay-badge--new': slide.badge === 'NEW',
                'cm__overlay-badge--top': slide.badge === 'TOP 10',
              }">{{ slide.badge }}</span>
              <div class="cm__hero-text">
                <h3 class="cm__hero-slide-title">{{ slide.title }}</h3>
                <p class="cm__hero-slide-subtitle">{{ slide.subtitle }}</p>
              </div>
            </div>
          </div>
          <!-- 좌우 화살표 -->
          <button class="cm__hero-arrow cm__hero-arrow--left" @click="heroPrev">‹</button>
          <button class="cm__hero-arrow cm__hero-arrow--right" @click="heroNext">›</button>
          <!-- 인디케이터 -->
          <div class="cm__hero-indicators">
            <button
              v-for="(slide, idx) in heroSlides"
              :key="slide.id"
              class="cm__hero-dot"
              :class="{ 'cm__hero-dot--active': idx === heroIndex }"
              @click="heroIndex = idx; startHeroAutoPlay()"
            ></button>
          </div>
        </template>
      </div>
    </section>

    <!-- ━━━ 콘텐츠 캐러셀 (가로 스크롤) ━━━ -->
    <section class="cm__section">
      <div class="cm__section-row">
        <div>
          <h2 class="cm__section-title">콘텐츠 캐러셀</h2>
          <p class="cm__section-desc">좌우 화살표 + 드래그 스크롤 기반 가로 캐러셀입니다. 카드에 오버레이 배지가 적용됩니다.</p>
        </div>
        <div style="display: flex; gap: 0.375rem;">
          <DsButton class="ds-button--secondary" @click="carouselLoading = !carouselLoading" style="font-size: 0.75rem; padding: 0.375rem 0.75rem;">
            {{ carouselLoading ? '로딩 완료' : '로딩 보기' }}
          </DsButton>
        </div>
      </div>

      <div class="cm__carousel-wrapper">
        <button class="cm__carousel-arrow cm__carousel-arrow--left" @click="scrollCarousel(-1)">‹</button>

        <!-- 로딩 스켈레톤 -->
        <div v-if="carouselLoading" class="cm__carousel-track">
          <div v-for="i in 5" :key="i" class="cm__carousel-card-skeleton">
            <div class="cm__carousel-skel-img"></div>
            <div class="cm__carousel-skel-line" style="width: 70%;"></div>
            <div class="cm__carousel-skel-line" style="width: 40%;"></div>
          </div>
        </div>

        <!-- 로드된 캐러셀 -->
        <div v-else ref="carouselScrollRef" class="cm__carousel-track">
          <div v-for="card in carouselCards" :key="card.id" class="cm__carousel-card">
            <div class="cm__carousel-card-img" :style="{ background: card.gradient }">
              <span v-if="card.badge" class="cm__overlay-badge" :class="{
                'cm__overlay-badge--new': card.badge === 'NEW',
                'cm__overlay-badge--top': card.badge === 'TOP 10',
              }">{{ card.badge }}</span>
            </div>
            <div class="cm__carousel-card-body">
              <span class="cm__carousel-card-cat">{{ card.category }}</span>
              <span class="cm__carousel-card-title">{{ card.title }}</span>
              <span class="cm__carousel-card-views">{{ card.views.toLocaleString() }} views</span>
            </div>
          </div>
        </div>

        <button class="cm__carousel-arrow cm__carousel-arrow--right" @click="scrollCarousel(1)">›</button>
      </div>

      <!-- 코드 보기 -->
      <button class="cm__code-toggle" @click="showCarouselCode = !showCarouselCode">
        {{ showCarouselCode ? '코드 숨기기' : '코드 보기' }}
      </button>
      <div v-show="showCarouselCode" class="cm__code">
        <pre v-pre><code>&lt;!-- DsHeroBanner 패턴 --&gt;
&lt;DsHeroBanner
  :slides="heroSlides"
  :auto-play="true"
  :interval="4000"
  transition="fade"
&gt;
  &lt;template #slide="{ slide }"&gt;
    &lt;DsOverlayBadge v-if="slide.badge" :label="slide.badge" /&gt;
    &lt;h3&gt;{{ slide.title }}&lt;/h3&gt;
  &lt;/template&gt;
  &lt;template #loading&gt;
    &lt;DsSkeleton variant="rectangular" width="100%" height="320px" /&gt;
  &lt;/template&gt;
&lt;/DsHeroBanner&gt;

&lt;!-- DsCarousel 패턴 --&gt;
&lt;DsCarousel :items="carouselCards" :visible="4" :gap="16"&gt;
  &lt;template #item="{ item }"&gt;
    &lt;DsMediaCard :title="item.title" :thumbnail="item.img"&gt;
      &lt;DsOverlayBadge v-if="item.badge" :label="item.badge" /&gt;
    &lt;/DsMediaCard&gt;
  &lt;/template&gt;
  &lt;template #loading&gt;
    &lt;DsSkeleton v-for="i in 4" variant="rectangular" height="200px" /&gt;
  &lt;/template&gt;
&lt;/DsCarousel&gt;</code></pre>
      </div>
    </section>

    <!-- ━━━ 미디어 카드 (레이지 로딩 + 배지 + 사이즈 variant) ━━━ -->
    <section class="cm__section">
      <div class="cm__section-row">
        <div>
          <h2 class="cm__section-title">미디어 카드 &amp; 레이지 로딩</h2>
          <p class="cm__section-desc">Intersection Observer 기반 레이지 로딩, 오버레이 배지(NEW/TOP 10/19+), 가로/세로/정방형 variant입니다.</p>
        </div>
        <div style="display: flex; gap: 0.25rem;">
          <button
            v-for="v in (['vertical', 'horizontal', 'square'] as const)"
            :key="v"
            class="cm__variant-btn"
            :class="{ 'cm__variant-btn--active': cardVariant === v }"
            @click="cardVariant = v; lazyLoaded = new Set(); nextTick(() => setupLazyObserver())"
          >{{ v === 'vertical' ? '세로형' : v === 'horizontal' ? '가로형' : '정방형' }}</button>
        </div>
      </div>

      <div
        ref="cardContainerRef"
        class="cm__card-grid"
        :class="'cm__card-grid--' + cardVariant"
      >
        <div
          v-for="card in mediaCards"
          :key="card.id"
          :data-card-id="card.id"
          class="cm__media-card"
          :class="'cm__media-card--' + cardVariant"
        >
          <!-- 이미지 영역 (lazy) -->
          <div class="cm__media-card-img" :class="'cm__media-card-img--' + cardVariant">
            <!-- 스켈레톤 (로딩 중) -->
            <div v-if="!lazyLoaded.has(card.id)" class="cm__lazy-skeleton">
              <div class="cm__lazy-shimmer"></div>
            </div>
            <!-- 로드된 이미지 -->
            <div v-else class="cm__lazy-loaded" :style="{ background: card.gradient }">
              <!-- 오버레이 배지 -->
              <span v-if="card.badge" class="cm__overlay-badge" :class="{
                'cm__overlay-badge--new': card.badge === 'NEW',
                'cm__overlay-badge--top': card.badge === 'TOP 10',
                'cm__overlay-badge--age': card.badge === '19+',
              }">{{ card.badge }}</span>
            </div>
          </div>
          <!-- 정보 -->
          <div class="cm__media-card-info">
            <span class="cm__media-card-cat">{{ card.category }}</span>
            <span class="cm__media-card-title">{{ card.title }}</span>
            <span class="cm__media-card-views">{{ card.views.toLocaleString() }} views</span>
          </div>
        </div>
      </div>

      <!-- 코드 보기 -->
      <button class="cm__code-toggle" @click="showCardCode = !showCardCode">
        {{ showCardCode ? '코드 숨기기' : '코드 보기' }}
      </button>
      <div v-show="showCardCode" class="cm__code">
        <pre v-pre><code>&lt;!-- DsMediaCard + DsLazyImage + DsOverlayBadge 패턴 --&gt;
&lt;DsMediaCard variant="vertical"&gt; &lt;!-- 'horizontal' | 'vertical' | 'square' --&gt;
  &lt;template #image&gt;
    &lt;DsLazyImage :src="card.thumbnail" alt="썸네일"&gt;
      &lt;template #placeholder&gt;
        &lt;DsSkeleton variant="rectangular" width="100%" height="100%" /&gt;
      &lt;/template&gt;
    &lt;/DsLazyImage&gt;
    &lt;DsOverlayBadge label="NEW" /&gt;      &lt;!-- position: absolute top-left --&gt;
    &lt;DsOverlayBadge label="TOP 10" /&gt;   &lt;!-- 스타일 자동 매핑 --&gt;
    &lt;DsOverlayBadge label="19+" /&gt;      &lt;!-- 연령 제한 배지 --&gt;
  &lt;/template&gt;
  &lt;template #body&gt;
    &lt;span class="category"&gt;{{ card.category }}&lt;/span&gt;
    &lt;span class="title"&gt;{{ card.title }}&lt;/span&gt;
  &lt;/template&gt;
&lt;/DsMediaCard&gt;</code></pre>
      </div>
    </section>

    <!-- ━━━ 실시간 검색 & 멀티 필터 & 정렬 ━━━ -->
    <section class="cm__section">
      <h2 class="cm__section-title">실시간 검색 &amp; 필터</h2>
      <p class="cm__section-desc">디바운스 자동완성 + 초성검색(ㄱㅅㅊ → 기생충) + 키워드 하이라이팅, 칩 형태 멀티 필터, 정렬 드롭다운 조합입니다.</p>

      <div class="cm__filter-bar">
        <!-- 자동완성 검색 -->
        <div class="cm__autocomplete">
          <DsInput
            :model-value="autoCompleteQuery"
            @update:model-value="handleAutoComplete"
            @focus="autoCompleteQuery.trim() && (autoCompleteOpen = true)"
            @blur="setTimeout(() => autoCompleteOpen = false, 200)"
            placeholder="콘텐츠 검색 (디바운스 300ms)"
            style="width: 280px;"
          />
          <div v-show="autoCompleteOpen && autoCompleteResults.length > 0" class="cm__autocomplete-dropdown">
            <div
              v-for="item in autoCompleteResults"
              :key="item.id"
              class="cm__autocomplete-item"
              @mousedown.prevent="selectAutoComplete(item.title)"
            >
              <span v-html="highlightMatch(item.title)"></span>
              <span class="cm__autocomplete-cat">{{ item.category }}</span>
            </div>
          </div>
          <div v-show="autoCompleteOpen && autoCompleteQuery.trim() && autoCompleteResults.length === 0" class="cm__autocomplete-dropdown">
            <div class="cm__autocomplete-empty">검색 결과 없음</div>
          </div>
        </div>

        <!-- 멀티 필터 칩 -->
        <div class="cm__filter-chips">
          <button
            v-for="cat in filterCategories"
            :key="cat"
            class="cm__filter-chip"
            :class="{ 'cm__filter-chip--active': activeFilters.includes(cat) }"
            @click="toggleFilter(cat)"
          >
            {{ cat }}
            <span v-if="activeFilters.includes(cat)" class="cm__filter-chip-x">&times;</span>
          </button>
          <button
            v-if="activeFilters.length > 0"
            class="cm__filter-clear"
            @click="clearFilters"
          >필터 초기화</button>
        </div>

        <!-- 정렬 드롭다운 -->
        <div class="cm__sort-area">
          <DsSelect
            v-model="currentSort"
            :options="sortOptions"
            placeholder="정렬"
            style="width: 130px;"
          />
        </div>
      </div>

      <!-- 필터 적용 결과 미리보기 -->
      <div v-if="activeFilters.length > 0" style="margin-top: 1rem;">
        <span class="cm__status-label">활성 필터</span>
        <div class="cm__active-filter-row">
          <span v-for="f in activeFilters" :key="f" class="cm__active-chip">
            {{ f }} <button class="cm__active-chip-x" @click="toggleFilter(f)">&times;</button>
          </span>
          <span style="font-size: 0.75rem; color: #5a6970; margin-left: 0.5rem;">
            {{ filteredResults.length }}건 일치
          </span>
        </div>
      </div>

      <!-- 결과 카드 그리드 -->
      <div class="cm__filter-results">
        <div class="cm__filter-results-header">
          <span class="cm__status-label">검색 결과 ({{ filteredResults.length }}건)</span>
          <span style="font-size: 0.75rem; color: #a9b4b9;">
            정렬: {{ sortOptions.find(o => o.value === currentSort)?.label ?? '최신순' }}
          </span>
        </div>

        <!-- 빈 결과 -->
        <div v-if="filteredResults.length === 0" class="cm__filter-empty">
          <div class="cm__filter-empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a9b4b9" stroke-width="1.5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <p class="cm__filter-empty-title">검색 결과가 없습니다</p>
          <p class="cm__filter-empty-desc">다른 검색어를 입력하거나 필터를 조정해 보세요.</p>
          <button class="cm__filter-empty-btn" @click="autoCompleteQuery = ''; debouncedQuery = ''; clearFilters()">필터 초기화</button>
        </div>

        <!-- 결과 그리드 -->
        <div v-else class="cm__poster-grid">
          <div
            v-for="item in filteredResults"
            :key="item.id"
            class="cm__poster-card"
          >
            <div class="cm__poster-card-img">
              <img :src="item.poster" :alt="item.title" loading="lazy" />
              <span v-if="item.badge" class="cm__overlay-badge" :class="{
                'cm__overlay-badge--new': item.badge === 'NEW',
                'cm__overlay-badge--top': item.badge === 'TOP 10',
                'cm__overlay-badge--age': item.badge === '19+',
              }">{{ item.badge }}</span>
            </div>
            <div class="cm__poster-card-body">
              <span class="cm__poster-card-cat">{{ item.category }}</span>
              <span class="cm__poster-card-title">{{ item.title }}</span>
              <div class="cm__poster-card-meta">
                <span>{{ item.views.toLocaleString() }} views</span>
                <span class="cm__poster-card-rating">★ {{ item.rating }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 코드 보기 -->
      <button class="cm__code-toggle" @click="showFilterCode = !showFilterCode">
        {{ showFilterCode ? '코드 숨기기' : '코드 보기' }}
      </button>
      <div v-show="showFilterCode" class="cm__code">
        <pre v-pre><code>&lt;!-- DsAutoComplete 패턴 --&gt;
&lt;DsAutoComplete
  v-model="query"
  :items="searchItems"
  :debounce="300"
  highlight
  placeholder="콘텐츠 검색"
  @select="handleSelect"
/&gt;

&lt;!-- DsMultiFilter (칩 형태 멀티셀렉트) --&gt;
&lt;DsMultiFilter
  v-model="activeFilters"
  :options="['배너', '아티스트', '프로모션', '가이드', '공지']"
  clearable
/&gt;

&lt;!-- DsSortDropdown (정렬 + URL 쿼리 동기화) --&gt;
&lt;DsSortDropdown
  v-model="currentSort"
  :options="[
    { value: 'latest', label: '최신순' },
    { value: 'popular', label: '인기순' },
    { value: 'views', label: '조회순' },
  ]"
  sync-url
/&gt;</code></pre>
      </div>
    </section>

    <!-- ━━━ 등록 Drawer ━━━ -->
    <DsDrawer v-model="registerDrawerOpen" position="right" width="560px">
      <template #header>
        <div style="width: 100%;">
          <h3 style="font-size: 1rem; font-weight: 600; margin: 0 0 1.25rem; color: #2a3439;">콘텐츠 등록</h3>
          <DsSteps :steps="registerSteps" :current="currentStep" />
        </div>
      </template>

      <!-- Step 0 -->
      <div v-show="currentStep === 0" class="cm__form-step">
        <DsFormItem label="콘텐츠 제목" required>
          <DsInput v-model="formTitle" placeholder="제목을 입력하세요" />
        </DsFormItem>
        <DsFormItem label="카테고리" required>
          <DsSelect
            v-model="formCategory"
            :options="categoryOptions.filter(o => o.value !== '')"
            placeholder="카테고리 선택"
          />
        </DsFormItem>
      </div>

      <!-- Step 1 -->
      <div v-show="currentStep === 1" class="cm__form-step">
        <DsFormItem label="본문 내용">
          <DsTextarea v-model="formBody" placeholder="콘텐츠 본문을 작성하세요" :min-rows="6" />
        </DsFormItem>
        <DsFormItem label="이미지 첨부">
          <DsFileUpload v-model="formFiles" accept="image/*" :max-size="10" multiple />
        </DsFormItem>
      </div>

      <!-- Step 2 -->
      <div v-show="currentStep === 2" class="cm__form-step">
        <DsFormItem label="공개 여부">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <DsSwitch v-model="formIsPublic" />
            <span style="font-size: 0.813rem; color: #5a6970;">
              {{ formIsPublic ? '공개' : '비공개' }}
            </span>
          </div>
        </DsFormItem>
        <DsFormItem label="예약 게시일">
          <DsInput v-model="formScheduleDate" placeholder="YYYY-MM-DD" />
        </DsFormItem>
        <div class="cm__form-summary">
          <span class="cm__status-label">등록 요약</span>
          <div class="cm__summary-grid">
            <span class="cm__summary-label">제목</span>
            <span class="cm__summary-value">{{ formTitle || '—' }}</span>
            <span class="cm__summary-label">카테고리</span>
            <span class="cm__summary-value">{{ formCategory || '—' }}</span>
            <span class="cm__summary-label">본문</span>
            <span class="cm__summary-value">{{ formBody ? formBody.slice(0, 40) + (formBody.length > 40 ? '...' : '') : '—' }}</span>
            <span class="cm__summary-label">첨부파일</span>
            <span class="cm__summary-value">{{ formFiles.length }}개</span>
            <span class="cm__summary-label">공개</span>
            <span class="cm__summary-value">{{ formIsPublic ? '공개' : '비공개' }}</span>
          </div>
        </div>
      </div>

      <template #footer>
        <div style="display: flex; gap: 0.5rem; justify-content: flex-end; width: 100%;">
          <DsButton class="ds-button--secondary" @click="registerDrawerOpen = false">취소</DsButton>
          <DsButton v-if="currentStep > 0" class="ds-button--secondary" @click="prevStep">이전</DsButton>
          <DsButton v-if="currentStep < registerSteps.length - 1" @click="nextStep">다음</DsButton>
          <DsButton v-if="currentStep === registerSteps.length - 1" @click="submitContent">등록</DsButton>
        </div>
      </template>
    </DsDrawer>

    <!-- ━━━ 삭제 확인 Modal ━━━ -->
    <DsModal v-model="deleteModalOpen">
      <template #header>
        <span style="font-size: 1rem; font-weight: 600;">콘텐츠 삭제</span>
      </template>
      <div style="width: 360px;">
        <p style="font-size: 0.875rem; color: #5a6970; margin: 0;">
          <strong style="color: #2a3439;">{{ deletingContent?.title }}</strong>을(를) 삭제하시겠습니까?
          <span style="color: #9f403d; font-size: 0.813rem; margin-top: 0.5rem; display: block;">이 작업은 되돌릴 수 없습니다.</span>
        </p>
      </div>
      <template #footer>
        <DsButton class="ds-button--secondary" @click="deleteModalOpen = false">취소</DsButton>
        <DsButton style="background: #9f403d; color: #fff;" @click="confirmDelete">삭제</DsButton>
      </template>
    </DsModal>

  </div>
</template>

<style scoped>
/* ─── 레이아웃 ─── */
.cm {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

/* ─── 페이지 헤더 ─── */
.cm__header {
  margin-bottom: 2.5rem;
}

.cm__title {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #2a3439;
  margin: 0;
}

.cm__subtitle {
  font-size: 0.875rem;
  color: #5a6970;
  margin: 0.5rem 0 0;
  line-height: 1.6;
}

/* ─── 섹션 ─── */
.cm__section {
  margin-bottom: 3.5rem;
}

.cm__section-title {
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #2a3439;
  margin: 0 0 0.25rem;
}

.cm__section-desc {
  font-size: 0.813rem;
  color: #5a6970;
  margin: 0 0 1.25rem;
  line-height: 1.6;
}

/* ─── 대시보드 스탯 ─── */
.cm__stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.cm__stat-skeleton {
  height: 88px;
  background: #f0f4f7;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(169, 180, 185, 0.2);
}

/* ─── 테이블 액션 트리거 ─── */
.cm__action-trigger {
  background: none;
  border: 1px solid rgba(169, 180, 185, 0.4);
  cursor: pointer;
  padding: 0.25rem 0.6rem;
  font-size: 0.813rem;
  color: #2a3439;
  transition: background 150ms;
}

.cm__action-trigger:hover {
  background: #f0f4f7;
}

/* ─── 상태 흐름 ─── */
.cm__status-flow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  padding: 1.5rem;
  background: #ffffff;
  border: 1px solid rgba(169, 180, 185, 0.2);
}

.cm__status-flow-left,
.cm__status-flow-right {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cm__status-current {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cm__status-label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #5a6970;
}

.cm__status-badges {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.cm__flow-chips {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.cm__flow-chip {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: #f0f4f7;
  color: #2a3439;
  border: 1px solid rgba(169, 180, 185, 0.2);
}

.cm__flow-chip--active {
  background: #5f5e5e;
  color: #faf7f6;
  border-color: #5f5e5e;
}

.cm__flow-chip--error {
  background: transparent;
  color: #9f403d;
  border-color: #9f403d;
}

.cm__flow-arrow {
  font-size: 0.75rem;
  color: #a9b4b9;
}

/* ─── 배너 순서 편집 ─── */
.cm__banner-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid rgba(169, 180, 185, 0.2);
}

.cm__banner-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  background: #ffffff;
  border-bottom: 1px solid rgba(169, 180, 185, 0.12);
  transition: background 150ms;
}

.cm__banner-item:last-child {
  border-bottom: none;
}

.cm__banner-item:hover {
  background: #f7f9fb;
}

.cm__banner-pos {
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #5a6970;
  background: #f0f4f7;
  flex-shrink: 0;
}

.cm__banner-thumb {
  width: 48px;
  height: 32px;
  background: linear-gradient(155deg, #5f5e5e, #535252);
  flex-shrink: 0;
}

.cm__banner-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.cm__banner-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #2a3439;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cm__banner-id {
  font-size: 0.75rem;
  color: #a9b4b9;
}

.cm__banner-actions {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.cm__banner-btn {
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  background: transparent;
  border: 1px solid rgba(169, 180, 185, 0.3);
  color: #5a6970;
  cursor: pointer;
  transition: background 150ms, color 150ms;
}

.cm__banner-btn:hover:not(:disabled) {
  background: #f0f4f7;
  color: #2a3439;
}

.cm__banner-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

/* ─── 등록 폼 스텝 ─── */
.cm__form-step {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.cm__form-summary {
  margin-top: 0.5rem;
  padding: 1rem;
  background: #f7f9fb;
  border: 1px solid rgba(169, 180, 185, 0.2);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cm__summary-grid {
  display: grid;
  grid-template-columns: 5rem 1fr;
  gap: 0.5rem 1rem;
  font-size: 0.813rem;
}

.cm__summary-label {
  color: #5a6970;
  font-weight: 500;
}

.cm__summary-value {
  color: #2a3439;
}

/* ─── 코드 보기 ─── */
.cm__code-toggle {
  margin-top: 1rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  color: #5a6970;
  background: #f0f4f7;
  border: 1px solid rgba(169, 180, 185, 0.2);
  cursor: pointer;
  transition: background 150ms;
}

.cm__code-toggle:hover {
  background: #e8eff3;
}

.cm__code {
  margin-top: 0.75rem;
  border: 1px solid rgba(169, 180, 185, 0.2);
  overflow: hidden;
}

.cm__code pre {
  margin: 0;
  padding: 1rem;
  background: #1e1e2e;
  overflow-x: auto;
}

.cm__code code {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.8rem;
  line-height: 1.6;
  color: #cdd6f4;
  white-space: pre;
}

/* ─── 섹션 row (제목 + 우측 컨트롤) ─── */
.cm__section-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.cm__section-row .cm__section-title { margin-bottom: 0.25rem; }
.cm__section-row .cm__section-desc  { margin-bottom: 0; }

/* ─── 히어로 배너 ─── */
.cm__hero {
  position: relative;
  width: 100%;
  height: 320px;
  overflow: hidden;
}

.cm__hero-skeleton {
  width: 100%;
  height: 100%;
  background: #e8eff3;
  position: relative;
  overflow: hidden;
}

.cm__hero-skeleton-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
  animation: cm-shimmer 1.5s infinite;
}

@keyframes cm-shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.cm__hero-skeleton-content {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
}

.cm__hero-skeleton-line {
  background: #d9e4ea;
}

.cm__hero-viewport {
  width: 100%;
  height: 100%;
  position: relative;
}

.cm__hero-slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
}

.cm__hero-slide--active {
  opacity: 1;
  pointer-events: auto;
}

.cm__hero-text {
  padding: 2.5rem;
  width: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%);
}

.cm__hero-slide-title {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin: 0;
}

.cm__hero-slide-subtitle {
  font-size: 0.875rem;
  color: rgba(255,255,255,0.8);
  margin: 0.5rem 0 0;
  line-height: 1.6;
}

.cm__hero-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.2);
  color: #ffffff;
  font-size: 1.25rem;
  cursor: pointer;
  transition: background 150ms;
  z-index: 2;
}

.cm__hero-arrow:hover { background: rgba(255,255,255,0.3); }
.cm__hero-arrow--left  { left: 1rem; }
.cm__hero-arrow--right { right: 1rem; }

.cm__hero-indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 2;
}

.cm__hero-dot {
  width: 8px;
  height: 8px;
  background: rgba(255,255,255,0.4);
  border: none;
  cursor: pointer;
  transition: background 150ms, width 150ms;
}

.cm__hero-dot--active {
  background: #ffffff;
  width: 24px;
}

/* ─── 오버레이 배지 ─── */
.cm__overlay-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.2rem 0.5rem;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  z-index: 1;
}

.cm__overlay-badge--new {
  background: #2563eb;
  color: #ffffff;
}

.cm__overlay-badge--top {
  background: #f59e0b;
  color: #2a3439;
}

.cm__overlay-badge--age {
  background: #9f403d;
  color: #ffffff;
}

/* ─── 콘텐츠 캐러셀 ─── */
.cm__carousel-wrapper {
  position: relative;
}

.cm__carousel-track {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  padding: 0.25rem 0;
}

.cm__carousel-track::-webkit-scrollbar { display: none; }

.cm__carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid rgba(169, 180, 185, 0.3);
  color: #2a3439;
  font-size: 1rem;
  cursor: pointer;
  z-index: 2;
  transition: background 150ms;
  box-shadow: 0 10px 40px rgba(42, 52, 57, 0.04);
}

.cm__carousel-arrow:hover { background: #f0f4f7; }
.cm__carousel-arrow--left  { left: -0.5rem; }
.cm__carousel-arrow--right { right: -0.5rem; }

/* 캐러셀 카드 */
.cm__carousel-card {
  flex-shrink: 0;
  width: 240px;
  scroll-snap-align: start;
  cursor: pointer;
  transition: transform 150ms;
}

.cm__carousel-card:hover { transform: translateY(-2px); }

.cm__carousel-card-img {
  width: 100%;
  height: 140px;
  position: relative;
  overflow: hidden;
}

.cm__carousel-card-body {
  padding: 0.75rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.cm__carousel-card-cat {
  font-size: 0.625rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #a9b4b9;
}

.cm__carousel-card-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #2a3439;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cm__carousel-card-views {
  font-size: 0.75rem;
  color: #5a6970;
  font-variant-numeric: tabular-nums;
}

/* 캐러셀 스켈레톤 */
.cm__carousel-card-skeleton {
  flex-shrink: 0;
  width: 240px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cm__carousel-skel-img {
  width: 100%;
  height: 140px;
  background: #e8eff3;
  position: relative;
  overflow: hidden;
}

.cm__carousel-skel-img::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
  animation: cm-shimmer 1.5s infinite;
}

.cm__carousel-skel-line {
  height: 0.75rem;
  background: #e8eff3;
  position: relative;
  overflow: hidden;
}

.cm__carousel-skel-line::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
  animation: cm-shimmer 1.5s infinite;
}

/* ─── 미디어 카드 그리드 ─── */
.cm__card-grid {
  display: grid;
  gap: 1.25rem;
}

.cm__card-grid--vertical {
  grid-template-columns: repeat(3, 1fr);
}

.cm__card-grid--horizontal {
  grid-template-columns: repeat(2, 1fr);
}

.cm__card-grid--square {
  grid-template-columns: repeat(3, 1fr);
}

/* 미디어 카드 */
.cm__media-card {
  overflow: hidden;
  transition: transform 150ms;
  cursor: pointer;
}

.cm__media-card:hover { transform: translateY(-2px); }

.cm__media-card--vertical {
  display: flex;
  flex-direction: column;
}

.cm__media-card--horizontal {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.cm__media-card--square {
  display: flex;
  flex-direction: column;
}

/* 미디어 카드 이미지 */
.cm__media-card-img {
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.cm__media-card-img--vertical {
  width: 100%;
  aspect-ratio: 16 / 10;
}

.cm__media-card-img--horizontal {
  width: 180px;
  height: 120px;
}

.cm__media-card-img--square {
  width: 100%;
  aspect-ratio: 1;
}

/* 레이지 로딩 */
.cm__lazy-skeleton {
  width: 100%;
  height: 100%;
  background: #e8eff3;
  position: relative;
  overflow: hidden;
}

.cm__lazy-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
  animation: cm-shimmer 1.5s infinite;
}

.cm__lazy-loaded {
  width: 100%;
  height: 100%;
  position: relative;
  animation: cm-fade-in 0.3s ease;
}

@keyframes cm-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* 미디어 카드 정보 */
.cm__media-card-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.75rem 0 0;
}

.cm__media-card--horizontal .cm__media-card-info {
  padding: 0.25rem 0;
  justify-content: center;
}

.cm__media-card-cat {
  font-size: 0.625rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #a9b4b9;
}

.cm__media-card-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #2a3439;
  line-height: 1.4;
}

.cm__media-card-views {
  font-size: 0.75rem;
  color: #5a6970;
  font-variant-numeric: tabular-nums;
}

/* variant 버튼 */
.cm__variant-btn {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  background: transparent;
  border: 1px solid rgba(169, 180, 185, 0.3);
  color: #5a6970;
  cursor: pointer;
  transition: all 150ms;
}

.cm__variant-btn--active {
  background: #5f5e5e;
  color: #faf7f6;
  border-color: #5f5e5e;
}

/* ─── 실시간 검색 & 필터 ─── */
.cm__filter-bar {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  flex-wrap: wrap;
}

/* 자동완성 */
.cm__autocomplete {
  position: relative;
}

.cm__autocomplete-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: #ffffff;
  border: 1px solid rgba(169, 180, 185, 0.3);
  max-height: 240px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 10px 40px rgba(42, 52, 57, 0.04);
}

.cm__autocomplete-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  font-size: 0.813rem;
  color: #2a3439;
  cursor: pointer;
  transition: background 150ms;
}

.cm__autocomplete-item:hover {
  background: #f7f9fb;
}

.cm__autocomplete-cat {
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #a9b4b9;
  flex-shrink: 0;
}

.cm__autocomplete-empty {
  padding: 1rem 0.75rem;
  font-size: 0.813rem;
  color: #5a6970;
  text-align: center;
}

:deep(.cm__highlight) {
  background: #f59e0b33;
  color: inherit;
  padding: 0 1px;
}

/* 멀티 필터 칩 */
.cm__filter-chips {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
  align-items: center;
}

.cm__filter-chip {
  padding: 0.375rem 0.625rem;
  font-size: 0.75rem;
  background: #f0f4f7;
  border: 1px solid rgba(169, 180, 185, 0.2);
  color: #2a3439;
  cursor: pointer;
  transition: all 150ms;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.cm__filter-chip:hover {
  background: #e8eff3;
}

.cm__filter-chip--active {
  background: #5f5e5e;
  color: #faf7f6;
  border-color: #5f5e5e;
}

.cm__filter-chip-x {
  font-size: 0.875rem;
  line-height: 1;
  margin-left: 0.125rem;
}

.cm__filter-clear {
  padding: 0.375rem 0.5rem;
  font-size: 0.75rem;
  background: transparent;
  border: none;
  color: #9f403d;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.cm__sort-area {
  margin-left: auto;
}

/* 활성 필터 표시 */
.cm__active-filter-row {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.cm__active-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  background: #f0f4f7;
  border: 1px solid rgba(169, 180, 185, 0.2);
  color: #2a3439;
}

.cm__active-chip-x {
  background: none;
  border: none;
  font-size: 0.875rem;
  color: #5a6970;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.cm__active-chip-x:hover {
  color: #9f403d;
}

/* ─── 필터 결과 그리드 ─── */
.cm__filter-results {
  margin-top: 1.5rem;
}

.cm__filter-results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

/* ─── 포스터 그리드 ─── */
.cm__poster-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.cm__poster-card {
  cursor: pointer;
  transition: transform 150ms;
}

.cm__poster-card:hover {
  transform: translateY(-3px);
}

.cm__poster-card-img {
  width: 100%;
  aspect-ratio: 2 / 3;
  position: relative;
  overflow: hidden;
  background: #e8eff3;
}

/*
 * object-fit 전략: 포스터 사이즈가 다를 때
 *
 * 1) cover (현재 적용) — 컨테이너를 꽉 채우고 넘치는 부분 크롭.
 *    장점: 그리드가 깔끔하게 정렬됨.
 *    단점: 포스터 상/하단이 잘릴 수 있음.
 *
 * 2) contain — 포스터 전체를 보여주되 빈 영역은 배경색 처리.
 *    장점: 포스터가 잘리지 않음.
 *    단점: letterbox(좌우/상하 여백) 발생.
 *    적용법: object-fit: contain; + 부모에 background: #1e1e2e;
 *
 * 3) 하이브리드 — 비율 차이가 임계값(10%) 이내면 cover,
 *    그 이상이면 contain으로 자동 전환.
 *    DsLazyImage에서 onload 시 naturalWidth/Height 비교 후 클래스 토글.
 *
 * 4) object-position — cover 사용 시 크롭 기준점 조정.
 *    인물 포스터는 object-position: top center; 로 얼굴 보존.
 */
.cm__poster-card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
}

.cm__poster-card-body {
  padding: 0.625rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.cm__poster-card-cat {
  font-size: 0.625rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #a9b4b9;
}

.cm__poster-card-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2a3439;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cm__poster-card-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.6875rem;
  color: #5a6970;
  font-variant-numeric: tabular-nums;
  margin-top: 0.25rem;
}

.cm__poster-card-rating {
  color: #f59e0b;
  font-weight: 500;
}

/* 빈 결과 상태 */
.cm__filter-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  background: #f7f9fb;
  border: 1px solid rgba(169, 180, 185, 0.15);
}

.cm__filter-empty-icon {
  margin-bottom: 1rem;
}

.cm__filter-empty-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2a3439;
  margin: 0;
}

.cm__filter-empty-desc {
  font-size: 0.813rem;
  color: #5a6970;
  margin: 0.375rem 0 0;
}

.cm__filter-empty-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  background: #5f5e5e;
  color: #faf7f6;
  border: none;
  cursor: pointer;
  transition: background 150ms;
}

.cm__filter-empty-btn:hover {
  background: #535252;
}
</style>
