const https = require("https");

/**
 * Jira API Helper
 * Handles Jira issue creation with timeout and error handling
 */

/**
 * Create a Jira issue
 * @param {Object} config - Jira configuration
 * @param {string} config.jiraUrl - Jira base URL (e.g., https://pson4282.atlassian.net)
 * @param {string} config.jiraEmail - Jira account email
 * @param {string} config.jiraToken - Jira API token
 * @param {string} config.projectKey - Jira project key (e.g., KIEM)
 * @param {number} config.sprintId - Sprint ID
 * @param {Object} issue - Issue details
 * @param {string} issue.summary - Issue summary/title
 * @param {string} issue.description - Issue description
 * @returns {Promise<Object>} Created issue response
 */
function createJiraIssue(config, issue) {
  return new Promise((resolve, reject) => {
    const { jiraUrl, jiraEmail, jiraToken, projectKey, sprintId } = config;
    const { summary, description } = issue;

    // Validate config
    if (!jiraUrl || !jiraEmail || !jiraToken || !projectKey) {
      return reject(new Error("Missing Jira configuration"));
    }

    // Prepare authorization header
    const auth = Buffer.from(`${jiraEmail}:${jiraToken}`).toString("base64");

    // Prepare request body
    const body = JSON.stringify({
      fields: {
        project: { key: projectKey },
        summary: summary,
        description: {
          version: 1,
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: description }],
            },
          ],
        },
        issuetype: { name: "Bug" },
        ...(sprintId && { customfield_10020: sprintId }),
      },
    });

    // Parse URL
    const url = new URL(`${jiraUrl}/rest/api/3/issue`);

    // Prepare request options
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
        "Content-Length": Buffer.byteLength(body),
      },
      timeout: 10000, // 10 second timeout
    };

    // Make request
    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const result = JSON.parse(data);
            resolve(result);
          } catch (e) {
            reject(new Error(`Failed to parse Jira response: ${e.message}`));
          }
        } else {
          reject(new Error(`Jira API error (${res.statusCode}): ${data}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(new Error(`Jira request failed: ${error.message}`));
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Jira request timeout (10s)"));
    });

    req.write(body);
    req.end();
  });
}

/**
 * Load Jira config from environment or .jirarc file
 * Priority: CLI args > Environment variables > .jirarc file
 * @returns {Object} Jira configuration
 */
function loadJiraConfig() {
  // Try environment variables first
  const config = {
    jiraUrl: process.env.JIRA_URL || "https://pson4282.atlassian.net",
    jiraEmail: process.env.JIRA_EMAIL || "pson4282@gmail.com",
    jiraToken: process.env.JIRA_API_TOKEN,
    projectKey: process.env.JIRA_PROJECT_KEY || "KIEM",
    sprintId: process.env.JIRA_SPRINT_ID
      ? parseInt(process.env.JIRA_SPRINT_ID)
      : 2,
  };

  // Try loading from .jirarc file if token not in env
  if (!config.jiraToken) {
    try {
      const fs = require("fs");
      const path = require("path");
      const rcPath = path.join(process.cwd(), ".jirarc");

      if (fs.existsSync(rcPath)) {
        const rcContent = fs.readFileSync(rcPath, "utf8");
        const rcConfig = JSON.parse(rcContent);

        config.jiraUrl = rcConfig.jiraUrl || config.jiraUrl;
        config.jiraEmail = rcConfig.jiraEmail || config.jiraEmail;
        config.jiraToken = rcConfig.jiraToken || config.jiraToken;
        config.projectKey = rcConfig.projectKey || config.projectKey;
        config.sprintId = rcConfig.sprintId || config.sprintId;
      }
    } catch (e) {
      // Ignore errors, will use env vars
    }
  }

  return config;
}

module.exports = {
  createJiraIssue,
  loadJiraConfig,
};
