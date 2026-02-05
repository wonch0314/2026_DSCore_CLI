#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 사용자의 현재 작업 디렉토리
const CWD = process.cwd();

// 이름 변환 유틸리티
const toPascalCase = (str) =>
    str.replace(/(^\w|-\w)/g, (match) => match.replace('-', '').toUpperCase());

const toCamelCase = (str) =>
    str.replace(/-\w/g, (match) => match.slice(1).toUpperCase());

// 안내 메시지 출력
const showGuide = () => {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║              📁  페이지 생성기 (Page Generator)              ║');
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log('║                                                           ║');
    console.log('║  새로운 페이지 폴더와 기본 파일들을 자동으로 생성합니다.       ║');
    console.log('║                                                           ║');
    console.log('║  📌 입력 규칙:                                             ║');
    console.log('║     • 도메인 이름만 입력 (kebab-case 권장)                   ║');
    console.log('║     • "-page" 접미사는 붙이지 마세요 (자동으로 추가됨)         ║');
    console.log('║                                                           ║');
    console.log('║  ✅ 올바른 예시:                                            ║');
    console.log('║     • user-mgt      → UserMgtPage.jsx                     ║');
    console.log('║     • product       → ProductPage.jsx                     ║');
    console.log('║     • order-history → OrderHistoryPage.jsx                ║');
    console.log('║                                                           ║');
    console.log('║  ❌ 잘못된 예시:                                            ║');
    console.log('║     • user-page     (page 접미사 불가)                      ║');
    console.log('║     • UserMgt       (kebab-case 사용 권장)                  ║');
    console.log('║                                                           ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');
};

// 입력 검증
const validateInput = (input) => {
    if (!input || input.trim() === '') {
        return { valid: false, message: '페이지 이름을 입력해주세요.' };
    }

    const pageName = input.trim().toLowerCase();

    if (pageName.endsWith('-page') || pageName.endsWith('page')) {
        return {
            valid: false,
            message: `"-page"로 끝나는 이름은 사용할 수 없습니다. "${pageName.replace(/-?page$/i, '')}" 로 다시 시도해주세요.`
        };
    }

    if (!/^[a-z][a-z0-9-]*$/.test(pageName)) {
        return {
            valid: false,
            message: '영문 소문자, 숫자, 하이픈(-)만 사용 가능합니다. (예: user-mgt, product)'
        };
    }

    const targetDir = path.join(CWD, 'src/page', pageName);
    if (fs.existsSync(targetDir)) {
        return {
            valid: false,
            message: `이미 존재하는 폴더입니다: src/page/${pageName}`
        };
    }

    return { valid: true, pageName };
};

