#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 사용 가능한 스킬 목록
const AVAILABLE_SKILLS = [
    {
        id: 'dscore-utils',
        name: 'dscore-utils',
        description: 'dscore-utils 라이브러리 유틸리티 함수 가이드',
        sourceFile: 'dscore_utils_skill.md',
        keywords: '유틸리티 함수 사용법, 배열 유틸리티, 날짜 포맷팅, 숫자 포맷팅'
    },
    {
        id: 'dscore-cli',
        name: 'dscore-cli',
        description: 'dscore-cli 명령어 사용 가이드',
        sourceFile: 'dscore_cli_skill.md',
        keywords: '페이지 생성, generate-page, CLI 명령어, 스캐폴딩'
    }
];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const showSkillList = () => {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║              📚 사용 가능한 Skills 목록                    ║');
    console.log('╠═══════════════════════════════════════════════════════════╣');

    AVAILABLE_SKILLS.forEach((skill, index) => {
        const num = `${index + 1}.`.padEnd(3);
        console.log(`║   ${num} ${skill.name.padEnd(52)}║`);
    });

    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log('║   0.  취소                                                ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');
};

const createSkillFile = (skill) => {
    const docsDir = path.join(__dirname, '..', 'docs');
    const sourceFilePath = path.join(docsDir, skill.sourceFile);

    // 소스 파일 읽기
    if (!fs.existsSync(sourceFilePath)) {
        console.error(`❌  소스 파일을 찾을 수 없습니다: ${sourceFilePath}`);
        process.exit(1);
    }

    const sourceContent = fs.readFileSync(sourceFilePath, 'utf-8');

    // YAML 프론트매터 추가
    const skillContent = `---
name: ${skill.id}
description: ${skill.description}. "${skill.keywords}" 등을 물어볼 때 사용합니다.
---

${sourceContent}`;

    // 현재 작업 디렉토리 기준 .claude/skills/<skill-name>/SKILL.md 생성
    const cwd = process.cwd();
    const skillDir = path.join(cwd, '.claude', 'skills', skill.id);
    const skillFilePath = path.join(skillDir, 'SKILL.md');

    // 디렉토리 생성
    if (!fs.existsSync(skillDir)) {
        fs.mkdirSync(skillDir, { recursive: true });
    }

    // SKILL.md 파일 작성
    fs.writeFileSync(skillFilePath, skillContent, 'utf-8');

    return skillFilePath;
};

const main = async () => {
    showSkillList();

    try {
        const answer = await question('설치할 skill 번호를 입력하세요: ');
        const choice = parseInt(answer.trim(), 10);

        if (choice === 0 || isNaN(choice)) {
            console.log('');
            console.log('👋 취소되었습니다.');
            rl.close();
            process.exit(0);
        }

        if (choice < 1 || choice > AVAILABLE_SKILLS.length) {
            console.error('');
            console.error(`❌  잘못된 선택입니다. 1-${AVAILABLE_SKILLS.length} 사이의 숫자를 입력하세요.`);
            rl.close();
            process.exit(1);
        }

        const selectedSkill = AVAILABLE_SKILLS[choice - 1];
        console.log('');
        console.log(`📦 ${selectedSkill.name} skill을 설치합니다...`);

        const createdPath = createSkillFile(selectedSkill);

        console.log('');
        console.log('╔═══════════════════════════════════════════════════════════╗');
        console.log('║                    ✅ 설치 완료!                          ║');
        console.log('╠═══════════════════════════════════════════════════════════╣');
        console.log('║                                                           ║');
        console.log(`║  Skill: ${selectedSkill.name.padEnd(48)}║`);
        console.log('║                                                           ║');
        console.log('║  생성된 파일:                                              ║');
        const relativePath = path.relative(process.cwd(), createdPath);
        console.log(`║    ${relativePath.padEnd(53)}║`);
        console.log('║                                                           ║');
        console.log('║  사용 방법:                                                ║');
        console.log(`║    Claude에서 /${selectedSkill.id} 로 호출하거나            ║`);
        console.log('║    관련 질문 시 자동으로 로드됩니다.                        ║');
        console.log('║                                                           ║');
        console.log('╚═══════════════════════════════════════════════════════════╝');
        console.log('');

        rl.close();
    } catch (error) {
        console.error('');
        console.error(`❌  오류 발생: ${error.message}`);
        rl.close();
        process.exit(1);
    }
};

main();
