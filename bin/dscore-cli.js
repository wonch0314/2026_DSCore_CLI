#!/usr/bin/env node

const args = process.argv.slice(2);
const command = args[0];

const showHelp = () => {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║                    🛠️  DSCORE CLI                          ║');
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log('║                                                           ║');
    console.log('║  사용법:                                                   ║');
    console.log('║    npx dscore-cli <command> [options]                     ║');
    console.log('║                                                           ║');
    console.log('║  명령어:                                                   ║');
    console.log('║    generate-page [name]  새 페이지 구조 생성               ║');
    console.log('║    add-skill             Claude Code Skill 설치           ║');
    console.log('║    help                  도움말 표시                       ║');
    console.log('║                                                           ║');
    console.log('║  예시:                                                     ║');
    console.log('║    npx dscore-cli generate-page                           ║');
    console.log('║    npx dscore-cli generate-page user-mgt                  ║');
    console.log('║    npx dscore-cli add-skill                               ║');
    console.log('║                                                           ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');
};

switch (command) {
    case 'generate-page':
    case 'gp':
        require('./commands/generate-page');
        break;
    case 'add-skill':
    case 'as':
        require('./commands/add-skill');
        break;
    case 'help':
    case '--help':
    case '-h':
    case undefined:
        showHelp();
        break;
    default:
        console.error(`❌  알 수 없는 명령어: ${command}`);
        showHelp();
        process.exit(1);
}
