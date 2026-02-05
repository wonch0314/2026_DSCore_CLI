# dscore-utils Skills

dscore-utils 라이브러리의 유틸리티 함수들에 대한 가이드입니다.

## 설치

```bash
npm install dscore-utils
```

## 모듈별 import 방법

dscore-utils는 트리쉐이킹을 위해 서브패스 export만 지원합니다.

```javascript
// 올바른 사용법
import { unique } from 'dscore-utils/array'
import { formatNumber } from 'dscore-utils/number'

// 지원하지 않음 (메인 엔트리포인트 없음)
// import { unique } from 'dscore-utils'
```

---

## 📦 array 모듈

`import { ... } from 'dscore-utils/array'`

| 함수명 | 설명 | 사용 예시 |
|--------|------|----------|
| `unique(array)` | 배열에서 중복 제거 | `unique([1,1,2]) // [1,2]` |
| `groupBy(array, key)` | 특정 키로 배열 그룹화 | `groupBy(users, 'dept')` |
| `chunk(array, size)` | 배열을 size 크기로 분할 | `chunk([1,2,3,4], 2) // [[1,2],[3,4]]` |
| `shuffle(array)` | 배열 랜덤 셔플 | `shuffle([1,2,3])` |
| `sortBy(array, key, order)` | 특정 키로 정렬 | `sortBy(users, 'name', 'asc')` |
| `paginate(array, page, size)` | 배열 페이지네이션 | `paginate(items, 1, 10)` |
| `safeArray(value)` | null/undefined를 빈 배열로 | `safeArray(null) // []` |
| `safeFirst(array)` | 첫 번째 요소 안전 반환 | `safeFirst([1,2]) // 1` |
| `safeLast(array)` | 마지막 요소 안전 반환 | `safeLast([1,2]) // 2` |
| `safeMap(array, fn)` | 안전한 map 연산 | `safeMap(null, x => x)` |
| `safeFilter(array, fn)` | 안전한 filter 연산 | `safeFilter(null, x => x)` |
| `safeFind(array, fn)` | 안전한 find 연산 | `safeFind(null, x => x)` |

---

## 📅 date 모듈

`import { ... } from 'dscore-utils/date'`

| 함수명 | 설명 | 사용 예시 |
|--------|------|----------|
| `dateToString(date, format)` | Date → 문자열 변환 | `dateToString(new Date(), 'YYYY-MM-DD')` |
| `stringToDate(str, format)` | 문자열 → Date 변환 | `stringToDate('2024-01-01')` |
| `setStartDate(date)` | 해당일 시작시간 설정 (00:00:00) | `setStartDate(new Date())` |
| `setEndDate(date)` | 해당일 종료시간 설정 (23:59:59) | `setEndDate(new Date())` |
| `getDate(offset, unit)` | 현재 기준 날짜 계산 | `getDate(-7, 'day')` |
| `getDateFormat(date, format)` | 날짜 포맷팅 | `getDateFormat(new Date(), 'YYYY년 MM월')` |
| `isValidDate(date)` | 유효한 Date 여부 | `isValidDate('2024-01-01')` |
| `getDateRange(start, end)` | 날짜 범위 배열 반환 | `getDateRange('2024-01-01', '2024-01-05')` |

---

## 🔢 number 모듈

`import { ... } from 'dscore-utils/number'`

| 함수명 | 설명 | 사용 예시 |
|--------|------|----------|
| `formatNumber(num)` | 숫자에 천단위 콤마 | `formatNumber(1000) // "1,000"` |
| `formatCurrency(num, currency)` | 통화 형식 포맷팅 | `formatCurrency(1000, '원') // "1,000원"` |
| `divideAmount(total, count)` | 금액 균등 분배 | `divideAmount(10000, 3)` |
| `toPercent(value, total)` | 퍼센트 계산 | `toPercent(25, 100) // "25%"` |
| `extractNumbers(str)` | 문자열에서 숫자만 추출 | `extractNumbers('abc123') // 123` |
| `clamp(num, min, max)` | 숫자를 범위 내로 제한 | `clamp(15, 0, 10) // 10` |

---

## 📝 string 모듈

`import { ... } from 'dscore-utils/string'`

