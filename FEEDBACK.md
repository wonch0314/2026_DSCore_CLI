# HUMAN

## Date Picker

- 다 좋은데 "<", ">"는 월이동이잖아, "<<", ">>" 는 년도 이동으로 만들어줘
- min/max는 달 단위만 선택할 수 있어? 앞뒤 몇주, 몇달, 올해만? 옵션이 조금 더 있으면 좋겠다
- 그리고 이 경우에 CSS 커스텀이 어려울거 같은데 (일, 월 등. ㅗ여질게 많으니까)
- 프리셋 포함은 뭐야?

## TagInput

- TagInput 현재 구성도 좋은데, 입력하면 하단에 태그 정보가 추가되는 방식은 어떄

## DsFileUpload

- 파일 업로드 하면 파일 확장자(형식)에 따라서 아이콘으로 보여주면 좋을거 같아
- 이미지 첨부하면, 이미지 미리보기도 가능하도록
- 좌측(사진 or 어떤 파일인지 보여줄 아이콘), 우측(파일 이름, 사이즈
  ![이거처럼](<Group 1.png>)

## DsTreeSelect

- (샘플 페이지에 샘플 데이터가 있으면 좋겠다. 빈것만 나오니까 힘드네)

## DsTransfer

- 초성검색도 지원해야겠다

## DsDropdown

- hover 했을 때, 뜨는 색상이 같으니까, 조금 톤을 달리해서 보여줘야겠다.

## DsBreadcrumb

- Breadcrumb에 링크가 지정되어있지 않으면, hover 했을 때. 클릭 마우스 모양이 뜨지 않게 하자

## DsTabs

- (샘플 페이지) 탭 이동해도 데이터 유지되는거 보여주기 위해서 form이든, table이든 구성해보자

## DsCollapse

- "<", ">" 으로 열고 닫는모양은 직관적이지 않은데, 상하모양의 꺽쇠로 바꿔줄래

## DsTimeline

- (샘플 페이지) 완료 상태가 아닌거도 좀 보여줘야지

## DsTable

- (샘플 페이지) Sorting이 안되고 있는거 같은데, 샘플 페이지만 이런거야 컴퍼넌트가 문제야?
- 데이터가 로딩 중일 때 loading spinner를 보여주는 식으로 해주면 좋을거 같은데 방법 있을까?

## DsBadge

- 무언가를 체크하면 해당 숫자가 사라지는 구조여야 하잖아? 이거도 그렇게 동작할 수. ㅣㅆ는건가?

## DsDescription

- 2열, 3열을 어떻게 쓰면 될까?

# AI

---

Date Picker

< > 는 월이동, << >> 는 년도 이동으로

- 현재 월 이동만 구현되어 있습니다. << >> 버튼을 헤더 양쪽 끝에 추가하여 연도 단위 이동을
  넣을 수 있습니다. 구현 가능합니다.

min/max 옵션 확장 (앞뒤 몇주, 몇달, 올해만 등)

- 현재 minDate, maxDate prop이 YYYY-MM-DD 문자열 기반입니다. 이걸 확장해서 상대적 제한  
  옵션을 추가할 수 있습니다:
  - relativeMin="-2w" (2주 전), relativeMax="+3m" (3개월 후), relativeRange="year"  
    (올해만) 같은 shorthand 지원
  - 또는 preset prop으로 "thisYear", "lastMonth", "next2Weeks" 등 미리 정의된 범위 제공

CSS 커스텀 어려울 것 같다

- 현재 CSS 변수(--ds-\*) 기반으로 되어 있어서 색상/폰트 등은 커스텀 가능합니다. 다만  
  일(day), 월(month) 셀 각각의 세밀한 스타일링이 필요하면 slot 기반 커스텀 또는 CSS part  
  셀렉터를 추가하는 방식으로 개선할 수 있습니다.

프리셋 포함은 뭐야?

- "오늘", "어제", "최근 7일", "이번 달", "지난 달" 같은 빠른 선택 버튼을 캘린더 옆에  
  배치하는 기능입니다. DateRangePicker에서 자주 쓰이는 패턴입니다. 필요하시면 구현  
  가능합니다.

---

TagInput

입력하면 하단에 태그 정보가 추가되는 방식은?

- 현재는 인라인(입력창 옆)에 태그가 나열됩니다. 하단 배치 방식도 가능합니다 — layout  
  prop을 추가해서 "inline" (현재) / "below" (입력창 아래 별도 영역) 모드를 선택하게 할 수  
  있습니다.

---

DsFileUpload

파일 확장자에 따른 아이콘 + 이미지 미리보기 + 레이아웃

- 참조 이미지 확인했습니다. PowerPoint 아이콘 + 파일명/사이즈가 우측에 나오는 구조네요.
- 구현 방향:
  - 확장자별 아이콘 매핑 (.pptx → PPT 아이콘, .xlsx → Excel 아이콘, .pdf → PDF 아이콘 등)
  - 이미지 파일(.png, .jpg 등)은 URL.createObjectURL()로 썸네일 미리보기 표시
  - 레이아웃: 좌측(아이콘/썸네일) + 우측(파일명, 사이즈) 가로 배치
- 충분히 구현 가능합니다.

---

DsTreeSelect

샘플 데이터가 없어서 확인이 어렵다

- 맞습니다. 샘플 페이지에 부서 트리, 카테고리 트리 같은 예시 데이터를 넣어야 합니다.

---

DsTransfer

초성검색 지원

- 현재 단순 includes() 기반 검색입니다. 한글 초성 분리 로직(ㄱ → 가~깋 범위 매칭)을 검색
  함수에 추가하면 됩니다. 유틸 함수 하나로 해결 가능합니다.

---

DsDropdown

hover 색상이 같아서 구분이 안 된다

- 현재 hover 시 --ds-accent 색상을 그대로 사용합니다. hover 상태에 약간 밝은/어두운 톤의
  배경색을 적용하면 됩니다. 예: background: var(--ds-bg-hover) 같은 별도 변수 추가.

---

DsBreadcrumb

링크 없으면 클릭 커서 안 뜨게

- 코드를 보니 이미 링크 없는 항목은 <span>으로 렌더링하고 있어서 cursor: default가  
  적용되어야 하는데, 실제로 그렇게 동작하는지 확인이 필요합니다. CSS에서 명시적으로 cursor:
  default를 잡아주면 확실합니다.

---

DsTabs

탭 이동해도 데이터 유지되는 걸 보여주는 샘플

- 컴포넌트 자체는 Vue의 v-show 또는 keep-alive로 데이터 유지가 가능합니다. 샘플 페이지에
  탭별로 form/table을 넣어서 탭 전환 후에도 입력값이 보존되는 것을 시연하면 됩니다.

---

DsCollapse

< > 대신 상하 꺽쇠(∨ ∧)로 변경

- 현재 화살표가 좌우 방향(< >)으로 되어 있는 것 같습니다. ∨ (닫힘) → ∧ (열림) 또는 ▼ → ▲
  방향으로 변경하면 훨씬 직관적입니다. CSS border 방향만 바꾸면 됩니다.

---

DsTimeline

완료 상태가 아닌 것도 보여줘야

- 컴포넌트는 type prop으로 success, error, warning 등을 지원합니다. 샘플 페이지에 진행  
  중(info), 대기(default), 실패(error) 상태도 포함시키면 됩니다.

---

DsTable

Sorting이 안 되는 것 같다

- 컴포넌트에 sorting 로직은 구현되어 있습니다(sortable prop, sortKey, sortOrder). 다만  
  컴포넌트가 직접 데이터를 정렬하지 않고 이벤트만 emit하는 구조일 수 있습니다. 샘플  
  페이지에서 @update:sortKey 이벤트를 받아서 실제 데이터를 정렬하는 코드가 있는지 확인이  
  필요합니다.

로딩 중 spinner

- loading prop은 이미 있습니다. 다만 현재는 opacity 변경만 하고 내장 스피너가 없습니다.  
  DsSpinner 컴포넌트를 테이블 중앙에 오버레이로 보여주는 방식으로 추가할 수 있습니다.

---

DsBadge

체크하면 숫자가 사라지는 동작?

- Badge 자체는 표시 전용 컴포넌트입니다. 숫자 변경/사라짐은 부모 컴포넌트에서 value와  
  hidden prop을 제어하면 됩니다. 예: 알림을 읽으면 value를 줄이거나 hidden=true로 설정.  
  컴포넌트 자체에 이 로직을 넣을 필요는 없고, 사용 예시를 샘플에서 보여주면 충분합니다.

---

DsDescription

2열, 3열 사용법?

- columns prop으로 설정합니다:  
  <DsDescription :items="items" :columns="2" /> <!-- 2열 -->
  <DsDescription :items="items" :columns="3" /> <!-- 3열 -->
- 특정 항목을 넓게 쓰려면 item에 span: 2 또는 span: 3을 지정하면 해당 열 수만큼  
  차지합니다.

---

요약 — 구현이 필요한 작업

┌──────────┬─────────────────────────────────────────────────────────────────┬────────┐
│ 우선순위 │ 항목 │ 난이도 │  
 ├──────────┼─────────────────────────────────────────────────────────────────┼────────┤  
 │ 높음 │ DatePicker 연도 이동 (<< >>) │ 낮음 │
├──────────┼─────────────────────────────────────────────────────────────────┼────────┤  
 │ 높음 │ FileUpload 아이콘/미리보기/레이아웃 개선 │ 중간 │  
 ├──────────┼─────────────────────────────────────────────────────────────────┼────────┤  
 │ 높음 │ Transfer 초성검색 │ 낮음 │  
 ├──────────┼─────────────────────────────────────────────────────────────────┼────────┤  
 │ 높음 │ Collapse 꺽쇠 방향 변경 │ 낮음 │
├──────────┼─────────────────────────────────────────────────────────────────┼────────┤  
 │ 높음 │ Table 내장 로딩 스피너 │ 낮음 │
├──────────┼─────────────────────────────────────────────────────────────────┼────────┤  
 │ 중간 │ Dropdown hover 색상 차별화 │ 낮음 │
├──────────┼─────────────────────────────────────────────────────────────────┼────────┤  
 │ 중간 │ Breadcrumb 커서 확인/수정 │ 낮음 │
├──────────┼─────────────────────────────────────────────────────────────────┼────────┤  
 │ 중간 │ DatePicker 프리셋/상대적 min-max │ 중간 │
├──────────┼─────────────────────────────────────────────────────────────────┼────────┤  
 │ 낮음 │ 샘플 페이지 개선 (TreeSelect, Tabs, Timeline, Table sorting, │ 중간 │
│ │ Badge) │ │  
 └──────────┴─────────────────────────────────────────────────────────────────┴────────┘

구현 진행할까요? 우선순위별로 하나씩, 아니면 한번에 처리할 수도 있습니다.

# HUMAN

- DatePicker의 css 스타일링 가이드는 필여하겠다. (이외에도 복합 컴포넌트의 스타일링은 가이드가 필요할 수 있음)
- DsTransfer 좋아, 초성검색 기능 추가해
- DsTabs 그래. 그걸 샘플 페이지에 구현해줘
- DsCollapse "▼ → ▲" 이 조합이 좋네
- DsTimeline 도 샘플페이지에 구현해줘
- DsTable 확인하고 샘플 페이지에 소팅/멀티소팅도 구현해. 그리고 샘플 페이지에는 처음에 데이터가 없는 상태로 두고, 5초후에 보여주는 식으로 하자
- DsDescription은... 애매하다 조금

- (공통) 샘플페이지 밑에 해당되는 코드도 작성해줘

# AI (2차)

## 완료된 작업

### DsTransfer — 초성검색 추가

- `DsTransfer.vue`에 한글 초성 분리/매칭 로직(`getChosung`, `isChosungOnly`, `matchesSearch`) 내장
- "ㅅㅇㅈ" 입력 시 "사용자 조회", "사용자 생성" 등 자동 필터링
- 기존 일반 검색(substring)도 그대로 동작
- 샘플 페이지(AdvancedInputView)에 초성검색 안내 문구 및 코드 예시 추가

### DsCollapse — ▼/▲ 아이콘 변경

- CSS `::before` 의 border 기반 화살표를 `content: '▼'` 텍스트 기반으로 변경
- 열림 시 `transform: rotate(180deg)`로 ▲ 표시 (기존 애니메이션 유지)

### DsTabs — 샘플 페이지 데이터 유지 데모

- 3개 탭: "입력 폼" (DsInput, DsSelect), "데이터 목록" (DsTable), "설정" (DsCheckbox, DsSelect)
- 탭 전환 후에도 입력값/설정이 유지되는 것을 시연
- 코드 예시 토글 추가

### DsTimeline — 다양한 상태 샘플

- 기존: success만 사용 → 변경: success, warning, info, error, 기본(빈값) 모두 사용
- 2가지 시나리오 병렬 표시: "주문 배송 추적" + "서버 배포 이력"
- `DsTimeline.vue`에 type별 dot 색상 CSS 추가 (success=#16a34a, error=#d93025, warning=#f59e0b, info=#2563eb)
- 코드 예시 토글 추가

### DsTable — 정렬 동작 + 로딩 시뮬레이션

- 문제: 컴포넌트는 sort 이벤트만 emit하고 실제 정렬은 부모 책임 → 샘플에서 `computed`로 클라이언트 사이드 정렬 구현
- `v-model:sort-key`, `v-model:sort-order` 바인딩으로 정렬 상태 동기화
- 페이지 진입 시 `tableLoading=true`, 5초 후 데이터 표시 + DsSpinner 로딩 UI
- 데이터 8건으로 확장
- 코드 예시 토글 추가

### 공통 — 코드 예시 블록

- 각 섹션 하단에 "코드 보기/숨기기" 토글 버튼 추가
- 다크 테마(#1e1e2e) 코드 블록에 사용 코드 표시

## 미완료 (다음 작업 후보)

- DatePicker: 연도 이동(`<<` `>>`), CSS 스타일링 가이드, 프리셋/상대적 min-max
- FileUpload: 확장자별 아이콘, 이미지 미리보기, 좌우 레이아웃
- TagInput: 하단 배치 모드
- Dropdown: hover 색상 차별화
- Breadcrumb: 비링크 항목 cursor 확인

---

# Human (0324 1447)

✦ 공통으로 빼야 할 것
데이터 테이블
정렬·고정 컬럼·다중 선택·페이지네이션. 콘텐츠 말고 회원·정산·로그 관리에도 동일 패턴
어느 도메인이든 목록 관리엔 테이블
필터 패널 & URL 쿼리 동기화
필터 칩·멀티셀렉트·URL 직렬화 로직. 도메인마다 필드만 다를 뿐 패턴은 동일
설정값만 주입하면 재사용 가능
다단계 폼 (스텝퍼)
단계 이동·유효성 체크·임시저장 흐름. 콘텐츠 등록 외에도 계약·캠페인 등록 등에서 재사용
step 구조와 slot만 공통화
이미지 업로드 & 크롭
드래그앤드롭·비율 크롭·미리보기. 배너·아티스트 프로필 등 여러 도메인에서 동일하게 필요
업로드 엔드포인트만 prop으로
드래그 앤 드롭 순서 편집
sortable list/grid 패턴. 홈 배너·카테고리·메뉴 순서 등 도메인 무관하게 반복 등장
데이터 모델만 다르고 UX는 동일
토스트 & 확인 다이얼로그
성공·실패 피드백, 파괴적 액션 confirm. 전 도메인 공통 UX 패턴
전역 상태로 관리
권한 기반 UI 제어
역할별 노출·disabled 처리. 콘텐츠 외 모든 관리 도메인에 동일하게 적용
권한 로직을 한 곳에서 관리
스켈레톤 & 에러 폴백
레이아웃 타입(테이블·카드·폼)별 skeleton, API 에러 공통 UI
어느 페이지든 로딩/오류 상태 필요

지금 이헣게 피드백이 들어왔는데 공통으로 개발할 영역이 있을거야.
공통 > dscore-ui-vue로 가고, 컨텐츠 관리 도메인은 content-domain으로 보낼거야.

이걸 기준으로 계획표를 작성해봐줄래

# AI (0324 1447)

## 피드백 항목별 분석 — dscore-ui-vue 기존 구현 현황

| #   | 피드백 항목                                           | 기존 컴포넌트         | 상태         | 비고                                                                 |
| --- | ----------------------------------------------------- | --------------------- | ------------ | -------------------------------------------------------------------- |
| 1   | 데이터 테이블 (정렬·고정 컬럼·다중 선택·페이지네이션) | DsTable, DsPagination | ⚠️ 부분 구현 | 정렬·다중선택·페이지네이션 ✅ / **고정 컬럼 미구현**                 |
| 2   | 필터 패널 & URL 쿼리 동기화                           | DsSearchBar           | ⚠️ 부분 구현 | 검색 조건 폼 ✅ / **URL 쿼리 직렬화·필터 칩 미구현**                 |
| 3   | 다단계 폼 (스텝퍼)                                    | DsSteps, DsForm       | ⚠️ 부분 구현 | 스텝 표시 ✅ 폼 유효성 ✅ / **스텝 이동 흐름·임시저장 미구현**       |
| 4   | 이미지 업로드 & 크롭                                  | DsFileUpload          | ⚠️ 부분 구현 | 드래그앤드롭·파일검증 ✅ / **비율 크롭·이미지 미리보기 미구현**      |
| 5   | 드래그 앤 드롭 순서 편집                              | —                     | ❌ 미구현    | sortable list/grid 패턴 전체 신규                                    |
| 6   | 토스트 & 확인 다이얼로그                              | DsToast, DsConfirm    | ✅ 이미 구현 | success/error/warning/info 토스트 + Promise 기반 confirm             |
| 7   | 권한 기반 UI 제어                                     | —                     | ❌ 미구현    | dscore-auth에 인증 모듈은 있으나 **UI 제어(v-permission 등)는 없음** |
| 8   | 스켈레톤 & 에러 폴백                                  | DsSkeleton            | ⚠️ 부분 구현 | text/circular/rectangular 스켈레톤 ✅ / **에러 폴백 UI 미구현**      |

---

## 패키지 분류 계획

### 📦 dscore-ui-vue (공통 컴포넌트 라이브러리)

> 도메인에 무관하게 어디서든 재사용되는 UI 컴포넌트·컴포저블·유틸

#### A. 기존 컴포넌트 보강 (Enhancement)

| 우선순위 | 대상         | 작업 내용                                                             | 난이도 |
| -------- | ------------ | --------------------------------------------------------------------- | ------ |
| 🔴 높음  | DsTable      | 고정 컬럼(sticky column) 지원 추가                                    | 중간   |
| 🔴 높음  | DsTable      | 내장 로딩 스피너 오버레이 (loading prop 활용)                         | 낮음   |
| 🔴 높음  | DsFileUpload | 확장자별 아이콘 + 이미지 미리보기 + 좌우 레이아웃                     | 중간   |
| 🟡 중간  | DsSearchBar  | 필터 칩 UI + 멀티셀렉트 필터 지원                                     | 중간   |
| 🟡 중간  | DsSteps      | 스텝 이동 제어 API (next/prev/goTo + validation hook)                 | 중간   |
| 🟡 중간  | DsSkeleton   | 레이아웃 타입별 프리셋 (table-skeleton, card-skeleton, form-skeleton) | 낮음   |

#### B. 신규 공통 컴포넌트

| 우선순위 | 컴포넌트        | 설명                                              | 난이도 |
| -------- | --------------- | ------------------------------------------------- | ------ |
| 🔴 높음  | DsSortableList  | 드래그 앤 드롭 순서 편집 (list/grid 모드)         | 높음   |
| 🔴 높음  | DsImageCropper  | 비율 크롭 + 미리보기 (DsFileUpload 연동)          | 높음   |
| 🔴 높음  | DsErrorFallback | API 에러 공통 UI (retry 버튼, 상태 코드별 메시지) | 낮음   |
| 🟡 중간  | DsFilterChip    | 필터 조건 칩 (삭제 가능, DsSearchBar 연동)        | 낮음   |

#### C. 신규 공통 컴포저블/유틸

| 우선순위 | 이름              | 설명                                                | 난이도 |
| -------- | ----------------- | --------------------------------------------------- | ------ |
| 🔴 높음  | useUrlQuery       | URL 쿼리 파라미터 ↔ 필터 상태 양방향 동기화         | 중간   |
| 🔴 높음  | usePermission     | 역할/권한 기반 UI 제어 (v-permission 디렉티브 포함) | 중간   |
| 🟡 중간  | useDraftSave      | 폼 임시저장 (localStorage/sessionStorage 기반)      | 낮음   |
| 🟡 중간  | useInfiniteScroll | 무한 스크롤 (선택적, 페이지네이션 대안)             | 낮음   |

---

### 📦 content-domain (콘텐츠 관리 도메인)

> dscore-ui-vue 위에서 콘텐츠 관리 업무에 특화된 조합 컴포넌트·페이지 템플릿

| 우선순위 | 컴포넌트/모듈     | 설명                                                                    | 의존성        |
| -------- | ----------------- | ----------------------------------------------------------------------- | ------------- |
| 🔴 높음  | ContentListPage   | 목록 페이지 템플릿 (DsSearchBar + DsTable + DsPagination + useUrlQuery) | dscore-ui-vue |
| 🔴 높음  | ContentFormPage   | 등록/수정 폼 템플릿 (DsSteps + DsForm + useDraftSave)                   | dscore-ui-vue |
| 🔴 높음  | ImageUploadField  | 이미지 업로드 필드 (DsFileUpload + DsImageCropper + 업로드 API 연동)    | dscore-ui-vue |
| 🟡 중간  | BannerOrderEditor | 배너/카테고리 순서 편집 (DsSortableList + 저장 API)                     | dscore-ui-vue |
| 🟡 중간  | ContentStatusFlow | 상태 전이 UI (심사중→승인→게시 등, DsStatusTag + DsTimeline 조합)       | dscore-ui-vue |
| 🟢 낮음  | ContentDashboard  | 대시보드 (DsStatCard + 차트 + DsTable 조합)                             | dscore-ui-vue |

---

## 구현 로드맵

```
Phase 1 (1~2주) — 공통 기반 강화
├── DsTable 고정 컬럼 + 로딩 스피너
├── DsFileUpload 아이콘/미리보기/레이아웃
├── DsErrorFallback 신규
├── useUrlQuery 신규
└── usePermission 신규 (+ v-permission 디렉티브)

Phase 2 (2~3주) — 공통 신규 컴포넌트
├── DsSortableList (드래그 앤 드롭)
├── DsImageCropper
├── DsFilterChip + DsSearchBar 연동
├── DsSteps 이동 제어 API 보강
└── DsSkeleton 프리셋 추가

Phase 3 (3~4주) — content-domain 조합
├── ContentListPage 템플릿
├── ContentFormPage 템플릿
├── ImageUploadField
├── BannerOrderEditor
└── ContentStatusFlow
```

---

## 핵심 설계 원칙

1. **dscore-ui-vue는 도메인을 모른다** — 순수 UI 컴포넌트 + 범용 컴포저블만. API 호출, 비즈니스 로직 없음
2. **content-domain은 dscore-ui-vue를 조합한다** — 공통 컴포넌트를 slot/prop으로 조합하여 도메인 페이지 구성
3. **설정값 주입 패턴** — content-domain에서 필드 정의, 엔드포인트, 권한 키 등을 설정 객체로 주입하면 공통 컴포넌트가 렌더링
4. **다른 도메인(회원·정산·로그)도 같은 패턴** — content-domain과 동일한 구조로 `member-domain`, `settlement-domain` 등 확장 가능

이 방향으로 진행할까요? 우선순위나 분류 조정이 필요하면 말씀해주세요.

# Human (0324 1455)

- 컨텐츠 도메인은 우선 sample-ui에 구현하도록 지시했어.
- 공통 영역 컴포넌트 구현부터 진행해줘

# AI

## 완료된 작업 (0324 — 공통 컴포넌트 Phase 1)

### 기존 컴포넌트 보강 (Enhancement)

#### DsTable — 고정 컬럼 + 로딩 스피너

- Column interface에 `fixed: 'left' | 'right'` 옵션 추가
- 고정 컬럼 시 `position: sticky` + z-index 자동 적용, 다중 고정 컬럼 오프셋 자동 계산
- 로딩 시 기존 데이터 위에 반투명 오버레이 + SVG 스피너 표시
- 데이터 없는 상태에서 로딩 시 테이블 중앙에 스피너 표시

#### DsFileUpload — 아이콘/미리보기/레이아웃

- 확장자별 아이콘 매핑 (PDF/XLS/PPT/DOC/ZIP/CSV 등 11종, 색상 구분)
- 이미지 파일 자동 감지 + `URL.createObjectURL()` 썸네일 미리보기 (40x40)
- 파일 목록 레이아웃 개선: 좌(아이콘/썸네일) + 중앙(파일명/사이즈) + 우(삭제)

#### DsSkeleton — 레이아웃 프리셋

- `preset` prop 추가: `'table' | 'card' | 'form' | 'list'`
- `rows` prop으로 행 수 조절 가능
- 각 프리셋별 실제 레이아웃과 유사한 스켈레톤 구조 렌더링
- 기존 단일 스켈레톤 기능 그대로 유지

#### DsDropdown — hover 색상 차별화

- hover: `color-mix(in srgb, accent 60%, transparent)` 적용으로 선택 상태와 구분
- active/selected 항목은 기존 accent 색상 유지

#### DsBreadcrumb — 비링크 항목 cursor 수정

- 링크 없는 항목에 `pointer-events: none` 추가
- hover 시 색상 변경/클릭 커서 완전 방지

### 신규 공통 컴포넌트

#### DsErrorFallback

- API 에러 공통 UI 컴포넌트
- HTTP 상태 코드별 기본 메시지 (400/403/404/500)
- `status`, `title`, `description`, `showRetry` props
- retry 이벤트 emit, slot으로 커스텀 콘텐츠 삽입 가능

#### DsFilterChip

- 필터 조건 칩 컴포넌트 (label:value 형태)
- `closable` prop으로 삭제 버튼 표시
- pill 스타일 (border-radius: 9999px)
- DsSearchBar와 연동하여 활성 필터 표시 용도

### 신규 공통 컴포저블

#### useUrlQuery

- URL 쿼리 파라미터 ↔ 필터 상태 양방향 동기화
- `history.replaceState` 사용 (히스토리 오염 방지)
- 디바운스 지원 (기본 300ms)
- 배열/불리언/숫자 자동 직렬화/역직렬화
- `reset()`, `setFilter()`, `getQueryString()` 메서드 제공

#### usePermission + v-permission 디렉티브

- 역할/권한 기반 UI 제어 시스템
- `setupPermission()` — 앱 초기화 시 권한 설정
- `updatePermissions()` — 로그인 후 동적 권한 업데이트
- `usePermission()` 컴포저블 — `hasPermission()`, `hasRole()`, `hasAllPermissions()`
- `v-permission` 디렉티브 — 요소 숨김 처리 (기본), `.disable` 수정자로 비활성화 처리
- `PermissionPlugin` — `app.use()` 플러그인으로 전역 등록 가능

---

### 파일 변경 목록

| 구분 | 파일 | 작업 |
|------|------|------|
| 보강 | `DsTable.vue` | 고정 컬럼 + 로딩 스피너 오버레이 |
| 보강 | `DsFileUpload.vue` | 확장자 아이콘 + 이미지 미리보기 + 레이아웃 |
| 보강 | `DsSkeleton.vue` | 프리셋 레이아웃 (table/card/form/list) |
| 수정 | `DsDropdown.vue` | hover 색상 차별화 |
| 수정 | `DsBreadcrumb.vue` | 비링크 cursor 수정 |
| 신규 | `DsErrorFallback.vue` | API 에러 폴백 UI |
| 신규 | `DsFilterChip.vue` | 필터 조건 칩 |
| 신규 | `composables/useUrlQuery.ts` | URL 쿼리 동기화 |
| 신규 | `composables/usePermission.ts` | 권한 기반 UI 제어 |
| 신규 | `composables/index.ts` | 컴포저블 barrel export |
| 수정 | `index.ts` | 신규 컴포넌트/컴포저블 export 추가 |

---

## 미완료 (다음 작업 후보)

### Phase 2 — 공통 신규 컴포넌트

- DsSortableList (드래그 앤 드롭 순서 편집)
- DsImageCropper (비율 크롭 + 미리보기)
- DsSteps 스텝 이동 제어 API 보강 (next/prev/goTo + validation hook)
- DsSearchBar 필터 칩 연동 + 멀티셀렉트 지원

### 기존 피드백 미처리 항목

- DatePicker: 연도 이동(`<<` `>>`), CSS 스타일링 가이드, 프리셋/상대적 min-max
- FileUpload: DsImageCropper 연동
- TagInput: 하단 배치 모드
- useDraftSave: 폼 임시저장 컴포저블
- useInfiniteScroll: 무한 스크롤 컴포저블