// 페이지 생성 함수
const generatePage = (pageName) => {
    const pascalName = toPascalCase(pageName);
    const camelName = toCamelCase(pageName);
    const targetDir = path.join(CWD, 'src/page', pageName);

    console.log('');
    console.log(`🚀  Creating page structure for "${pageName}"...`);

    // 폴더 생성
    fs.mkdirSync(path.join(targetDir, 'components', 'hooks'), { recursive: true });
    fs.mkdirSync(path.join(targetDir, 'components', 'ui'), { recursive: true });

    // 파일 템플릿들
    const templates = getTemplates(pageName, pascalName, camelName);

    // 파일 쓰기
    fs.writeFileSync(path.join(targetDir, `${pascalName}Page.jsx`), templates.page);
    console.log(`   ✅  ${pascalName}Page.jsx`);

    fs.writeFileSync(path.join(targetDir, 'components/constants.js'), templates.constants);
    console.log('   ✅  components/constants.js');

    fs.writeFileSync(path.join(targetDir, 'components/api.js'), templates.api);
    console.log('   ✅  components/api.js');

    fs.writeFileSync(path.join(targetDir, `components/hooks/use${pascalName}.js`), templates.hook);
    console.log(`   ✅  components/hooks/use${pascalName}.js`);

    fs.writeFileSync(path.join(targetDir, `components/ui/${pascalName}Search.jsx`), templates.search);
    console.log(`   ✅  components/ui/${pascalName}Search.jsx`);

    fs.writeFileSync(path.join(targetDir, `components/ui/${pascalName}List.jsx`), templates.list);
    console.log(`   ✅  components/ui/${pascalName}List.jsx`);

    // 완료 메시지
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║                    ✨  생성 완료!                          ║');
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log('║                                                           ║');
    console.log(`║  📁 경로: src/page/${pageName}/`.padEnd(60) + '║');
    console.log('║                                                           ║');
    console.log('║  📄 생성된 파일:                                            ║');
    console.log(`║     • ${pascalName}Page.jsx (메인 페이지)`.padEnd(58) + '║');
    console.log('║     • components/constants.js (상수)                       ║');
    console.log('║     • components/api.js (API 함수)                         ║');
    console.log(`║     • components/hooks/use${pascalName}.js`.padEnd(58) + '║');
    console.log(`║     • components/ui/${pascalName}Search.jsx`.padEnd(58) + '║');
    console.log(`║     • components/ui/${pascalName}List.jsx`.padEnd(58) + '║');
    console.log('║                                                           ║');
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log('║  👉 다음 단계:                                              ║');
    console.log('║                                                           ║');
    console.log(`║  1. 라우트 생성: src/app/(next-router)/om/${pageName}/page.js`.padEnd(58) + '║');
    console.log('║  2. api.js 에서 실제 API 경로 설정                          ║');
    console.log('║  3. constants.js 에서 테이블 헤더/상수 수정                  ║');
    console.log('║                                                           ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');
};