| 함수명 | 설명 | 사용 예시 |
|--------|------|----------|
| `formatPhone(phone)` | 전화번호 포맷팅 | `formatPhone('01012345678') // "010-1234-5678"` |
| `formatBusinessNumber(num)` | 사업자번호 포맷팅 | `formatBusinessNumber('1234567890') // "123-45-67890"` |
| `getChosung(str)` | 한글 초성 추출 | `getChosung('홍길동') // "ㅎㄱㄷ"` |
| `matchChosung(text, query)` | 초성 검색 매칭 | `matchChosung('홍길동', 'ㅎㄱ') // true` |

---

## ✅ validation 모듈

`import { ... } from 'dscore-utils/validation'`

| 함수명 | 설명 | 사용 예시 |
|--------|------|----------|
| `isValidEmail(email)` | 이메일 유효성 검사 | `isValidEmail('test@test.com')` |
| `isValidPhone(phone)` | 전화번호 유효성 검사 | `isValidPhone('010-1234-5678')` |
| `isValidBusinessNumber(num)` | 사업자번호 유효성 검사 | `isValidBusinessNumber('123-45-67890')` |
| `isValidSSN(ssn)` | 주민번호 유효성 검사 | `isValidSSN('901231-1234567')` |
| `isValidUrl(url)` | URL 유효성 검사 | `isValidUrl('https://example.com')` |

---

## 🔄 async 모듈

`import { ... } from 'dscore-utils/async'`

| 함수명 | 설명 | 사용 예시 |
|--------|------|----------|
| `debounce(fn, delay)` | 디바운스 처리 | `debounce(search, 300)` |
| `throttle(fn, delay)` | 쓰로틀 처리 | `throttle(scroll, 100)` |
| `sleep(ms)` | 지정 시간 대기 | `await sleep(1000)` |
| `retry(fn, options)` | 재시도 로직 | `retry(fetchData, { maxAttempts: 3 })` |
| `withTimeout(promise, ms)` | Promise 타임아웃 설정 | `withTimeout(fetch(url), 5000)` |

---

## 🔗 url 모듈

`import { ... } from 'dscore-utils/url'`

| 함수명 | 설명 | 사용 예시 |
|--------|------|----------|
| `parseQueryString(str)` | 쿼리스트링 파싱 | `parseQueryString('?a=1&b=2')` |
| `buildQueryString(obj)` | 객체를 쿼리스트링으로 | `buildQueryString({a:1, b:2})` |
| `appendQueryParams(url, params)` | URL에 파라미터 추가 | `appendQueryParams('/api', {page: 1})` |
| `getCurrentQueryParams()` | 현재 URL 쿼리 파라미터 | `getCurrentQueryParams()` |

---

## 📁 file 모듈

`import { ... } from 'dscore-utils/file'`

| 함수명 | 설명 | 사용 예시 |
|--------|------|----------|
| `blobToBase64(blob)` | Blob → Base64 변환 | `await blobToBase64(blob)` |
| `fileToBase64(file)` | File → Base64 변환 | `await fileToBase64(file)` |
| `base64ToFile(base64, filename)` | Base64 → File 변환 | `base64ToFile(data, 'image.png')` |
| `dataURLtoBlob(dataUrl)` | Data URL → Blob 변환 | `dataURLtoBlob(dataUrl)` |
| `getToExcel(data, filename)` | 데이터를 엑셀로 다운로드 | `getToExcel(rows, 'report.xlsx')` |
| `formatFileSize(bytes)` | 파일 크기 포맷팅 | `formatFileSize(1024) // "1 KB"` |

---

## 📋 clipboard 모듈

`import { ... } from 'dscore-utils/clipboard'`

| 함수명 | 설명 | 사용 예시 |
|--------|------|----------|
| `copyToClipboard(text)` | 텍스트 클립보드 복사 | `await copyToClipboard('Hello')` |
| `readFromClipboard()` | 클립보드 읽기 | `await readFromClipboard()` |

---

## 💾 storage 모듈

`import { ... } from 'dscore-utils/storage'`

| 함수명 | 설명 | 사용 예시 |
|--------|------|----------|
| `storage` | localStorage 래퍼 객체 | `storage.get('key')` |
| `getItem(key)` | localStorage 값 조회 | `getItem('user')` |
| `setItem(key, value)` | localStorage 값 저장 | `setItem('user', data)` |
| `removeItem(key)` | localStorage 값 삭제 | `removeItem('user')` |
| `clear()` | localStorage 전체 삭제 | `clear()` |
| `hasItem(key)` | 키 존재 여부 확인 | `hasItem('user')` |
| `sessionStore` | sessionStorage 래퍼 객체 | `sessionStore.get('key')` |
| `StorageKeys` | 스토리지 키 상수 객체 | `StorageKeys.USER` |

