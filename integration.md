## HUMAN

기존 것들 중 필요한 것과 궁금한 것들만 나열해볼게

1. IconButton 통합 (이게 있어야할까?)
2. Fab이란게 정확하게 뭐야?
3. 결국 form은 스타일 외에 우리가 만들어서 제공해줄만한 이유가 되는 것들이 있나?? 라는 생각이 들어
4. CheckboxGroup도 필요한가?
5. RadioGroup은 이미 계획이 있었을거고
6. Chart.js는 외부 라이브러리 사용하는거니까 가이드만 주고, 다른 면에서 준비해줄 수 있는게 있다면 준비해주는게 맞겠지. 우리가 이걸 써서 컴포넌트를 만드는건 모르겠네. 직접 다 구현하는거면 모를까
7. MenuTab에 대한 수요가 있었거든, 이거도 통합계획에 포함해줘
8. 왜 DsTreeSelect와 별도야?? DsTreeSelect가 있었어?

추가로 든 생각

1. 테이블로 데이터를 보고 편집까지 하는 기능은 어때? 물론 이러면 리스트 전체로 수정 요청하는 API가 있으면 되겠지만 없다면 각 아이템별로 수정 요청을 하는 API를 입력하도록 해야겠지..?

## AI

### 기존 컴포넌트 관련 답변

**1. IconButton 통합 — 없어도 됨**

DsButton에 icon slot이나 prop만 추가하면 충분함. 별도 컴포넌트로 분리할 만큼 로직 차이가 없음. `<DsButton class="icon-btn"><MyIcon /></DsButton>` 이렇게 쓰면 됨. 스타일은 사용자가 `.icon-btn`으로 처리.

**2. Fab (Floating Action Button)**

화면 우하단에 고정되는 둥근 버튼. 모바일 앱에서 흔히 보이는 "+" 버튼 같은 것. 클릭하면 하위 액션 버튼들이 부채꼴로 펼쳐지는 패턴. BO(백오피스)는 데스크톱 중심이라 수요가 거의 없음. **제외 유지 추천.**

**3. Form — 만들어줄 이유가 있는가?**

있음. 스타일이 아니라 **기능** 측면에서:

- **폼 전체 검증 상태 통합** — 개별 input마다 valid 체크하는 코드 반복 제거. `form.isValid`로 한번에 확인
- **변경 감지** — "저장하지 않은 변경사항이 있습니다" 같은 이탈 방지
- **submit 처리** — 검증 통과 시에만 submit, 중복 submit 방지
- **에러 수집** — 서버 에러를 해당 필드에 자동 매핑

결국 DsForm은 스타일 컴포넌트가 아니라 **폼 로직 오케스트레이터**. `useFormValidation` + `useFormChanged`를 묶어주는 역할이라 가치가 있음.

**4. CheckboxGroup — 별도 컴포넌트 불필요**

DsCheckbox에 배열 v-model 지원만 추가하면 됨. Vue의 v-model 특성상 `<DsCheckbox v-model="selectedItems" value="A" />` 이렇게 배열 바인딩이 자연스러움. 별도 Group 컴포넌트 없이 DsCheckbox 하나로 단일/다중 모두 처리 가능.

**5. RadioGroup**

맞음. DsRadio 계획에 이미 그룹 관리 내장으로 설계되어 있음. 별도 RadioGroup 불필요.

**6. Chart.js — 가이드 + 유틸 제공**

동의. 컴포넌트로 래핑하면 Chart.js 버전 업데이트마다 유지보수 부담이 큼. 대신 제공할 수 있는 것:

- **사용 가이드 문서** — Vue에서 Chart.js 세팅하는 보일러플레이트
- **useChart composable** — canvas ref 바인딩, 인스턴스 생성/파괴 lifecycle 관리, 반응형 데이터 업데이트. 이 정도만 제공하면 차트 종류나 옵션은 사용자가 Chart.js 공식 문서 보고 자유롭게 사용 가능

**7. MenuTab — 통합 계획에 포함**

