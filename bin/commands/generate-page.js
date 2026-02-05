#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 사용자의 현재 작업 디렉토리
const CWD = process.cwd();

// 플래그 파싱
const parseFlags = (args) => {
    const flags = {
        framework: 'vue',  // 기본값: vue
        directory: 'pages', // 기본값: pages
        pageName: null,
    };

    for (const arg of args) {
        if (arg === '--vue' || arg === '--vuejs') {
            flags.framework = 'vue';
        } else if (arg === '--react' || arg === '--reactjs') {
            flags.framework = 'react';
        } else if (arg === '--pages') {
            flags.directory = 'pages';
        } else if (arg === '--page') {
            flags.directory = 'page';
        } else if (!arg.startsWith('--')) {
            flags.pageName = arg;
        }
    }

    return flags;
};

// 이름 변환 유틸리티
const toPascalCase = (str) =>
    str.replace(/(^\w|-\w)/g, (match) => match.replace('-', '').toUpperCase());

const toCamelCase = (str) =>
    str.replace(/-\w/g, (match) => match.slice(1).toUpperCase());

// 안내 메시지 출력
const showGuide = (framework, directory) => {
    const ext = framework === 'vue' ? '.vue' : '.jsx';
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║              📁  페이지 생성기 (Page Generator)              ║');
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log('║                                                           ║');
    console.log(`║  🔧 Framework: ${framework.toUpperCase().padEnd(10)} 📂 Directory: src/${directory}/`.padEnd(60) + '║');
    console.log('║                                                           ║');
    console.log('║  📌 입력 규칙:                                             ║');
    console.log('║     • 도메인 이름만 입력 (kebab-case 권장)                   ║');
    console.log('║     • "-page" 접미사는 붙이지 마세요 (자동으로 추가됨)         ║');
    console.log('║                                                           ║');
    console.log('║  ✅ 올바른 예시:                                            ║');
    console.log(`║     • user-mgt      → UserMgtPage${ext}`.padEnd(60) + '║');
    console.log(`║     • product       → ProductPage${ext}`.padEnd(60) + '║');
    console.log(`║     • order-history → OrderHistoryPage${ext}`.padEnd(60) + '║');
    console.log('║                                                           ║');
    console.log('║  ❌ 잘못된 예시:                                            ║');
    console.log('║     • user-page     (page 접미사 불가)                      ║');
    console.log('║     • UserMgt       (kebab-case 사용 권장)                  ║');
    console.log('║                                                           ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');
};

// 입력 검증
const validateInput = (input, directory) => {
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

    const targetDir = path.join(CWD, `src/${directory}`, pageName);
    if (fs.existsSync(targetDir)) {
        return {
            valid: false,
            message: `이미 존재하는 폴더입니다: src/${directory}/${pageName}`
        };
    }

    return { valid: true, pageName };
};

// 페이지 생성 함수
const generatePage = (pageName, framework, directory) => {
    const pascalName = toPascalCase(pageName);
    const camelName = toCamelCase(pageName);
    const targetDir = path.join(CWD, `src/${directory}`, pageName);
    const ext = framework === 'vue' ? 'vue' : 'jsx';

    console.log('');
    console.log(`🚀  Creating ${framework.toUpperCase()} page structure for "${pageName}"...`);

    // 폴더 생성
    if (framework === 'vue') {
        fs.mkdirSync(path.join(targetDir, 'composables'), { recursive: true });
        fs.mkdirSync(path.join(targetDir, 'components'), { recursive: true });
    } else {
        fs.mkdirSync(path.join(targetDir, 'components', 'hooks'), { recursive: true });
        fs.mkdirSync(path.join(targetDir, 'components', 'ui'), { recursive: true });
    }

    // 템플릿 가져오기
    const templates = framework === 'vue'
        ? getVueTemplates(pageName, pascalName, camelName)
        : getReactTemplates(pageName, pascalName, camelName);

    // 파일 쓰기
    if (framework === 'vue') {
        writeVueFiles(targetDir, pascalName, templates);
    } else {
        writeReactFiles(targetDir, pascalName, templates);
    }

    // 완료 메시지
    showCompletionMessage(pageName, pascalName, framework, directory);
};

