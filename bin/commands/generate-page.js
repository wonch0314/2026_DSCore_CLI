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

    fs.writeFileSync(path.join(targetDir, 'components/BaseTable.vue'), templates.baseTable);
    console.log('   ✅  components/BaseTable.vue');

    fs.writeFileSync(path.join(targetDir, 'components/BasePagination.vue'), templates.basePagination);
    console.log('   ✅  components/BasePagination.vue');
};

// React 파일 쓰기
const writeReactFiles = (targetDir, pascalName, templates) => {
    fs.writeFileSync(path.join(targetDir, `${pascalName}Page.jsx`), templates.page);
    console.log(`   ✅  ${pascalName}Page.jsx`);

    fs.writeFileSync(path.join(targetDir, `${pascalName}Page.module.css`), templates.pageStyles);
    console.log(`   ✅  ${pascalName}Page.module.css`);

    fs.writeFileSync(path.join(targetDir, 'components/constants.js'), templates.constants);
    console.log('   ✅  components/constants.js');

    fs.writeFileSync(path.join(targetDir, 'components/api.js'), templates.api);
    console.log('   ✅  components/api.js');

    fs.writeFileSync(path.join(targetDir, `components/hooks/use${pascalName}.js`), templates.hook);
    console.log(`   ✅  components/hooks/use${pascalName}.js`);

    fs.writeFileSync(path.join(targetDir, `components/ui/${pascalName}Search.jsx`), templates.search);
    console.log(`   ✅  components/ui/${pascalName}Search.jsx`);

    fs.writeFileSync(path.join(targetDir, `components/ui/${pascalName}Search.module.css`), templates.searchStyles);
    console.log(`   ✅  components/ui/${pascalName}Search.module.css`);

    fs.writeFileSync(path.join(targetDir, `components/ui/${pascalName}List.jsx`), templates.list);
    console.log(`   ✅  components/ui/${pascalName}List.jsx`);

    fs.writeFileSync(path.join(targetDir, `components/ui/${pascalName}List.module.css`), templates.listStyles);
    console.log(`   ✅  components/ui/${pascalName}List.module.css`);

    fs.writeFileSync(path.join(targetDir, 'components/ui/BaseTable.jsx'), templates.baseTable);
    console.log('   ✅  components/ui/BaseTable.jsx');

    fs.writeFileSync(path.join(targetDir, 'components/ui/BaseTable.module.css'), templates.baseTableStyles);
    console.log('   ✅  components/ui/BaseTable.module.css');

    fs.writeFileSync(path.join(targetDir, 'components/ui/BasePagination.jsx'), templates.basePagination);
    console.log('   ✅  components/ui/BasePagination.jsx');

    fs.writeFileSync(path.join(targetDir, 'components/ui/BasePagination.module.css'), templates.basePaginationStyles);
    console.log('   ✅  components/ui/BasePagination.module.css');
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
    console.log(`║     • ${compDir}/BaseTable${ext}`.padEnd(58) + '║');
    console.log(`║     • ${compDir}/BasePagination${ext}`.padEnd(58) + '║');
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
 *
 * TODO: 실제 API 경로로 수정 필요
 */

const API_BASE_URL = '/api';

/**
 * 옵션 목록 조회 (셀렉트박스용)
 */
export const getOption = async () => {
    // TODO: 실제 API 연동 시 주석 해제
    // const res = await fetch(\`\${API_BASE_URL}/${camelName}/options\`);
    // return await res.json();

    // Mock 데이터
    return {
        result: true,
        data: {
            statusList: [
                { label: '전체', value: '' },
                { label: '활성', value: 'active' },
                { label: '비활성', value: 'inactive' },
            ]
        }
    };
};

/**
 * 목록 조회
 * @param {Object} params - 검색 파라미터
 */
export const get${pascalName}List = async (params) => {
    // TODO: 실제 API 연동 시 주석 해제
    // const queryParams = new URLSearchParams(params).toString();
    // const res = await fetch(\`\${API_BASE_URL}/${camelName}/list?\${queryParams}\`);
    // return await res.json();

    // Mock 데이터
    return {
        result: true,
        data: {
            list: [
                { id: '1', name: '샘플 데이터 1', status: 'active', regDt: '2024-01-01' },
                { id: '2', name: '샘플 데이터 2', status: 'inactive', regDt: '2024-01-02' },
            ],
            totalCount: 2
        }
    };
};

/**
 * 상세 조회
 * @param {string} id - 조회할 ID
 */
export const get${pascalName} = async (id) => {
    const res = await fetch(\`\${API_BASE_URL}/${camelName}/\${id}\`);
    return await res.json();
};

/**
 * 등록
 * @param {Object} data - 등록할 데이터
 */
export const add${pascalName} = async (data) => {
    const res = await fetch(\`\${API_BASE_URL}/${camelName}\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return await res.json();
};

/**
 * 수정
 * @param {Object} data - 수정할 데이터
 */
export const update${pascalName} = async (data) => {
    const res = await fetch(\`\${API_BASE_URL}/${camelName}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return await res.json();
};

/**
 * 삭제
 * @param {string} id - 삭제할 ID
 */
export const delete${pascalName} = async (id) => {
    const res = await fetch(\`\${API_BASE_URL}/${camelName}/\${id}\`, {
        method: 'DELETE',
    });
    return await res.json();
};
`,

    composable: `/**
 * ${pascalName} 페이지 컴포저블
 */
import { ref, reactive, onMounted } from 'vue';
import { getOption, get${pascalName}List } from '../api';
import {
    INITIAL_SEARCH_STATE,
    INITIAL_PAGE_STATE,
    ERROR_MESSAGES
} from '../constants';

export const use${pascalName} = () => {
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
                alert(ERROR_MESSAGES.FETCH_FAILED);
            }
        } catch (error) {
            console.error('Failed to fetch list:', error);
            alert(ERROR_MESSAGES.FETCH_FAILED);
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
        <div class="page-header">
            <h1 class="page-title">${pascalName} 관리</h1>
            <div class="breadcrumb">
                <span>업무지원</span>
                <span class="separator">/</span>
                <span>시스템 관리</span>
                <span class="separator">/</span>
                <span class="current">${pascalName} 관리</span>
            </div>
        </div>

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

.page-header {
    margin-bottom: 24px;
}

.page-title {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 8px 0;
}

.breadcrumb {
    font-size: 14px;
    color: #666;
}

.breadcrumb .separator {
    margin: 0 8px;
}

.breadcrumb .current {
    color: #333;
    font-weight: 500;
}
</style>
`,

    search: `<template>
    <div class="${pageName}-search">
        <div class="search-row">
            <div class="search-field">
                <label class="field-label">검색어</label>
                <input
                    v-model="localSearchState.keyword"
                    type="text"
                    class="field-input"
                    placeholder="검색어를 입력하세요"
                    @keydown.enter="handleSearch"
                />
            </div>

            <div class="search-field">
                <label class="field-label">상태</label>
                <select v-model="localSearchState.status" class="field-select">
                    <option v-for="opt in (options.statusList || [])" :key="opt.value" :value="opt.value">
                        {{ opt.label }}
                    </option>
                </select>
            </div>

            <div class="search-buttons">
                <button type="button" class="btn btn-primary" @click="handleSearch">
                    {{ UI_TEXT.SEARCH }}
                </button>
                <button type="button" class="btn btn-secondary" @click="handleReset">
                    {{ UI_TEXT.RESET }}
                </button>
            </div>
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
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
}

.search-row {
    display: flex;
    gap: 16px;
    align-items: flex-end;
    flex-wrap: wrap;
}

.search-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.field-label {
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

.field-input,
.field-select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    min-width: 200px;
}

.field-input:focus,
.field-select:focus {
    outline: none;
    border-color: #1976d2;
}

.search-buttons {
    display: flex;
    gap: 8px;
}

.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-primary {
    background: #1976d2;
    color: #fff;
}

.btn-primary:hover {
    background: #1565c0;
}

.btn-secondary {
    background: #e0e0e0;
    color: #333;
}

.btn-secondary:hover {
    background: #d0d0d0;
}
</style>
`,

    list: `<template>
    <div class="${pageName}-list">
        <div class="list-header">
            <span class="total-count">총 {{ data.totalCount }}건</span>
            <button type="button" class="btn btn-primary" @click="handleOpenRegist">
                {{ UI_TEXT.REGISTER }}
            </button>
        </div>

        <BaseTable
            :headers="TABLE_HEADERS"
            :data="data.list"
            :loading="isLoading"
            @row-click="handleRowClick"
        />

        <BasePagination
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
import BaseTable from './BaseTable.vue';
import BasePagination from './BasePagination.vue';
import { TABLE_HEADERS, UI_TEXT } from '../constants';

defineProps({
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
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
}

.list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.total-count {
    font-size: 14px;
    color: #666;
}

.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
}

.btn-primary {
    background: #1976d2;
    color: #fff;
}

.btn-primary:hover {
    background: #1565c0;
}
</style>
`,

    baseTable: `<template>
    <div class="base-table">
        <div v-if="loading" class="loading-overlay">
            <span>로딩 중...</span>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th
                        v-for="header in headers"
                        :key="header.name"
                        :style="{ width: header.width + 'px', textAlign: header.align }"
                    >
                        {{ header.header }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="data.length === 0">
                    <td :colspan="headers.length" class="empty-message">
                        데이터가 없습니다.
                    </td>
                </tr>
                <tr
                    v-for="(row, index) in data"
                    :key="index"
                    class="table-row"
                    @click="$emit('row-click', row)"
                >
                    <td
                        v-for="header in headers"
                        :key="header.name"
                        :style="{ textAlign: header.align }"
                    >
                        {{ row[header.name] }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
defineProps({
    headers: {
        type: Array,
        required: true,
    },
    data: {
        type: Array,
        default: () => [],
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

defineEmits(['row-click']);
</script>

<style scoped>
.base-table {
    position: relative;
    overflow-x: auto;
}

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table th,
.table td {
    padding: 12px;
    border-bottom: 1px solid #e0e0e0;
}

.table th {
    background: #f5f5f5;
    font-weight: 600;
    font-size: 14px;
}

.table td {
    font-size: 14px;
}

.table-row {
    cursor: pointer;
    transition: background-color 0.2s;
}

.table-row:hover {
    background: #f9f9f9;
}

.empty-message {
    text-align: center;
    color: #999;
    padding: 40px !important;
}
</style>
`,

    basePagination: `<template>
    <div class="base-pagination">
        <div class="page-size-selector">
            <select :value="pageSize" @change="handlePageSizeChange">
                <option v-for="size in pageSizes" :key="size" :value="size">
                    {{ size }}개씩 보기
                </option>
            </select>
        </div>

        <div class="pagination-buttons">
            <button
                type="button"
                class="page-btn"
                :disabled="current === 1"
                @click="handlePageChange(current - 1)"
            >
                이전
            </button>

            <button
                v-for="page in visiblePages"
                :key="page"
                type="button"
                class="page-btn"
                :class="{ active: page === current }"
                @click="handlePageChange(page)"
            >
                {{ page }}
            </button>

            <button
                type="button"
                class="page-btn"
                :disabled="current === totalPages"
                @click="handlePageChange(current + 1)"
            >
                다음
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    current: {
        type: Number,
        default: 1,
    },
    total: {
        type: Number,
        default: 0,
    },
    pageSize: {
        type: Number,
        default: 10,
    },
});

const emit = defineEmits(['change', 'page-size-change']);

const pageSizes = [10, 20, 50, 100];

const totalPages = computed(() => Math.ceil(props.total / props.pageSize) || 1);

const visiblePages = computed(() => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, props.current - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages.value, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        emit('change', page);
    }
};

const handlePageSizeChange = (e) => {
    emit('page-size-change', Number(e.target.value));
};
</script>

<style scoped>
.base-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid #e0e0e0;
}

.page-size-selector select {
    padding: 6px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.pagination-buttons {
    display: flex;
    gap: 4px;
}

.page-btn {
    padding: 6px 12px;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
    background: #f5f5f5;
}

.page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-btn.active {
    background: #1976d2;
    color: #fff;
    border-color: #1976d2;
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
 *
 * TODO: 실제 API 경로로 수정 필요
 */

const API_BASE_URL = '/api';

/**
 * 옵션 목록 조회 (셀렉트박스용)
 */
export const getOption = async () => {
    // TODO: 실제 API 연동 시 주석 해제
    // const res = await fetch(\`\${API_BASE_URL}/${camelName}/options\`);
    // return await res.json();

    // Mock 데이터
    return {
        result: true,
        data: {
            statusList: [
                { label: '전체', value: '' },
                { label: '활성', value: 'active' },
                { label: '비활성', value: 'inactive' },
            ]
        }
    };
};

/**
 * 목록 조회
 * @param {Object} params - 검색 파라미터
 */
export const get${pascalName}List = async (params) => {
    // TODO: 실제 API 연동 시 주석 해제
    // const queryParams = new URLSearchParams(params).toString();
    // const res = await fetch(\`\${API_BASE_URL}/${camelName}/list?\${queryParams}\`);
    // return await res.json();

    // Mock 데이터
    return {
        result: true,
        data: {
            list: [
                { id: '1', name: '샘플 데이터 1', status: 'active', regDt: '2024-01-01' },
                { id: '2', name: '샘플 데이터 2', status: 'inactive', regDt: '2024-01-02' },
            ],
            totalCount: 2
        }
    };
};

/**
 * 상세 조회
 * @param {string} id - 조회할 ID
 */
export const get${pascalName} = async (id) => {
    const res = await fetch(\`\${API_BASE_URL}/${camelName}/\${id}\`);
    return await res.json();
};

/**
 * 등록
 * @param {Object} data - 등록할 데이터
 */
export const add${pascalName} = async (data) => {
    const res = await fetch(\`\${API_BASE_URL}/${camelName}\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return await res.json();
};

/**
 * 수정
 * @param {Object} data - 수정할 데이터
 */
export const update${pascalName} = async (data) => {
    const res = await fetch(\`\${API_BASE_URL}/${camelName}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return await res.json();
};

/**
 * 삭제
 * @param {string} id - 삭제할 ID
 */
export const delete${pascalName} = async (id) => {
    const res = await fetch(\`\${API_BASE_URL}/${camelName}/\${id}\`, {
        method: 'DELETE',
    });
    return await res.json();
};
`,

    hook: `/**
 * ${pascalName} 페이지 메인 훅
 */
import { useState, useEffect, useCallback } from 'react';
import { getOption, get${pascalName}List } from '../api';
import {
    INITIAL_SEARCH_STATE,
    INITIAL_PAGE_STATE,
    ERROR_MESSAGES
} from '../constants';

export const use${pascalName} = () => {
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
                alert(ERROR_MESSAGES.FETCH_FAILED);
            }
        } catch (error) {
            console.error('Failed to fetch list:', error);
            alert(ERROR_MESSAGES.FETCH_FAILED);
        } finally {
            setIsLoading(false);
        }
    }, [searchState, pageState.page, pageState.size]);

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

    page: `'use client';

/**
 * ${pascalName} 페이지
 */
import { use${pascalName} } from './components/hooks/use${pascalName}';
import ${pascalName}Search from './components/ui/${pascalName}Search';
import ${pascalName}List from './components/ui/${pascalName}List';
import styles from './${pascalName}Page.module.css';

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
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>${pascalName} 관리</h1>
                <div className={styles.breadcrumb}>
                    <span>업무지원</span>
                    <span className={styles.separator}>/</span>
                    <span>시스템 관리</span>
                    <span className={styles.separator}>/</span>
                    <span className={styles.current}>${pascalName} 관리</span>
                </div>
            </div>

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
        </div>
    );
};

export default ${pascalName}Page;
`,

    search: `'use client';

/**
 * ${pascalName} 검색 컴포넌트
 */
import { UI_TEXT } from '../constants';
import styles from './${pascalName}Search.module.css';

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
        <div className={styles.search}>
            <div className={styles.searchRow}>
                <div className={styles.searchField}>
                    <label className={styles.fieldLabel}>검색어</label>
                    <input
                        type="text"
                        className={styles.fieldInput}
                        value={searchState.keyword}
                        onChange={handleChange('keyword')}
                        onKeyDown={handleKeyDown}
                        placeholder="검색어를 입력하세요"
                    />
                </div>

                <div className={styles.searchField}>
                    <label className={styles.fieldLabel}>상태</label>
                    <select
                        className={styles.fieldSelect}
                        value={searchState.status}
                        onChange={handleChange('status')}
                    >
                        {(options.statusList || []).map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.searchButtons}>
                    <button type="button" className={styles.btnPrimary} onClick={onSearch}>
                        {UI_TEXT.SEARCH}
                    </button>
                    <button type="button" className={styles.btnSecondary} onClick={onReset}>
                        {UI_TEXT.RESET}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ${pascalName}Search;
`,

    list: `'use client';

/**
 * ${pascalName} 목록 컴포넌트
 */
import BaseTable from './BaseTable';
import BasePagination from './BasePagination';
import { TABLE_HEADERS, UI_TEXT } from '../constants';
import styles from './${pascalName}List.module.css';

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
        <div className={styles.list}>
            <div className={styles.listHeader}>
                <span className={styles.totalCount}>총 {totalCount}건</span>
                <button type="button" className={styles.btnPrimary} onClick={onOpenRegist}>
                    {UI_TEXT.REGISTER}
                </button>
            </div>

            <BaseTable
                headers={TABLE_HEADERS}
                data={list}
                loading={isLoading}
                onRowClick={onRowClick}
            />

            <BasePagination
                current={pageState.page}
                total={totalCount}
                pageSize={pageState.size}
                onChange={onChangePage}
                onPageSizeChange={onChangePageSize}
            />
        </div>
    );
};

