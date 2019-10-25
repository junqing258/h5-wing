const scanner = require('sonarqube-scanner');
const fs = require('fs');
const version = fs.existsSync('VERSION')
    ? fs.readFileSync('VERSION').toString()
    : '1.0.0';

const exclusions = [
    '**/*-test.js',
    'src/__tests__/**',
    'src/__mocks__/**',
    'src/*.{js,jsx}',
    'src/js/pages/msg/index.js',
    'src/js/libs/flexible.js',
    'src/js/libs/qrcode.js'
];
 
scanner({
    serverUrl: 'http://srv.dev.pajkdc.com/healthsonar/',
    options: {
        'sonar.projectKey': 'html-collection',
        'sonar.projectName': 'html-collection',
        'sonar.projectVersion': version,
        'sonar.sources': 'src',
        'sonar.exclusions': exclusions.toString(),
        'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info',
        'sonar.testExecutionReportPaths': 'test-report.xml'
    }
}, () => {console.log('callback');});

