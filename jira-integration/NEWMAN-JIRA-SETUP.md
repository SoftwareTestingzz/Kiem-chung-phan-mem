# 🧪 Newman Test Runner with Jira Integration

Automatically run Postman collection tests with Newman and create Jira issues for failed tests.

## 📋 Features

✅ Run Postman collections via Newman CLI
✅ Auto-create Jira issues for failed tests
✅ Group failures by request
✅ 10-second timeout for Jira API calls
✅ Stable - doesn't interfere with Postman UI testing
✅ Configurable via environment variables or `.jirarc` file

---

## 🚀 Quick Start

### 1. Setup Jira API Token

Create a Jira API token:

1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Copy the token

### 2. Configure credentials

**Option A: Using `.jirarc` file (recommended)**

```bash
# Copy example file
cp .jirarc.example .jirarc

# Edit .jirarc and replace YOUR_JIRA_API_TOKEN_HERE with your token
```

**Option B: Using environment variables**

```bash
export JIRA_API_TOKEN="your_token_here"
export JIRA_URL="https://pson4282.atlassian.net"
export JIRA_EMAIL="pson4282@gmail.com"
export JIRA_PROJECT_KEY="KIEM"
export JIRA_SPRINT_ID="2"
```

### 3. Run tests with Jira integration

```bash
npm run test:with-jira
```

---

## 📖 Usage

### Basic Usage

```bash
# Run tests + auto-create Jira issues for failures
npm run test:with-jira
```

### Advanced Options

```bash
# Run specific collection
node newman-jira-runner.js --collection my-collection.json

# Run with environment file
node newman-jira-runner.js --collection son-collection.json --environment docs/shared-environment.json

# Run tests only (skip Jira integration)
node newman-jira-runner.js --skip-jira

# Show help
node newman-jira-runner.js --help
```

---

## 📊 Output Example

```
==========================================================
🧪 Newman Test Runner with Jira Integration
==========================================================

📋 Configuration:
   Collection: son-collection.json
   Environment: None
   Jira Integration: ✅ Enabled

🚀 Running tests...

→ AUTH-L-01 | Login thành công
  ✓  TC01 - Status 200 OK
  ✓  TC01 - Response JSON thành công

→ AUTH-L-02 | Login sai password
  ✗  TC02 - Status 400
     AssertionError: expected 200 to equal 400
  ✗  TC02 - Response có success: false
     AssertionError: expected true to equal false

==========================================================
📊 Test Results
==========================================================

Total requests:   2
Total tests:      4
Passed:           2 ✅
Failed:           2 ❌
Duration:         345ms

❌ Failed Tests:

   • AUTH-L-02 | Login sai password
     Test: TC02 - Status 400
     Error: expected 200 to equal 400

   • AUTH-L-02 | Login sai password
     Test: TC02 - Response có success: false
     Error: expected true to equal false

==========================================================
🐛 Creating Jira Issues
==========================================================

Creating issue for: AUTH-L-02 | Login sai password...
✅ Created: KIEM-15
   URL: https://pson4282.atlassian.net/browse/KIEM-15

==========================================================
📈 Jira Integration Summary
==========================================================

Created:  1 issue(s) ✅
Failed:   0 issue(s) ❌

🔗 View issues: https://pson4282.atlassian.net/jira/software/projects/KIEM/board

==========================================================
✅ Test Complete
==========================================================
```

---

## ⚙️ Configuration

### Environment Variables

| Variable           | Description        | Default                          |
| ------------------ | ------------------ | -------------------------------- |
| `JIRA_API_TOKEN`   | Jira API token     | (required)                       |
| `JIRA_URL`         | Jira base URL      | `https://pson4282.atlassian.net` |
| `JIRA_EMAIL`       | Jira account email | `pson4282@gmail.com`             |
| `JIRA_PROJECT_KEY` | Jira project key   | `KIEM`                           |
| `JIRA_SPRINT_ID`   | Sprint ID          | `2`                              |

### `.jirarc` File Format

```json
{
  "jiraUrl": "https://pson4282.atlassian.net",
  "jiraEmail": "pson4282@gmail.com",
  "jiraToken": "YOUR_JIRA_API_TOKEN_HERE",
  "projectKey": "KIEM",
  "sprintId": 2
}
```

**Priority:** Environment variables > `.jirarc` file

---

## 🔒 Security Notes

- ⚠️ **NEVER commit `.jirarc` file to git** (already in `.gitignore`)
- ⚠️ **NEVER commit API tokens** to the repository
- ✅ Use environment variables in CI/CD pipelines
- ✅ Rotate API tokens periodically

---

## 🛠️ Troubleshooting

### Issue: "JIRA_API_TOKEN not set"

**Solution:** Set the token via environment variable or `.jirarc` file (see Setup section above)

### Issue: "Jira request timeout (10s)"

**Cause:** Jira API is slow or unresponsive
**Solution:** Check network connection and Jira status

### Issue: "Jira API error (401)"

**Cause:** Invalid API token or email
**Solution:**

1. Verify token is correct
2. Verify email matches Jira account
3. Regenerate API token if needed

### Issue: "Jira API error (403)"

**Cause:** No permission to create issues
**Solution:** Check Jira project permissions

### Issue: "Jira API error (400)"

**Cause:** Invalid request body (usually Sprint ID)
**Solution:**

1. Check Sprint ID exists in Jira
2. Try removing `sprintId` from config

---

## 📁 Files Created

| File                    | Purpose                      |
| ----------------------- | ---------------------------- |
| `newman-jira-runner.js` | Main runner script           |
| `jira-api.js`           | Jira API helper with timeout |
| `.jirarc.example`       | Example config file          |
| `NEWMAN-JIRA-SETUP.md`  | This documentation           |

---

## 🎯 Workflow Comparison

### Before (Manual)

1. Run tests in Postman UI
2. Manually note failed tests
3. Manually create Jira issues
4. Copy/paste test details

**Time:** ~5 minutes per failed request

### After (Automated)

1. Run `npm run test:with-jira`
2. ✨ Issues auto-created with full details

**Time:** ~30 seconds total

---

## 🧹 Cleanup

To remove Jira integration:

```bash
# Remove files
rm newman-jira-runner.js jira-api.js .jirarc .jirarc.example NEWMAN-JIRA-SETUP.md

# Remove npm script (edit package.json and remove test:with-jira line)
```

---

## 📝 Notes

- This tool **does NOT modify** your Postman collection
- You can still use Postman UI normally
- Newman runner is completely independent
- Safe to run in CI/CD pipelines
- Failed tests still show in Newman output (not hidden)

---

## 🆘 Support

If you encounter issues:

1. Check console output for error messages
2. Verify Jira token is valid
3. Check network connectivity to Jira
4. Review this README troubleshooting section

---

Made with ❤️ for automated testing + Jira integration