export default ${pascalName}List;
`,

    baseTable: `'use client';

/**
 * 기본 테이블 컴포넌트
 */
import styles from './BaseTable.module.css';

const BaseTable = ({ headers, data = [], loading = false, onRowClick }) => {
    return (
        <div className={styles.tableWrapper}>
            {loading && (
                <div className={styles.loadingOverlay}>
                    <span>로딩 중...</span>
                </div>
            )}

            <table className={styles.table}>
                <thead>
                    <tr>
                        {headers.map(header => (
                            <th
                                key={header.name}
                                style={{ width: header.width, textAlign: header.align }}
                            >
                                {header.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={headers.length} className={styles.emptyMessage}>
                                데이터가 없습니다.
                            </td>
                        </tr>
                    ) : (
                        data.map((row, index) => (
                            <tr
                                key={index}
                                className={styles.tableRow}
                                onClick={() => onRowClick?.(row)}
                            >
                                {headers.map(header => (
                                    <td key={header.name} style={{ textAlign: header.align }}>
                                        {row[header.name]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BaseTable;
`,

    basePagination: `'use client';

/**
 * 기본 페이지네이션 컴포넌트
 */
import { useMemo } from 'react';
import styles from './BasePagination.module.css';

const BasePagination = ({ current = 1, total = 0, pageSize = 10, onChange, onPageSizeChange }) => {
    const pageSizes = [10, 20, 50, 100];

    const totalPages = useMemo(() => Math.ceil(total / pageSize) || 1, [total, pageSize]);

    const visiblePages = useMemo(() => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, current - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    }, [current, totalPages]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            onChange?.(page);
        }
    };

    const handlePageSizeChange = (e) => {
        onPageSizeChange?.(Number(e.target.value));
    };

    return (
        <div className={styles.pagination}>
            <div className={styles.pageSizeSelector}>
                <select value={pageSize} onChange={handlePageSizeChange}>
                    {pageSizes.map(size => (
                        <option key={size} value={size}>
                            {size}개씩 보기
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.paginationButtons}>
                <button
                    type="button"
                    className={styles.pageBtn}
                    disabled={current === 1}
                    onClick={() => handlePageChange(current - 1)}
                >
                    이전
                </button>

                {visiblePages.map(page => (
                    <button
                        key={page}
                        type="button"
                        className={\`\${styles.pageBtn} \${page === current ? styles.active : ''}\`}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}

                <button
                    type="button"
                    className={styles.pageBtn}
                    disabled={current === totalPages}
                    onClick={() => handlePageChange(current + 1)}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default BasePagination;
`,

    // CSS Module 스타일
    pageStyles: `.page {
    padding: 20px;
}
.pageHeader { margin-bottom: 24px; }
.pageTitle { font-size: 24px; font-weight: 600; margin: 0 0 8px 0; }
.breadcrumb { font-size: 14px; color: #666; }
.separator { margin: 0 8px; }
.current { color: #333; font-weight: 500; }
`,

    searchStyles: `.search {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
}
.searchRow { display: flex; gap: 16px; align-items: flex-end; flex-wrap: wrap; }
.searchField { display: flex; flex-direction: column; gap: 6px; }
.fieldLabel { font-size: 14px; font-weight: 500; color: #333; }
.fieldInput, .fieldSelect { padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; min-width: 200px; }
.fieldInput:focus, .fieldSelect:focus { outline: none; border-color: #1976d2; }
.searchButtons { display: flex; gap: 8px; }
.btnPrimary, .btnSecondary { padding: 8px 16px; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; }
.btnPrimary { background: #1976d2; color: #fff; }
.btnPrimary:hover { background: #1565c0; }
.btnSecondary { background: #e0e0e0; color: #333; }
.btnSecondary:hover { background: #d0d0d0; }
`,

    listStyles: `.list {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
}
.listHeader { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.totalCount { font-size: 14px; color: #666; }
.btnPrimary { padding: 8px 16px; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; background: #1976d2; color: #fff; }
.btnPrimary:hover { background: #1565c0; }
`,

    baseTableStyles: `.tableWrapper { position: relative; overflow-x: auto; }
.loadingOverlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255, 255, 255, 0.8); display: flex; align-items: center; justify-content: center; z-index: 10; }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { padding: 12px; border-bottom: 1px solid #e0e0e0; }
.table th { background: #f5f5f5; font-weight: 600; font-size: 14px; }
.table td { font-size: 14px; }
.tableRow { cursor: pointer; transition: background-color 0.2s; }
.tableRow:hover { background: #f9f9f9; }
.emptyMessage { text-align: center; color: #999; padding: 40px !important; }
`,

    basePaginationStyles: `.pagination { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 16px; border-top: 1px solid #e0e0e0; }
.pageSizeSelector select { padding: 6px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
.paginationButtons { display: flex; gap: 4px; }
.pageBtn { padding: 6px 12px; border: 1px solid #ddd; background: #fff; border-radius: 4px; font-size: 14px; cursor: pointer; transition: all 0.2s; }
.pageBtn:hover:not(:disabled) { background: #f5f5f5; }
.pageBtn:disabled { opacity: 0.5; cursor: not-allowed; }
.active { background: #1976d2; color: #fff; border-color: #1976d2; }
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
