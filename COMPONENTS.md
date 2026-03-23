# dscore-ui-vue Components

> 총 45개 컴포넌트 | 플러그인: `DsCore` | 스타일: `@layer ds-base` + CSS Custom Properties

---

## Core

| # | 컴포넌트 | 파일 | 설명 |
|---|---------|------|------|
| 1 | DsSpinner | `DsSpinner.vue` | SVG 로딩 스피너 |
| 2 | DsButton | `DsButton.vue` | 로딩/쓰로틀/비동기 자동감지 버튼 (primary/secondary/tertiary) |
| 3 | DsInput | `DsInput.vue` | 디바운스/검증 입력 필드 |
| 4 | DsModal | `DsModal.vue` | 모달 다이얼로그 (ESC/오버레이/포커스트랩/body scroll lock) |

## Form

| # | 컴포넌트 | 파일 | 설명 |
|---|---------|------|------|
| 5 | DsTextarea | `DsTextarea.vue` | 자동 높이 조절 텍스트영역 (minRows/maxRows) |
| 6 | DsSelect | `DsSelect.vue` | 커스텀 셀렉트 드롭다운 (검색/클리어/키보드) |
| 7 | DsCheckbox | `DsCheckbox.vue` | 체크박스 (단일 boolean / 배열 다중선택 / 불확정) |
| 8 | DsRadio | `DsRadio.vue` | 라디오 버튼 (v-model 단일값) |
| 9 | DsRadioGroup | `DsRadioGroup.vue` | 라디오 그룹 (options prop, horizontal/vertical) |
| 10 | DsSwitch | `DsSwitch.vue` | 토글 스위치 (커스텀 active/inactive 값) |
| 11 | DsNumberInput | `DsNumberInput.vue` | 숫자 입력 (증감 버튼, 천단위 포맷, 정밀도, long press) |
| 12 | DsFormItem | `DsFormItem.vue` | 라벨 + 입력 + 에러 메시지 wrapper (필수 표시) |
| 13 | DsForm | `DsForm.vue` | 폼 오케스트레이터 (검증 통합, 변경 감지, 서버 에러 매핑) |

## Feedback

| # | 컴포넌트 | 파일 | 설명 |
|---|---------|------|------|
| 14 | DsToast | `DsToast.vue` | 토스트 알림 (success/error/warning/info, 위치 설정) |
| 15 | DsConfirm | `DsConfirm.vue` | 확인 다이얼로그 (Promise 기반, info/warning/danger) |
| 16 | DsAlert | `DsAlert.vue` | 인라인 알림 (info/success/warning/error, 닫기 가능) |
| 17 | DsProgress | `DsProgress.vue` | 진행률 바 (value/max, indeterminate, striped/animated) |
| 18 | DsSkeleton | `DsSkeleton.vue` | 로딩 스켈레톤 (text/circular/rectangular, pulse/wave) |

## Data Display

| # | 컴포넌트 | 파일 | 설명 |
|---|---------|------|------|
| 19 | DsTable | `DsTable.vue` | 데이터 테이블 (행 선택, 컬럼 정렬, 셀 슬롯 커스텀) |
| 20 | DsPagination | `DsPagination.vue` | 페이지네이션 (ellipsis, prev/next, aria) |
| 21 | DsEmpty | `DsEmpty.vue` | 빈 상태 표시 (아이콘/액션 슬롯) |
| 22 | DsStatusTag | `DsStatusTag.vue` | 상태 뱃지 (active/inactive/pending/rejected/completed) |
| 23 | DsBadge | `DsBadge.vue` | 숫자/dot 뱃지 (max 초과 시 99+) |
| 24 | DsAvatar | `DsAvatar.vue` | 프로필 이미지 + 이니셜 fallback |
| 25 | DsDescription | `DsDescription.vue` | 라벨:값 상세 표시 (2열/3열 Grid) |
| 26 | DsStatCard | `DsStatCard.vue` | 대시보드 통계 카드 (값 + 증감 표시) |

## Navigation

| # | 컴포넌트 | 파일 | 설명 |
|---|---------|------|------|
| 27 | DsTabs | `DsTabs.vue` | 고정 탭 전환 (키보드, aria) |
| 28 | DsMenuTab | `DsMenuTab.vue` | 동적 탭 관리 (닫기/추가/제거, 스크롤) |
| 29 | DsBreadcrumb | `DsBreadcrumb.vue` | 경로 표시 (router-link/a/span) |

## Layout

| # | 컴포넌트 | 파일 | 설명 |
|---|---------|------|------|
| 30 | DsCard | `DsCard.vue` | 카드 컨테이너 (header/body/footer, flat/elevated) |
| 31 | DsCollapse | `DsCollapse.vue` | 접기/펴기 (height 애니메이션) |
| 32 | DsSteps | `DsSteps.vue` | 단계 진행 표시 (horizontal/vertical) |
| 33 | DsTimeline | `DsTimeline.vue` | 이력/로그 타임라인 |

## Overlay

| # | 컴포넌트 | 파일 | 설명 |
|---|---------|------|------|
| 34 | DsDropdown | `DsDropdown.vue` | 액션 드롭다운 메뉴 (click outside, ESC) |
| 35 | DsTooltip | `DsTooltip.vue` | 툴팁 (top/right/bottom/left, delay) |
| 36 | DsPopover | `DsPopover.vue` | 클릭 팝오버 (4방향, teleport) |
| 37 | DsDrawer | `DsDrawer.vue` | 사이드 슬라이드 패널 (left/right, overlay, scroll lock) |

## Advanced Input

| # | 컴포넌트 | 파일 | 설명 |
|---|---------|------|------|
| 38 | DsDatePicker | `DsDatePicker.vue` | 날짜 선택 캘린더 (min/max, 포맷) |
| 39 | DsDateRangePicker | `DsDateRangePicker.vue` | 날짜 범위 선택 (프리셋: 오늘/이번주/이번달 등) |
| 40 | DsTagInput | `DsTagInput.vue` | 태그 입력 (추가/삭제, 중복 방지, 최대 개수) |
| 41 | DsFileUpload | `DsFileUpload.vue` | 파일 업로드 (드래그앤드롭, 타입/사이즈 검증) |
| 42 | DsTreeSelect | `DsTreeSelect.vue` | 트리 선택/탐색 (select/navigate 모드, 검색, 다중선택) |
| 43 | DsTransfer | `DsTransfer.vue` | 좌우 이동 선택 (검색, 체크박스, 전체선택) |

## BO 특화

| # | 컴포넌트 | 파일 | 설명 |
|---|---------|------|------|
| 44 | DsSearchBar | `DsSearchBar.vue` | 검색 조건 폼 + 검색/초기화 버튼 통합 |
| 45 | DsActionBar | `DsActionBar.vue` | 목록 상단 액션 버튼 모음 (선택 개수 표시) |

---

## 플러그인

| 이름 | 설명 |
|------|------|
| `DsCore` | 전역 설정 플러그인 (`applyDefaultStyle`, `defaults`, `icons`, `spinner`) |

## 스타일 시스템

| 파일 | 설명 |
|------|------|
| `styles/variables.css` | CSS Custom Properties (colors, typography, spacing, elevation) |

- 모든 컴포넌트 스타일은 `@layer ds-base` 안에 정의
- 사용자 CSS가 항상 우선 (layer 밖 > layer 안)
- `applyDefaultStyle: false`로 전체 스타일 제거 가능
- 컴포넌트별 `:apply-default-style="false"`로 개별 제거 가능