DsTabs를 확장하거나 별도 **DsMenuTab** 컴포넌트로 추가. 기존 KTDS-UI의 MenuTab 기능:

- 개별 탭 닫기(X) 버튼
- 키보드 방향키 탐색
- 동적 탭 추가/제거

DsTabs와 성격이 달라서(DsTabs = 고정 탭 전환, DsMenuTab = 동적 탭 관리) **별도 컴포넌트로 추가하는 게 맞음.** Phase 5 Navigation에 포함 권장.

**8. DsTreeSelect vs TreeMenu — 혼동 정리**

이전 분석에서 잘못 표현함. 정리하면:

- 기존 KTDS-UI의 **TreeMenu** = 트리 구조 탐색/네비게이션 (사이드 메뉴 같은 용도)
- 신규 계획의 **DsTreeSelect** = 트리 구조에서 **값을 선택**하는 입력 컴포넌트 (조직도에서 부서 선택, 카테고리 선택 등)

용도가 다름. TreeMenu는 네비게이션이고, DsTreeSelect는 폼 입력. 기존에 DsTreeSelect가 있었던 게 아니라 **신규로 추가한 것**이 맞음. TreeMenu(네비게이션용)는 BO에서 사이드바로 수요가 있을 수 있는데, 이건 보통 프로젝트 레이아웃에서 직접 구현하는 영역이라 컴포넌트 라이브러리에 포함할지는 판단 필요.

---

### 추가 의견에 대한 답변

**1. 테이블 인라인 편집 (Editable Table)**

좋은 아이디어. BO에서 수요 많은 패턴임. 구현 방식은 두 가지:

**방식 A: 셀 단위 편집 (권장)**

- 셀 클릭 → input으로 전환 → blur/Enter → 해당 row만 API 호출
- 각 row에 `updateFn` prop으로 API 함수 전달
- 장점: API가 row 단위면 바로 사용 가능, 변경 즉시 반영

**방식 B: 일괄 편집**

- 편집 모드 ON → 여러 셀 수정 → "저장" 버튼 → 변경된 row들만 모아서 API 호출
- `useBatchAction`과 연동 가능
- 장점: 네트워크 요청 최소화

DsTable에 `:editable="true"` prop과 `#cell-edit-{column}` slot으로 편집 UI를 커스텀하게 하면 됨. 별도 컴포넌트보다 DsTable 확장이 자연스러움.

```vue
<DsTable :data="list" :columns="columns" :editable="true">
  <template #cell-edit-name="{ row, save }">
    <DsInput v-model="row.name" @blur="save(row)" />
  </template>
</DsTable>
```

다만 이건 복잡도가 높으니 **Phase 4 이후 별도 확장**으로 진행하는 게 현실적.

## HUMAN

1. 그럼 Form에서는 어떤 기능들을 제공해줄 수 있을까? 지금 구현된거랑 별도로 더 해야하는게 있어?
2. CheckboxGroup이 그런 개념이라면, RadioGroup도 그런 개념으로 보면 되는거 아니야? Radio는 그룹 기능이 있고 얘는 없고. 꼭 있어야 한다는게 아니라 통일성을 잡아야 한다는거지. 이렇게 설계한 이유가 있을 것인지도 궁금하고. 그룹으로 들어갔을 때 Form과 연동하기 쉬운지도
3. 인스턴스 생성/파괴 라이프사이클?? 이게 필요해??
4. MenuTab은 별도로 가져가.
5. MenuTree는 사이드 용이라기 보다는, 트리 구조로 된 메뉴를 보여주는 용도야. 그럼 DSTreeSelect로 통합할 수 있겠네 action을 넣던, 탐색용으로 쓰던
6. DsTable 작성해준 내용 동의

그럼 이제 통합/개발 계획 반영해보고 끝나면 시작해봐

## AI

### 추가 질문 답변

**1. Form에서 제공할 수 있는 기능 — 이미 거의 다 있음**

현재 dscore-starter-vue에 구현된 Form 관련 composable:

