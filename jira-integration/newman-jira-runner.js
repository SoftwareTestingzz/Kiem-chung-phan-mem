#!/usr/bin/env node

/**
 * Newman Test Runner with Jira Integration
 *
 * Runs Postman collection with Newman and automatically creates Jira issues for failed tests.
 *
 * Usage:
 *   node newman-jira-runner.js [options]
 *
 * Options:
 *   --collection <path>    Path to Postman collection (default: son-collection.json)
 *   --environment <path>   Path to environment file (optional)
 *   --skip-jira           Skip Jira integration (just run tests)
 *   --help                Show help
 *
 * Environment variables:
 *   JIRA_API_TOKEN        Jira API token (required for Jira integration)
 *   JIRA_URL              Jira base URL (default: https://pson4282.atlassian.net)
 *   JIRA_EMAIL            Jira email (default: pson4282@gmail.com)
 *   JIRA_PROJECT_KEY      Jira project key (default: KIEM)
 *   JIRA_SPRINT_ID        Sprint ID (default: 2)
 */

const newman = require("newman");
const path = require("path");
const { createJiraIssue, loadJiraConfig } = require("./jira-api");

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  collection: "son-collection.json",
  environment: null,
  skipJira: false,
};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg === "--help" || arg === "-h") {
    console.log(`
Newman Test Runner with Jira Integration

Usage:
  node newman-jira-runner.js [options]

Options:
  --collection <path>    Path to Postman collection (default: son-collection.json)
  --environment <path>   Path to environment file (optional)
  --skip-jira           Skip Jira integration (just run tests)
  --help                Show help

Environment variables:
  JIRA_API_TOKEN        Jira API token (required for Jira integration)
  JIRA_URL              Jira base URL (default: https://pson4282.atlassian.net)
  JIRA_EMAIL            Jira email (default: pson4282@gmail.com)
  JIRA_PROJECT_KEY      Jira project key (default: KIEM)
  JIRA_SPRINT_ID        Sprint ID (default: 2)
    `);
    process.exit(0);
  } else if (arg === "--collection") {
    options.collection = args[++i];
  } else if (arg === "--environment") {
    options.environment = args[++i];
  } else if (arg === "--skip-jira") {
    options.skipJira = true;
  }
}

console.log("");
console.log("=".repeat(60));
console.log("🧪 Newman Test Runner with Jira Integration");
console.log("=".repeat(60));
console.log("");

// Load Jira config
const jiraConfig = loadJiraConfig();

if (!options.skipJira && !jiraConfig.jiraToken) {
  console.warn("⚠️  WARNING: JIRA_API_TOKEN not set!");
  console.warn("   Set environment variable or create .jirarc file");
  console.warn("   Running tests only (no Jira integration)");
  console.log("");
  options.skipJira = true;
}

// Prepare Newman options
const newmanOptions = {
  collection: path.resolve(options.collection),
  reporters: ["cli"],
  reporter: {
    cli: {
      noFailures: false,
      noAssertions: false,
      noSuccessAssertions: true,
      noConsole: false,
      noBanner: true,
    },
  },
  bail: false,
  color: "on",
};

if (options.environment) {
  newmanOptions.environment = path.resolve(options.environment);
}

console.log("📋 Configuration:");
console.log(`   Collection: ${options.collection}`);
console.log(`   Environment: ${options.environment || "None"}`);
console.log(
  `   Jira Integration: ${options.skipJira ? "❌ Disabled" : "✅ Enabled"}`,
);
console.log("");
console.log("🚀 Running tests...");
console.log("");

// Run Newman
newman.run(newmanOptions, async function (err, summary) {
  console.log("");
  console.log("=".repeat(60));
  console.log("📊 Test Results");
  console.log("=".repeat(60));
  console.log("");

  if (err) {
    console.error("❌ Newman execution error:", err.message);
    process.exit(1);
  }

  const stats = summary.run.stats;
  const failures = summary.run.failures;

  console.log(`Total requests:   ${stats.requests.total}`);
  console.log(`Total tests:      ${stats.assertions.total}`);
  console.log(
    `Passed:           ${stats.assertions.total - stats.assertions.failed} ✅`,
  );
  console.log(`Failed:           ${stats.assertions.failed} ❌`);
  console.log(
    `Duration:         ${summary.run.timings.completed - summary.run.timings.started}ms`,
  );
  console.log("");

  // Group failures by request
  const failuresByRequest = new Map();

  if (failures && failures.length > 0) {
    console.log("❌ Failed Tests:");
    console.log("");

    failures.forEach((failure) => {
      const requestName = failure.source.name || "Unknown Request";
      const testName = failure.error.test || "Unknown Test";
      const errorMessage = failure.error.message || "Unknown Error";

      if (!failuresByRequest.has(requestName)) {
        failuresByRequest.set(requestName, {
          request: requestName,
          url: failure.source?.request?.url?.toString() || "N/A",
          method: failure.source?.request?.method || "N/A",
          tests: [],
        });
      }

      failuresByRequest.get(requestName).tests.push({
        name: testName,
        error: errorMessage,
      });

      console.log(`   • ${requestName}`);
      console.log(`     Test: ${testName}`);
      console.log(`     Error: ${errorMessage}`);
      console.log("");
    });

    // Jira Integration
    if (!options.skipJira) {
      console.log("=".repeat(60));
      console.log("🐛 Creating Jira Issues");
      console.log("=".repeat(60));
      console.log("");

      let successCount = 0;
      let errorCount = 0;

      for (const [requestName, data] of failuresByRequest) {
        const summary = `[BUG] ${requestName} — ${data.tests.length} test(s) failed`;
        const description = [
          `Request: ${requestName}`,
          `URL: ${data.url}`,
          `Method: ${data.method}`,
          "",
          "Failed tests:",
          ...data.tests.map((t) => `- ${t.name}\n  Error: ${t.error}`),
          "",
          "🤖 Auto-created by Newman Jira Runner",
        ].join("\n");

        try {
          console.log(`Creating issue for: ${requestName}...`);

          const result = await createJiraIssue(jiraConfig, {
            summary,
            description,
          });

          const issueKey = result.key;
          const issueUrl = `${jiraConfig.jiraUrl}/browse/${issueKey}`;

          console.log(`✅ Created: ${issueKey}`);
          console.log(`   URL: ${issueUrl}`);
          console.log("");

          successCount++;
        } catch (error) {
          console.error(`❌ Failed to create issue for ${requestName}:`);
          console.error(`   ${error.message}`);
          console.log("");
          errorCount++;
        }
      }

      console.log("=".repeat(60));
      console.log("📈 Jira Integration Summary");
      console.log("=".repeat(60));
      console.log("");
      console.log(`Created:  ${successCount} issue(s) ✅`);
      console.log(`Failed:   ${errorCount} issue(s) ❌`);
      console.log("");

      if (successCount > 0) {
        console.log(
          `🔗 View issues: ${jiraConfig.jiraUrl}/jira/software/projects/${jiraConfig.projectKey}/board`,
        );
        console.log("");
      }
    }
  } else {
    console.log("✅ All tests passed!");
    console.log("");
  }

  console.log("=".repeat(60));
  console.log("✅ Test Complete");
  console.log("=".repeat(60));
  console.log("");

  // Exit with appropriate code
  process.exit(stats.assertions.failed > 0 ? 1 : 0);
});