---

## 🧩 object 모듈

`import { ... } from 'dscore-utils/object'`

| 함수명 | 설명 | 사용 예시 |
|--------|------|----------|
| `isEmpty(value)` | 빈 값 여부 확인 | `isEmpty(null) // true` |
| `removeEmptyValue(obj)` | 빈 값 속성 제거 | `removeEmptyValue({a: '', b: 1})` |
| `isEmptyDeep(obj)` | 깊은 빈 값 확인 | `isEmptyDeep({a: {b: null}})` |
| `isEmptyArray(value)` | 빈 배열 여부 | `isEmptyArray([]) // true` |
| `isEmptyObject(value)` | 빈 객체 여부 | `isEmptyObject({}) // true` |

---

## 🔐 auth 모듈

`import { ... } from 'dscore-utils/auth'`

| 함수명 | 설명 | 사용 예시 |
|--------|------|----------|
| `tokenManager` | 토큰 관리 객체 | `tokenManager.getAccessToken()` |
| `getAccessToken()` | Access Token 조회 | `getAccessToken()` |
| `setAccessToken(token)` | Access Token 저장 | `setAccessToken(token)` |
| `getRefreshToken()` | Refresh Token 조회 | `getRefreshToken()` |
| `setRefreshToken(token)` | Refresh Token 저장 | `setRefreshToken(token)` |
| `clearTokens()` | 모든 토큰 삭제 | `clearTokens()` |
| `decodeJwt(token)` | JWT 디코딩 | `decodeJwt(token)` |
| `isTokenExpired(token)` | 토큰 만료 여부 | `isTokenExpired(token)` |
| `getTokenPayload(token)` | 토큰 페이로드 추출 | `getTokenPayload(token)` |

---

## 🔍 parse 모듈

`import { ... } from 'dscore-utils/parse'`

| 함수명 | 설명 | 사용 예시 |
|--------|------|----------|
| `safeJsonParse(str, fallback)` | 안전한 JSON 파싱 | `safeJsonParse('invalid', {})` |
| `safeJsonStringify(obj)` | 안전한 JSON 문자열화 | `safeJsonStringify(circularObj)` |
| `parseNestedJson(obj)` | 중첩 JSON 문자열 파싱 | `parseNestedJson({a: '{"b":1}'})` |
| `safeParseInt(str, fallback)` | 안전한 정수 파싱 | `safeParseInt('abc', 0) // 0` |
| `safeParseFloat(str, fallback)` | 안전한 실수 파싱 | `safeParseFloat('abc', 0.0)` |

---

## 📊 logger 모듈

`import { ... } from 'dscore-utils/logger'`

| 함수명 | 설명 | 사용 예시 |
|--------|------|----------|
| `dscoreLog(message, type)` | DSCORE 스타일 로깅 | `dscoreLog('Init', 'info')` |
| `createLogger(prefix)` | 커스텀 로거 생성 | `const log = createLogger('MyApp')` |

---

## 사용 팁

### 1. 필요한 함수만 import하기
```javascript
// Good - 트리쉐이킹에 최적화
import { formatNumber } from 'dscore-utils/number'
import { unique } from 'dscore-utils/array'
```

### 2. 자주 사용하는 조합
```javascript
// 날짜 처리
import { dateToString, getDate, getDateRange } from 'dscore-utils/date'

// 폼 유효성 검사
import { isValidEmail, isValidPhone, isValidBusinessNumber } from 'dscore-utils/validation'

// 데이터 가공
import { formatNumber, formatCurrency } from 'dscore-utils/number'
import { isEmpty, removeEmptyValue } from 'dscore-utils/object'
```

### 3. API 호출과 함께 사용
```javascript
import { retry, withTimeout } from 'dscore-utils/async'
import { buildQueryString } from 'dscore-utils/url'

const fetchWithRetry = retry(
  () => withTimeout(fetch('/api/data?' + buildQueryString(params)), 5000),
  { maxAttempts: 3 }
)
```