// Vue 파일 쓰기
const writeVueFiles = (targetDir, pascalName, templates) => {
    fs.writeFileSync(path.join(targetDir, `${pascalName}Page.vue`), templates.page);
    console.log(`   ✅  ${pascalName}Page.vue`);

    fs.writeFileSync(path.join(targetDir, 'constants.js'), templates.constants);
    console.log('   ✅  constants.js');

    fs.writeFileSync(path.join(targetDir, 'api.js'), templates.api);
    console.log('   ✅  api.js');

    fs.writeFileSync(path.join(targetDir, `composables/use${pascalName}.js`), templates.composable);
    console.log(`   ✅  composables/use${pascalName}.js`);

    fs.writeFileSync(path.join(targetDir, `components/${pascalName}Search.vue`), templates.search);
    console.log(`   ✅  components/${pascalName}Search.vue`);

    fs.writeFileSync(path.join(targetDir, `components/${pascalName}List.vue`), templates.list);
    console.log(`   ✅  components/${pascalName}List.vue`);
};

// React 파일 쓰기
const writeReactFiles = (targetDir, pascalName, templates) => {
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
};

// 완료 메시지
const showCompletionMessage = (pageName, pascalName, framework, directory) => {
    const ext = framework === 'vue' ? '.vue' : '.jsx';
    const hookDir = framework === 'vue' ? 'composables' : 'components/hooks';
    const compDir = framework === 'vue' ? 'components' : 'components/ui';

    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║                    ✨  생성 완료!                          ║');
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log('║                                                           ║');
    console.log(`║  🔧 Framework: ${framework.toUpperCase().padEnd(44)}║`);
    console.log(`║  📁 경로: src/${directory}/${pageName}/`.padEnd(60) + '║');
    console.log('║                                                           ║');
    console.log('║  📄 생성된 파일:                                            ║');
    console.log(`║     • ${pascalName}Page${ext} (메인 페이지)`.padEnd(58) + '║');
    console.log(`║     • constants.js (상수)`.padEnd(58) + '║');
    console.log(`║     • api.js (API 함수)`.padEnd(58) + '║');
    console.log(`║     • ${hookDir}/use${pascalName}.js`.padEnd(58) + '║');
    console.log(`║     • ${compDir}/${pascalName}Search${ext}`.padEnd(58) + '║');
    console.log(`║     • ${compDir}/${pascalName}List${ext}`.padEnd(58) + '║');
    console.log('║                                                           ║');
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log('║  👉 다음 단계:                                              ║');
    console.log('║                                                           ║');
    if (framework === 'vue') {
        console.log(`║  1. 라우터 등록: router/index.js`.padEnd(58) + '║');
    } else {
        console.log(`║  1. 라우트 생성: src/app/.../page.js`.padEnd(58) + '║');
    }
    console.log('║  2. api.js 에서 실제 API 경로 설정                          ║');
    console.log('║  3. constants.js 에서 테이블 헤더/상수 수정                  ║');
    console.log('║                                                           ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');
};