// 템플릿 정의
const getTemplates = (pageName, pascalName, camelName) => ({
    constants: `/**
 * ${pascalName} 페이지 상수 정의
 */

// 초기 검색 상태
export const INITIAL_SEARCH_STATE = {
    keyword: '',
    status: '',
};

// 초기 페이지 상태
export const INITIAL_PAGE_STATE = {
    page: 1,
    size: 10,
    totalCount: 0,
};

// 초기 폼 데이터
export const INITIAL_FORM_DATA = {
    id: '',
    name: '',
};

// 테이블 헤더 설정
export const TABLE_HEADERS = [
    { header: 'ID', name: 'id', width: 100, align: 'center' },
    { header: '이름', name: 'name', width: 200, align: 'left' },
    { header: '상태', name: 'status', width: 100, align: 'center' },
    { header: '등록일', name: 'regDt', width: 150, align: 'center' },
];

// 에러 메시지
export const ERROR_MESSAGES = {
    REQUIRED_NAME: '이름을 입력해주세요.',
    FETCH_FAILED: '데이터를 불러오는데 실패했습니다.',
    SAVE_FAILED: '저장에 실패했습니다.',
};

// UI 텍스트
export const UI_TEXT = {
    SEARCH: '검색',
    RESET: '초기화',
    REGISTER: '등록',
    SAVE: '저장',
    DELETE: '삭제',
    CANCEL: '취소',
};
`,

    api: `/**
 * ${pascalName} API 함수
 *
 * @description API 엔드포인트 등록 방법:
 * 1. src/api/endpoints/index.js 에 엔드포인트 경로 추가
 * 2. 아래 getApiUrl() 호출 시 등록한 경로 사용
 */
import { getApiUrl } from '@/api/utils/urlBuilder';
import { setHeaders } from '@/api/utils/headers';
import { ENV } from '@/config/env';

/**
 * 옵션 목록 조회 (셀렉트박스용)
 */
export const getOption = async () => {
    // TODO: API 경로 수정 필요
    // const headers = await setHeaders();
    // const path = await getApiUrl('${camelName}.option');
    // const res = await fetch(\`\${ENV.API_BASE_URL}\${path}\`, { headers, method: 'GET' });
    // return await res.json();

    return { result: true, data: {} };
};

/**
 * 목록 조회
 * @param {Object} params - 검색 파라미터
 */
export const get${pascalName}List = async (params) => {
    // TODO: API 경로 수정 필요
    const headers = await setHeaders();
    const path = await getApiUrl('${camelName}.list');

    const queryParams = new URLSearchParams(params).toString();
    const url = \`\${ENV.API_BASE_URL}\${path}?\${queryParams}\`;

    const res = await fetch(url, { headers, method: 'GET' });
    return await res.json();
};

/**
 * 상세 조회
 * @param {string} id - 조회할 ID
 */
export const get${pascalName} = async (id) => {
    const headers = await setHeaders();
    const path = await getApiUrl('${camelName}.detail');

    const res = await fetch(\`\${ENV.API_BASE_URL}\${path}/\${id}\`, { headers, method: 'GET' });
    return await res.json();
};

/**
 * 등록
 * @param {Object} data - 등록할 데이터
 */
export const add${pascalName} = async (data) => {
    const headers = await setHeaders();
    const path = await getApiUrl('${camelName}.add');

    const res = await fetch(\`\${ENV.API_BASE_URL}\${path}\`, {
        headers,
        method: 'POST',
        body: JSON.stringify(data),
    });
    return await res.json();
};

/**
 * 수정
 * @param {Object} data - 수정할 데이터
 */
export const update${pascalName} = async (data) => {
    const headers = await setHeaders();
    const path = await getApiUrl('${camelName}.update');

    const res = await fetch(\`\${ENV.API_BASE_URL}\${path}\`, {
        headers,
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return await res.json();
};

/**
 * 삭제
 * @param {string} id - 삭제할 ID
 */
export const delete${pascalName} = async (id) => {
    const headers = await setHeaders();
    const path = await getApiUrl('${camelName}.delete');

    const res = await fetch(\`\${ENV.API_BASE_URL}\${path}/\${id}\`, {
        headers,
        method: 'DELETE',
    });
    return await res.json();
};

/**
 * 엑셀 다운로드
 * @param {Object} params - 검색 파라미터
 */
export const downloadExcel = async (params) => {
    const headers = await setHeaders();
    const path = await getApiUrl('${camelName}.excel');

    const queryParams = new URLSearchParams(params).toString();
    const res = await fetch(\`\${ENV.API_BASE_URL}\${path}?\${queryParams}\`, {
        headers,
        method: 'GET',
    });
    return await res.blob();
};
`,

    hook: `/**
 * ${pascalName} 페이지 메인 훅
 */
import { useState, useEffect, useCallback } from 'react';
import { useAlert } from '@ktds-ui/context';
import {
    getOption,
    get${pascalName}List
} from '../api';
import {
    INITIAL_SEARCH_STATE,
    INITIAL_PAGE_STATE,
    ERROR_MESSAGES
} from '../constants';

export const use${pascalName} = () => {
    const { alert } = useAlert();

    // 옵션 상태
    const [options, setOptions] = useState({});

    // 검색 상태
    const [searchState, setSearchState] = useState(INITIAL_SEARCH_STATE);

    // 페이지 상태
    const [pageState, setPageState] = useState(INITIAL_PAGE_STATE);

    // 목록 데이터
    const [listData, setListData] = useState({ list: [], totalCount: 0 });

    // 로딩 상태
    const [isLoading, setIsLoading] = useState(false);

    /**
     * 옵션 조회
     */
    const fetchOptions = useCallback(async () => {
        try {
            const res = await getOption();
            if (res.result) {
                setOptions(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch options:', error);
        }
    }, []);

    /**
     * 목록 조회
     */
    const fetchList = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                ...searchState,
                page: pageState.page,
                size: pageState.size,
            };
            const res = await get${pascalName}List(params);
            if (res.result) {
                setListData({
                    list: res.data?.list || [],
                    totalCount: res.data?.totalCount || 0,
                });
                setPageState(prev => ({
                    ...prev,
                    totalCount: res.data?.totalCount || 0,
                }));
            } else {
                alert({ message: ERROR_MESSAGES.FETCH_FAILED });
            }
        } catch (error) {
            console.error('Failed to fetch list:', error);
            alert({ message: ERROR_MESSAGES.FETCH_FAILED });
        } finally {
            setIsLoading(false);
        }
    }, [searchState, pageState.page, pageState.size, alert]);

    /**
     * 검색 핸들러
     */
    const onSearch = useCallback(() => {
        setPageState(prev => ({ ...prev, page: 1 }));
        fetchList();
    }, [fetchList]);

    /**
     * 초기화 핸들러
     */
    const onReset = useCallback(() => {
        setSearchState(INITIAL_SEARCH_STATE);
        setPageState(INITIAL_PAGE_STATE);
    }, []);

    /**
     * 페이지 변경 핸들러
     */
    const onChangePage = useCallback((page) => {
        setPageState(prev => ({ ...prev, page }));
    }, []);

    /**
     * 페이지 사이즈 변경 핸들러
     */
    const onChangePageSize = useCallback((size) => {
        setPageState(prev => ({ ...prev, size, page: 1 }));
    }, []);

    // 초기 로드
    useEffect(() => {
        fetchOptions();
    }, [fetchOptions]);

    // 페이지 변경 시 목록 조회
    useEffect(() => {
        fetchList();
    }, [pageState.page, pageState.size]);

    return {
        // 상태
        options,
        searchState,
        setSearchState,
        pageState,
        listData,
        isLoading,

        // 핸들러
        onSearch,
        onReset,
        onChangePage,
        onChangePageSize,
        fetchList,
    };
};
`,

    page: `'use client'

/**
 * ${pascalName} 페이지
 *
 * ============================================================
 * 📌 Next.js App Router 등록 방법
 * ============================================================
 *
 * 1. 라우트 폴더 생성:
 *    src/app/(next-router)/om/${pageName}/page.js
 *
 * 2. page.js 파일 내용:
 *    ----------------------------------------
 *    import { ${pascalName}Page } from '@/page/${pageName}/${pascalName}Page'
 *    import { setMetadata } from '@/shared/utils/metadata'
 *
 *    export const metadata = setMetadata('${pascalName}')
 *
 *    export default function Page() {
 *        return <${pascalName}Page />
 *    }
 *    ----------------------------------------
 *
 * 3. 메뉴 등록 (필요 시):
 *    - DB 또는 메뉴 관리에서 URL 경로 등록: /om/${pageName}
 *
 * ============================================================
 */

import { ContentTitle } from '@ktds-ui/layout'
import { use${pascalName} } from './components/hooks/use${pascalName}'

// UI 컴포넌트 (생성 후 주석 해제)
// import ${pascalName}Search from './components/ui/${pascalName}Search'
// import ${pascalName}List from './components/ui/${pascalName}List'
// import ${pascalName}Dialog from './components/ui/${pascalName}Dialog'

export const ${pascalName}Page = () => {
    const {
        options,
        searchState,
        setSearchState,
        pageState,
        listData,
        isLoading,
        onSearch,
        onReset,
        onChangePage,
        onChangePageSize,
        fetchList,
    } = use${pascalName}();

    return (
        <>
            <ContentTitle
                title="${pascalName} 관리"
                breadcrumb={['업무지원', '시스템 관리', '${pascalName} 관리']}
            />

            {/* TODO: 검색 컴포넌트 */}
            {/* <${pascalName}Search
                options={options}
                searchState={searchState}
                setSearchState={setSearchState}
                onSearch={onSearch}
                onReset={onReset}
            /> */}

            {/* TODO: 목록 컴포넌트 */}
            {/* <${pascalName}List
                data={listData}
                pageState={pageState}
                onChangePage={onChangePage}
                onChangePageSize={onChangePageSize}
            /> */}

            {/* 임시 UI - 개발 후 삭제 */}
            <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
                <h3>🚧 ${pascalName}Page 개발 중</h3>
                <p>데이터 건수: {listData.totalCount}</p>
                <p>현재 페이지: {pageState.page}</p>
                <button onClick={onSearch}>검색 테스트</button>
            </div>
        </>
    );
};
`,

    search: `'use client'

/**
 * ${pascalName} 검색 컴포넌트
 */
import { Stack, Button, Input, Select } from '@ktds-ui/components'
import { UI_TEXT } from '../constants'

const ${pascalName}Search = ({
    options,
    searchState,
    setSearchState,
    onSearch,
    onReset,
}) => {
    const handleChange = (field) => (e) => {
        const value = e?.target?.value ?? e;
        setSearchState(prev => ({ ...prev, [field]: value }));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            onSearch();
        }
    };

    return (
        <Stack direction="column" gap={16} style={{ marginBottom: '20px' }}>
            <Stack direction="row" gap={12} align="center">
                <Input
                    label="검색어"
                    value={searchState.keyword}
                    onChange={handleChange('keyword')}
                    onKeyDown={handleKeyDown}
                    placeholder="검색어를 입력하세요"
                />

                {/* 셀렉트박스 예시 */}
                {/* <Select
                    label="상태"
                    value={searchState.status}
                    onChange={handleChange('status')}
                    options={options.statusList || []}
                /> */}

                <Button variant="primary" onClick={onSearch}>
                    {UI_TEXT.SEARCH}
                </Button>
                <Button variant="secondary" onClick={onReset}>
                    {UI_TEXT.RESET}
                </Button>
            </Stack>
        </Stack>
    );
};

export default ${pascalName}Search;
`,

    list: `'use client'

/**
 * ${pascalName} 목록 컴포넌트
 */
import { Stack, Button, Table, Pagination } from '@ktds-ui/components'
import { TABLE_HEADERS, UI_TEXT } from '../constants'

const ${pascalName}List = ({
    data,
    pageState,
    onChangePage,
    onChangePageSize,
    onRowClick,
    onOpenRegist,
}) => {
    const { list = [], totalCount = 0 } = data;

    return (
        <Stack direction="column" gap={16}>
            <Stack direction="row" justify="space-between" align="center">
                <span>총 {totalCount}건</span>
                <Button variant="primary" onClick={onOpenRegist}>
                    {UI_TEXT.REGISTER}
                </Button>
            </Stack>

            <Table
                headers={TABLE_HEADERS}
                data={list}
                onRowClick={onRowClick}
                emptyMessage="데이터가 없습니다."
            />

            <Pagination
                current={pageState.page}
                total={totalCount}
                pageSize={pageState.size}
                onChange={onChangePage}
                onPageSizeChange={onChangePageSize}
            />
        </Stack>
    );
};

export default ${pascalName}List;
`,
});

// 메인 실행
const main = () => {
    // 커맨드라인 인자 (generate-page 다음 인자)
    const args = process.argv.slice(3);

    if (args.length > 0) {
        const validation = validateInput(args[0]);
        if (!validation.valid) {
            console.error(`❌  Error: ${validation.message}`);
            process.exit(1);
        }
        generatePage(validation.pageName);
        process.exit(0);
    }

    // 인터랙티브 모드
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    showGuide();

    const askPageName = () => {
        rl.question('📝  페이지 이름을 입력하세요 (또는 q로 종료): ', (answer) => {
            if (answer.toLowerCase() === 'q' || answer.toLowerCase() === 'quit') {
                console.log('\n👋  종료합니다.\n');
                rl.close();
                process.exit(0);
            }

            const validation = validateInput(answer);

            if (!validation.valid) {
                console.log(`\n❌  ${validation.message}\n`);
                askPageName();
            } else {
                rl.close();
                generatePage(validation.pageName);
                process.exit(0);
            }
        });
    };

    askPageName();
};

main();