| Composable | 기능 | 상태 |
|--|--|--|
| `useFormValidation` | 규칙 기반 검증, 필드별/전체 검증, 에러 추적 | 구현됨 |
| `useFormChanged` | 변경 감지, dirty 상태, reset | 구현됨 |
| `useFormDialog` | 다이얼로그 폼 (생성/수정 모드, submit, 확인 메시지) | 구현됨 |
| `useModalForm` | 모달 폼 (dirty 체크, 로딩 상태) | 구현됨 |
| `useSearchForm` | 검색 폼 (초기화, submit) | 구현됨 |

이미 composable로 로직이 잘 분리되어 있음. DsForm **컴포넌트**가 추가로 해줄 수 있는 것:

- **자식 DsInput/DsSelect 자동 등록** — provide/inject로 폼 안의 입력 컴포넌트들을 자동 수집. 개별 rules를 폼 레벨에서 한번에 validateAll
- **submit 이벤트 통합** — `<DsForm @submit="save">` 하나로 검증 → 통과 시 콜백 실행
- **에러 자동 매핑** — 서버에서 `{ name: "이미 존재합니다" }` 형태로 에러가 오면 해당 DsInput에 자동 전달

다만 이것들은 composable 조합으로도 가능한 영역이라, DsForm 컴포넌트는 **편의성 래퍼** 수준. 필수는 아니고 우선순위 낮춰도 됨.

**2. Checkbox vs Radio 그룹 통일성**

맞는 지적. 통일해야 함. 두 가지 방향:

**방향 A: 둘 다 그룹 없이 (권장)**
- DsCheckbox: `v-model="selectedItems"` + `value="A"` → Vue가 배열 자동 관리
- DsRadio: `v-model="gender"` + `value="male"` → Vue가 단일 값 자동 관리
- 그룹핑은 그냥 `<div>`로 감싸면 됨
- Form 연동: DsForm의 provide로 필드명 등록하면 그룹 컴포넌트 없이도 검증 가능

**방향 B: 둘 다 그룹 있이**
- DsCheckboxGroup + DsRadioGroup 둘 다 만듦
- options prop으로 목록 전달, v-model로 값 관리

**방향 A 권장 이유:** Vue의 v-model이 이미 배열/단일값을 자연스럽게 처리함. Group 컴포넌트를 만들면 결국 `<div v-for>` + v-model 바인딩을 래핑하는 수준인데, slot 커스텀까지 고려하면 오히려 복잡해짐. 스타일 자유 원칙과도 맞음.

**3. useChart의 인스턴스 생성/파괴 라이프사이클**

필요함. Chart.js는 `new Chart(canvas, config)`로 인스턴스를 직접 생성하고, 컴포넌트 언마운트 시 `.destroy()`를 호출해야 메모리 누수가 안 생김. 매번 이런 코드를 작성해야 함:

```js
// 이걸 매번 반복해야 하는 것
let chart = null
onMounted(() => {
  chart = new Chart(canvasRef.value, config)
})
onUnmounted(() => {
  chart?.destroy()
})
// 데이터 변경 시 업데이트
watch(data, () => {
  chart.data = newData
  chart.update()
})
```

`useChart`가 이걸 한줄로 줄여줌:
```js
const { chart } = useChart(canvasRef, config)
// 끝. 마운트/언마운트/데이터 반응형 업데이트 자동 처리
```

**4. MenuTab — 별도 컴포넌트로 확정**

DsMenuTab으로 Phase 5 Navigation에 추가.

**5. TreeMenu → DsTreeSelect 통합**

동의. DsTreeSelect를 **트리 구조 범용 컴포넌트**로 설계:
- `mode="select"` → 값 선택 (폼 입력용, 조직도/카테고리 선택)
- `mode="navigate"` → 탐색/액션 (메뉴 탐색, 클릭 시 이벤트 발생)
- 공통: 펼침/접힘, 검색 필터, 체크박스/라디오 선택

이러면 별도 TreeMenu 없이 DsTreeSelect 하나로 커버됨.

**6. DsTable 인라인 편집 — 동의 확인**

Phase 4 이후 DsTable 확장으로 진행.
