---
description: How to manage Jira issues via MCP in this project
---

1. To list issues for this project:
   - Run `mcp_jira-mcp_getIssuesByJQL` with `jql: "project = 'KIEM' AND status != Done"`.
2. To create a new issue:
   - Run `mcp_jira-mcp_createIssue` with the following parameters:
     - `projectKey`: `KIEM`
     - `summary`: [User provided summary]
     - `description`: [User provided description]
     - `issueType`: `Task` (default)
3. To view the board:
   - Use `mcp_jira-mcp_getBoards` to find board ID 2.
