/**
 * newman-jira-reporter.js
 * Chạy Postman collection bằng Newman, sau đó tự động tạo Jira issue
 * cho mỗi request có test fail — gán vào Sprint 2.
 *
 * Cách dùng:
 *   node scripts/newman-jira-reporter.js
 *
 * Yêu cầu:
 *   npm install newman axios
 *   Set JIRA_API_TOKEN trong .env
 */

require('dotenv').config();
const newman = require('newman');
const axios  = require('axios');
const path   = require('path');

// ── Config ────────────────────────────────────────────────────
const COLLECTION   = path.join(__dirname, '../docs/son-collection.json');
const ENVIRONMENT  = path.join(__dirname, '../docs/shared-environment.json');

const JIRA_URL     = process.env.JIRA_URL     || 'https://pson4282.atlassian.net';
const JIRA_EMAIL   = process.env.JIRA_EMAIL   || 'pson4282@gmail.com';
const JIRA_TOKEN   = process.env.JIRA_API_TOKEN;
const PROJECT_KEY  = 'KIEM';
const SPRINT_ID    = 2;
// ─────────────────────────────────────────────────────────────

if (!JIRA_TOKEN) {
    console.error('❌ JIRA_API_TOKEN chưa được set trong .env');
    process.exit(1);
}

const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64');

async function issueExists(summary) {
    try {
        // Tìm issue có summary giống hệt trong project, chưa bị xóa
        const jql = `project = "${PROJECT_KEY}" AND summary ~ "${summary.replace(/"/g, '\\"')}" AND issuetype = Bug ORDER BY created DESC`;
        const res = await axios.get(
            `${JIRA_URL}/rest/api/3/search`,
            {
                params: { jql, maxResults: 1, fields: 'summary' },
                headers: { 'Authorization': `Basic ${auth}` }
            }
        );
        const issues = res.data.issues || [];
        // So sánh exact summary để tránh false positive
        return issues.some(i => i.fields.summary === summary);
    } catch (err) {
        console.warn(`⚠️  Không thể check duplicate: ${err.response?.status}`);
        return false; // Nếu check lỗi thì vẫn tạo mới
    }
}

async function createJiraIssue(summary, detail) {
    const exists = await issueExists(summary);
    if (exists) {
        console.log(`⏭️  Bỏ qua (đã tồn tại): ${summary}`);
        return;
    }

    try {
        const res = await axios.post(
            `${JIRA_URL}/rest/api/3/issue`,
            {
                fields: {
                    project:     { key: PROJECT_KEY },
                    summary,
                    description: {
                        version: 1, type: 'doc',
                        content: [{ type: 'paragraph', content: [{ type: 'text', text: detail }] }]
                    },
                    issuetype:   { name: 'Bug' },
                    customfield_10020: SPRINT_ID
                }
            },
            { headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' } }
        );
        console.log(`✅ Jira: ${res.data.key} — ${summary}`);
    } catch (err) {
        console.error(`❌ Jira error: ${err.response?.status} ${JSON.stringify(err.response?.data)}`);
    }
}

// ── Chạy Newman ───────────────────────────────────────────────
newman.run({
    collection:  COLLECTION,
    environment: ENVIRONMENT,
    reporters:   ['cli']
}, async (err, summary) => {
    if (err) {
        console.error('Newman error:', err);
        process.exit(1);
    }

    const failures = [];

    summary.run.executions.forEach(exec => {
        const requestName = exec.item.name;
        const url         = exec.request?.url?.toString() || '';
        const method      = exec.request?.method || '';
        const status      = exec.response?.code || 'N/A';

        const failedTests = (exec.assertions || []).filter(a => a.error);
        if (failedTests.length === 0) return;

        const testNames = failedTests.map(a => `- ${a.assertion}: ${a.error?.message}`).join('\n');
        failures.push({ requestName, url, method, status, testNames });
    });

    if (failures.length === 0) {
        console.log('\n🎉 Tất cả test pass — không có bug nào cần log!');
        return;
    }

    console.log(`\n🐛 Tìm thấy ${failures.length} request(s) có test fail — đang log lên Jira...`);

    for (const f of failures) {
        const summary = `[BUG] ${f.requestName} — ${f.testNames.split('\n').length} test(s) failed`;
        const detail  = `Request: ${f.requestName}\nURL: ${f.url}\nMethod: ${f.method}\nStatus: ${f.status}\n\nFailed tests:\n${f.testNames}`;
        await createJiraIssue(summary, detail);
    }
});
