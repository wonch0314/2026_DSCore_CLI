# dscore-cli Skills

DSCORE 프로젝트를 위한 CLI 도구 사용 가이드입니다.

## 설치

```bash
npm install dscore-cli
```

---

## 명령어 목록

| 명령어 | 단축키 | 설명 |
|--------|--------|------|
| `generate-page` | `gp` | 새 페이지 구조 생성 |
| `add-skill` | `as` | Claude Code Skill 설치 |
| `help` | `-h` | 도움말 표시 |

---

## generate-page (gp)

새 페이지 구조를 자동으로 생성합니다.

### 기본 사용법

```bash
# 페이지 이름 입력 후 생성
npx dscore-cli generate-page

# 페이지 이름 직접 지정
npx dscore-cli generate-page user-management
npx dscore-cli gp user-management
```

### 옵션

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| `--vue` | Vue.js 템플릿 사용 | 기본값 |
| `--react` | React 템플릿 사용 | - |
| `--pages` | src/pages/ 디렉토리에 생성 | 기본값 |
| `--page` | src/page/ 디렉토리에 생성 | - |

### 예시

```bash
# Vue.js + src/pages/ (기본값)
npx dscore-cli gp user-management

# Vue.js + src/page/
npx dscore-cli gp user-management --vue --page

# React + src/pages/
npx dscore-cli gp user-management --react --pages

# React + src/page/
npx dscore-cli gp user-management --react --page
```

### 생성되는 파일 구조

#### Vue.js 템플릿
```
src/pages/user-management/
├── UserManagement.vue       # 메인 페이지 컴포넌트
├── constants.js             # 상수 정의 (컬럼, 초기값 등)
├── api.js                   # API 함수
├── useUserManagement.js     # Composition API composable
├── components/
│   ├── UserManagementSearch.vue    # 검색 컴포넌트
│   ├── UserManagementList.vue      # 목록 컴포넌트
│   ├── BaseTable.vue               # 테이블 컴포넌트
│   └── BasePagination.vue          # 페이지네이션 컴포넌트
```

#### React 템플릿
```
src/pages/user-management/
├── UserManagement.jsx       # 메인 페이지 컴포넌트
├── UserManagement.module.css # 메인 스타일
├── constants.js             # 상수 정의
├── api.js                   # API 함수
├── useUserManagement.js     # Custom Hook
├── components/
│   ├── UserManagementSearch.jsx    # 검색 컴포넌트
│   ├── UserManagementSearch.module.css
│   ├── UserManagementList.jsx      # 목록 컴포넌트
│   ├── UserManagementList.module.css
│   ├── BaseTable.jsx               # 테이블 컴포넌트
│   ├── BaseTable.module.css
│   ├── BasePagination.jsx          # 페이지네이션 컴포넌트
│   └── BasePagination.module.css
```

### 생성된 코드의 특징

1. **자체 완결형**: 외부 공통 컴포넌트 import 없이 모든 필요한 컴포넌트 포함
2. **Mock 데이터**: API 함수에 샘플 데이터 포함 (실제 API 연동 전 테스트 가능)
3. **검색/목록 패턴**: 일반적인 CRUD 페이지 패턴 적용
4. **페이지네이션**: 클라이언트 사이드 페이지네이션 구현

---

## add-skill (as)

Claude Code에서 사용할 Skill을 프로젝트에 설치합니다.

### 사용법

```bash
npx dscore-cli add-skill
npx dscore-cli as
```

### 실행 흐름

1. 사용 가능한 skill 목록이 표시됨
2. 설치할 skill 번호 입력
3. `.claude/skills/<skill-name>/SKILL.md` 파일 생성

### 설치 후 사용법

Claude Code에서 다음과 같이 사용:

```
# 직접 호출
/dscore-utils

# 또는 관련 질문 시 자동 로드
"배열에서 중복을 제거하는 함수가 있나요?"
"날짜 포맷팅은 어떻게 하나요?"
```

---

## 사용 팁

### 1. 페이지 생성 후 수정 포인트

```javascript
// api.js - 실제 API 엔드포인트로 변경
export const fetchList = async (params) => {
  // Mock 데이터 제거 후 실제 API 호출로 변경
  const response = await axios.get('/api/users', { params });
  return response.data;
};
```

### 2. 컬럼 설정 변경

```javascript
// constants.js
export const COLUMNS = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'name', label: '이름', width: '150px' },
  // 필요한 컬럼 추가/수정
];
```

### 3. 검색 필드 변경

```javascript
// constants.js
export const SEARCH_FIELDS = [
  { key: 'name', label: '이름', type: 'text' },
  { key: 'status', label: '상태', type: 'select', options: [...] },
  // 필요한 검색 필드 추가/수정
];
```

---

## 문제 해결

### 명령어를 찾을 수 없음

```bash
# npx로 실행 (권장)
npx dscore-cli generate-page

# 또는 글로벌 설치 후 실행
npm install -g dscore-cli
dscore-cli generate-page
```

### 권한 오류

```bash
# 디렉토리 쓰기 권한 확인
ls -la src/

# 필요시 권한 부여
chmod 755 src/
```
