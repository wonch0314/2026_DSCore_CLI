# KTDS-UI Components

`components/` 디렉토리에 포함된 UI 컴포넌트 목록입니다. (총 48개 + index)

---

## General

| 컴포넌트 | 파일 | 설명 |
|----------|------|------|
| Button | `Button.jsx` | 다양한 variant와 크기, 아이콘을 지원하는 범용 버튼 |
| ButtonArea | `ButtonArea.jsx` | 버튼들을 정렬 방향에 따라 묶어주는 컨테이너 |
| IconButton | `IconButton.jsx` | 아이콘만 보이고 레이블은 스크린리더용으로 숨기는 아이콘 버튼 |
| Fab | `Fab.jsx` | 화면에 고정되는 플로팅 액션 버튼 (하위 버튼 그룹 펼침 지원) |
| Icon | `Icon.jsx` | CSS 클래스 기반 아이콘 렌더링 |
| Link | `Link.jsx` | CSR 내부 링크(`to`)와 SSR/외부 링크(`href`)를 모두 지원 |
| Loading | `Loading.jsx` | SVG 스피너 애니메이션 로딩 표시 |
| Empty | `Empty.jsx` | 데이터 없음 빈 상태 표시 (아이콘, 제목, 설명, 액션 버튼) |

## Typography

| 컴포넌트 | 파일 | 설명 |
|----------|------|------|
| Heading | `Heading.jsx` | h1~h6 또는 strong 태그로 렌더링되는 제목 텍스트 |
| Text | `Text.jsx` | p/span/strong/label 태그, 크기/굵기/색상/말줄임 지원 본문 텍스트 |
| Mark | `Mark.jsx` | 텍스트 내 강조 표시 (`<mark>` 기반) |

## Form

| 컴포넌트 | 파일 | 설명 |
|----------|------|------|
| Form | `Form.jsx` | inline/grid 레이아웃을 지원하는 폼 컨테이너 (FormContext 제공) |
| FormItem | `FormItem.jsx` | 레이블 + 입력 + 에러 메시지를 묶는 폼 항목 |
| Input | `Input.jsx` | 텍스트/비밀번호 등 다양한 type, 지우기/비밀번호 보기 기능 포함 입력 필드 |
| Textarea | `Textarea.jsx` | 자동 높이 조절, 글자수 카운트, 최대 길이 제한 지원 멀티라인 입력 |
| Select | `Select.jsx` | Popover 기반 셀렉트 드롭다운 |
| Checkbox | `Checkbox.jsx` | controlled/uncontrolled 모드 지원 단일 체크박스 |
| CheckboxGroup | `CheckboxGroup.jsx` | 옵션 배열로부터 체크박스 목록 생성, 선택 값 배열 관리 |
| Radio | `Radio.jsx` | controlled/uncontrolled 모드 지원 단일 라디오 버튼 |
| RadioGroup | `RadioGroup.jsx` | 옵션 배열로부터 라디오 버튼 그룹 생성, 단일 선택 값 관리 |
| Switch | `Switch.jsx` | 체크박스 기반 토글 온/오프 스위치 |
| DatePicker | `DatePicker.jsx` | 단일 날짜 또는 날짜 범위 선택 달력 팝오버 |
| FileUploader | `FileUploader.jsx` | 파일 선택/Drag & Drop 업로드, 파일 목록 표시, 다운로드/삭제 지원 |
| Combobox | `Combobox.jsx` | 드롭다운 열기/닫기를 위한 트리거 버튼 |
| Rate | `Rate.jsx` | 아이콘 클릭/호버/키보드로 별점을 선택하는 평가 컴포넌트 |

## Data Display

| 컴포넌트 | 파일 | 설명 |
|----------|------|------|
| Table | `Table.jsx` | 정렬, 다중/단일 행 선택, 중첩 헤더, 가로 스크롤, 고정 높이 지원 데이터 테이블 |
| Card | `Card.jsx` | 미디어/콘텐츠/플로팅 영역으로 구성된 카드 레이아웃 |
| Badge | `Badge.jsx` | 숫자, 상태, 아이콘을 표시하는 배지 레이블 |
| Tag | `Tag.jsx` | 아이콘/레이블 표시, 닫기 버튼으로 삭제 가능한 태그 |
| Chip | `Chip.jsx` | 체크박스 기반 선택 가능한 필터/태그 칩 |
| Avatar | `Avatar.jsx` | 이미지/아이콘/텍스트로 표시되는 사용자 아바타 (배지 겹침 지원) |
| Chart | `Chart.jsx` | Chart.js 래핑, line/bar/doughnut/pie 차트 렌더링 |
| Progress | `Progress.jsx` | value/max 비율 진행률 바 |

## Feedback

| 컴포넌트 | 파일 | 설명 |
|----------|------|------|
| Dialog | `Dialog.jsx` | 제목, 부제목, 콘텐츠, 버튼 영역을 가진 모달 다이얼로그 (Portal) |
| AlertDialog | `AlertDialog.jsx` | 확인/취소 버튼이 있는 알림 다이얼로그 (Portal) |
| Tooltip | `Tooltip.jsx` | hover/click 이벤트, 4방향 위치 지원 툴팁 (Portal) |
| Popover | `Popover.jsx` | 트리거 요소 기준 자동 위치 계산 팝오버 레이어 (Portal) |
| Admonition | `Admonition.jsx` | 아이콘과 제목을 포함한 알림/경고 블록 (note, tip, danger, caution, info) |

## Navigation

| 컴포넌트 | 파일 | 설명 |
|----------|------|------|
| TabList | `TabList.jsx` | 키보드 방향키 탐색 지원 탭 목록 + 패널 |
| MenuTab | `MenuTab.jsx` | 개별 닫기 가능, 키보드 방향키 탐색 지원 메뉴 탭 |
| Breadcrumb | `Breadcrumb.jsx` | 페이지 경로 계층 표시 (중간 항목 생략 지원) |
| TreeMenu | `TreeMenu.jsx` | 계층적 트리 구조 펼침/접힘 탐색 (radio/checkbox 선택 지원) |
| DropdownMenu | `DropdownMenu.jsx` | Combobox 또는 커스텀 트리거로 옵션 목록 팝오버 표시 |
| Pagination | `Pagination.jsx` | basic/ellipsis 모드, 페이지 크기 변경, 페이지 직접 이동 지원 |
| Anchor | `Anchor.jsx` | 페이지 내 섹션 스크롤 이동 및 현재 위치 표시 앵커 네비게이션 |
| NavBottom | `NavBottom.jsx` | 아이콘/레이블/배지 구성 모바일 하단 네비게이션 바 |

## Layout

| 컴포넌트 | 파일 | 설명 |
|----------|------|------|
| Stack | `Stack.jsx` | 수평/수직 방향 자식 요소 정렬 flex 레이아웃 컨테이너 |

## Utility

| 컴포넌트 | 파일 | 설명 |
|----------|------|------|
| FocusTrap | `FocusTrap.jsx` | 모달 등에서 Tab 키 포커스를 컨테이너 내부로 제한하는 접근성 유틸리티 |
| AnimationState | `AnimationState.jsx` | `isActive` 상태에 따라 show/hide 애니메이션 상태 관리 |

## Entry Point

| 파일 | 설명 |
|------|------|
| `index.jsx` | 위 컴포넌트들을 모두 재익스포트하는 진입점 |