// ============================================================
// Vue.js 템플릿
// ============================================================
const getVueTemplates = (pageName, pascalName, camelName) => ({
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
 */
import { api } from '@/api';

/**
 * 옵션 목록 조회 (셀렉트박스용)
 */
export const getOption = async () => {
    // TODO: API 경로 수정 필요
    // const res = await api.get('/${camelName}/options');
    // return res.data;
    return { result: true, data: {} };
};

/**
 * 목록 조회
 * @param {Object} params - 검색 파라미터
 */
export const get${pascalName}List = async (params) => {
    // TODO: API 경로 수정 필요
    const res = await api.get('/${camelName}/list', { params });
    return res.data;
};

/**
 * 상세 조회
 * @param {string} id - 조회할 ID
 */
export const get${pascalName} = async (id) => {
    const res = await api.get(\`/${camelName}/\${id}\`);
    return res.data;
};

/**
 * 등록
 * @param {Object} data - 등록할 데이터
 */
export const add${pascalName} = async (data) => {
    const res = await api.post('/${camelName}', data);
    return res.data;
};

/**
 * 수정
 * @param {Object} data - 수정할 데이터
 */
export const update${pascalName} = async (data) => {
    const res = await api.put('/${camelName}', data);
    return res.data;
};

/**
 * 삭제
 * @param {string} id - 삭제할 ID
 */
export const delete${pascalName} = async (id) => {
    const res = await api.delete(\`/${camelName}/\${id}\`);
    return res.data;
};
`,

    composable: `/**
 * ${pascalName} 페이지 컴포저블
 */
import { ref, reactive, onMounted } from 'vue';
import { useAlert } from '@/composables/useAlert';
import { getOption, get${pascalName}List } from '../api';
import {
    INITIAL_SEARCH_STATE,
    INITIAL_PAGE_STATE,
    ERROR_MESSAGES
} from '../constants';

export const use${pascalName} = () => {
    const { alert } = useAlert();

    // 옵션 상태
    const options = ref({});

    // 검색 상태
    const searchState = reactive({ ...INITIAL_SEARCH_STATE });

    // 페이지 상태
    const pageState = reactive({ ...INITIAL_PAGE_STATE });

    // 목록 데이터
    const listData = reactive({ list: [], totalCount: 0 });

    // 로딩 상태
    const isLoading = ref(false);

    /**
     * 옵션 조회
     */
    const fetchOptions = async () => {
        try {
            const res = await getOption();
            if (res.result) {
                options.value = res.data;
            }
        } catch (error) {
            console.error('Failed to fetch options:', error);
        }
    };

    /**
     * 목록 조회
     */
    const fetchList = async () => {
        isLoading.value = true;
        try {
            const params = {
                ...searchState,
                page: pageState.page,
                size: pageState.size,
            };
            const res = await get${pascalName}List(params);
            if (res.result) {
                listData.list = res.data?.list || [];
                listData.totalCount = res.data?.totalCount || 0;
                pageState.totalCount = res.data?.totalCount || 0;
            } else {
                alert({ message: ERROR_MESSAGES.FETCH_FAILED });
            }
        } catch (error) {
            console.error('Failed to fetch list:', error);
            alert({ message: ERROR_MESSAGES.FETCH_FAILED });
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * 검색 핸들러
     */
    const onSearch = () => {
        pageState.page = 1;
        fetchList();
    };

    /**
     * 초기화 핸들러
     */
    const onReset = () => {
        Object.assign(searchState, INITIAL_SEARCH_STATE);
        Object.assign(pageState, INITIAL_PAGE_STATE);
    };

    /**
     * 페이지 변경 핸들러
     */
    const onChangePage = (page) => {
        pageState.page = page;
        fetchList();
    };

    /**
     * 페이지 사이즈 변경 핸들러
     */
    const onChangePageSize = (size) => {
        pageState.size = size;
        pageState.page = 1;
        fetchList();
    };

    // 초기 로드
    onMounted(() => {
        fetchOptions();
        fetchList();
    });

    return {
        // 상태
        options,
        searchState,
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

    page: `<template>
    <div class="${pageName}-page">
        <ContentTitle
            title="${pascalName} 관리"
            :breadcrumb="['업무지원', '시스템 관리', '${pascalName} 관리']"
        />

        <!-- 검색 컴포넌트 -->
        <${pascalName}Search
            :options="options"
            :search-state="searchState"
            @search="onSearch"
            @reset="onReset"
        />

        <!-- 목록 컴포넌트 -->
        <${pascalName}List
            :data="listData"
            :page-state="pageState"
            :is-loading="isLoading"
            @change-page="onChangePage"
            @change-page-size="onChangePageSize"
        />
    </div>
</template>

<script setup>
/**
 * ${pascalName} 페이지
 */
import ContentTitle from '@/components/common/ContentTitle.vue';
import ${pascalName}Search from './components/${pascalName}Search.vue';
import ${pascalName}List from './components/${pascalName}List.vue';
import { use${pascalName} } from './composables/use${pascalName}';

const {
    options,
    searchState,
    pageState,
    listData,
    isLoading,
    onSearch,
    onReset,
    onChangePage,
    onChangePageSize,
} = use${pascalName}();
</script>

<style scoped>
.${pageName}-page {
    padding: 20px;
}
</style>
`,

    search: `<template>
    <div class="${pageName}-search">
        <div class="search-row">
            <Input
                v-model="localSearchState.keyword"
                label="검색어"
                placeholder="검색어를 입력하세요"
                @keydown.enter="handleSearch"
            />

            <!-- 셀렉트박스 예시 -->
            <!-- <Select
                v-model="localSearchState.status"
                label="상태"
                :options="options.statusList || []"
            /> -->

            <Button variant="primary" @click="handleSearch">
                {{ UI_TEXT.SEARCH }}
            </Button>
            <Button variant="secondary" @click="handleReset">
                {{ UI_TEXT.RESET }}
            </Button>
        </div>
    </div>
</template>

<script setup>
/**
 * ${pascalName} 검색 컴포넌트
 */
import { reactive, watch } from 'vue';
import { UI_TEXT } from '../constants';

const props = defineProps({
    options: {
        type: Object,
        default: () => ({}),
    },
    searchState: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['search', 'reset']);

const localSearchState = reactive({ ...props.searchState });

watch(() => props.searchState, (newVal) => {
    Object.assign(localSearchState, newVal);
}, { deep: true });

const handleSearch = () => {
    Object.assign(props.searchState, localSearchState);
    emit('search');
};

const handleReset = () => {
    emit('reset');
};
</script>

<style scoped>
.${pageName}-search {
    margin-bottom: 20px;
}

.search-row {
    display: flex;
    gap: 12px;
    align-items: center;
}
</style>
`,

    list: `<template>
    <div class="${pageName}-list">
        <div class="list-header">
            <span>총 {{ data.totalCount }}건</span>
            <Button variant="primary" @click="handleOpenRegist">
                {{ UI_TEXT.REGISTER }}
            </Button>
        </div>

        <Table
            :headers="TABLE_HEADERS"
            :data="data.list"
            :loading="isLoading"
            empty-message="데이터가 없습니다."
            @row-click="handleRowClick"
        />

        <Pagination
            :current="pageState.page"
            :total="data.totalCount"
            :page-size="pageState.size"
            @change="handleChangePage"
            @page-size-change="handleChangePageSize"
        />
    </div>
</template>

<script setup>
/**
 * ${pascalName} 목록 컴포넌트
 */
import { TABLE_HEADERS, UI_TEXT } from '../constants';

const props = defineProps({
    data: {
        type: Object,
        default: () => ({ list: [], totalCount: 0 }),
    },
    pageState: {
        type: Object,
        required: true,
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['change-page', 'change-page-size', 'row-click', 'open-regist']);

const handleChangePage = (page) => {
    emit('change-page', page);
};

const handleChangePageSize = (size) => {
    emit('change-page-size', size);
};

const handleRowClick = (row) => {
    emit('row-click', row);
};

const handleOpenRegist = () => {
    emit('open-regist');
};
</script>

<style scoped>
.${pageName}-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
`,
});

// ============================================================
// React 템플릿
// ============================================================
const getReactTemplates = (pageName, pascalName, camelName) => ({
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
 */
import { getApiUrl } from '@/api/utils/urlBuilder';
import { setHeaders } from '@/api/utils/headers';
import { ENV } from '@/config/env';

/**
 * 옵션 목록 조회 (셀렉트박스용)
 */
export const getOption = async () => {
    // TODO: API 경로 수정 필요
    return { result: true, data: {} };
};

/**
 * 목록 조회
 * @param {Object} params - 검색 파라미터
 */
export const get${pascalName}List = async (params) => {
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
`,

    hook: `/**
 * ${pascalName} 페이지 메인 훅
 */
import { useState, useEffect, useCallback } from 'react';
import { useAlert } from '@ktds-ui/context';
import { getOption, get${pascalName}List } from '../api';
import {
    INITIAL_SEARCH_STATE,
    INITIAL_PAGE_STATE,
    ERROR_MESSAGES
} from '../constants';

export const use${pascalName} = () => {
    const { alert } = useAlert();

    const [options, setOptions] = useState({});
    const [searchState, setSearchState] = useState(INITIAL_SEARCH_STATE);
    const [pageState, setPageState] = useState(INITIAL_PAGE_STATE);
    const [listData, setListData] = useState({ list: [], totalCount: 0 });
    const [isLoading, setIsLoading] = useState(false);

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

    const onSearch = useCallback(() => {
        setPageState(prev => ({ ...prev, page: 1 }));
        fetchList();
    }, [fetchList]);

    const onReset = useCallback(() => {
        setSearchState(INITIAL_SEARCH_STATE);
        setPageState(INITIAL_PAGE_STATE);
    }, []);

    const onChangePage = useCallback((page) => {
        setPageState(prev => ({ ...prev, page }));
    }, []);

    const onChangePageSize = useCallback((size) => {
        setPageState(prev => ({ ...prev, size, page: 1 }));
    }, []);

    useEffect(() => {
        fetchOptions();
    }, [fetchOptions]);

    useEffect(() => {
        fetchList();
    }, [pageState.page, pageState.size]);

    return {
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
    };
};
`,

    page: `'use client'

/**
 * ${pascalName} 페이지
 */
import { ContentTitle } from '@ktds-ui/layout';
import { use${pascalName} } from './components/hooks/use${pascalName}';
import ${pascalName}Search from './components/ui/${pascalName}Search';
import ${pascalName}List from './components/ui/${pascalName}List';

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
    } = use${pascalName}();

    return (
        <>
            <ContentTitle
                title="${pascalName} 관리"
                breadcrumb={['업무지원', '시스템 관리', '${pascalName} 관리']}
            />

            <${pascalName}Search
                options={options}
                searchState={searchState}
                setSearchState={setSearchState}
                onSearch={onSearch}
                onReset={onReset}
            />

            <${pascalName}List
                data={listData}
                pageState={pageState}
                isLoading={isLoading}
                onChangePage={onChangePage}
                onChangePageSize={onChangePageSize}
            />
        </>
    );
};
`,

    search: `'use client'

/**
 * ${pascalName} 검색 컴포넌트
 */
import { Stack, Button, Input } from '@ktds-ui/components';
import { UI_TEXT } from '../constants';

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
import { Stack, Button, Table, Pagination } from '@ktds-ui/components';
import { TABLE_HEADERS, UI_TEXT } from '../constants';

const ${pascalName}List = ({
    data,
    pageState,
    isLoading,
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
                loading={isLoading}
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

// ============================================================
// 도움말
// ============================================================
const showHelp = () => {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║           📁  generate-page 사용법                         ║');
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log('║                                                           ║');
    console.log('║  사용법:                                                   ║');
    console.log('║    npx dscore-cli generate-page <name> [options]          ║');
    console.log('║                                                           ║');
    console.log('║  옵션:                                                     ║');
    console.log('║    --vue      Vue.js 템플릿 사용 (기본값)                   ║');
    console.log('║    --react    React 템플릿 사용                            ║');
    console.log('║    --pages    src/pages/ 디렉토리 사용 (기본값)             ║');
    console.log('║    --page     src/page/ 디렉토리 사용                       ║');
    console.log('║                                                           ║');
    console.log('║  예시:                                                     ║');
    console.log('║    npx dscore-cli generate-page user-mgt                  ║');
    console.log('║    npx dscore-cli generate-page user-mgt --vue --pages    ║');
    console.log('║    npx dscore-cli generate-page user-mgt --react --page   ║');
    console.log('║                                                           ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');
};

// ============================================================
// 메인 실행
// ============================================================
const main = () => {
    const args = process.argv.slice(3);

    // 도움말 플래그 확인
    if (args.includes('--help') || args.includes('-h')) {
        showHelp();
        process.exit(0);
    }

    // 플래그 파싱
    const flags = parseFlags(args);

    // 페이지 이름이 직접 전달된 경우
    if (flags.pageName) {
        const validation = validateInput(flags.pageName, flags.directory);
        if (!validation.valid) {
            console.error(`❌  Error: ${validation.message}`);
            process.exit(1);
        }
        generatePage(validation.pageName, flags.framework, flags.directory);
        process.exit(0);
    }

    // 인터랙티브 모드
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    showGuide(flags.framework, flags.directory);

    const askPageName = () => {
        rl.question('📝  페이지 이름을 입력하세요 (또는 q로 종료): ', (answer) => {
            if (answer.toLowerCase() === 'q' || answer.toLowerCase() === 'quit') {
                console.log('\n👋  종료합니다.\n');
                rl.close();
                process.exit(0);
            }

            const validation = validateInput(answer, flags.directory);

            if (!validation.valid) {
                console.log(`\n❌  ${validation.message}\n`);
                askPageName();
            } else {
                rl.close();
                generatePage(validation.pageName, flags.framework, flags.directory);
                process.exit(0);
            }
        });
    };

    askPageName();
};

main();
