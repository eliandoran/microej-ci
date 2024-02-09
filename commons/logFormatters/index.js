import ConsoleTableLogFormatter from "./console-table.js";
import GitHubWorkflowFormatter from "./github-workflow.js";

export default function getFormatter(context) {
    // If running under GitHub Actions, use the corresponding format.
    if (process.env["GITHUB_RUN_ID"]) {
        return new GitHubWorkflowFormatter(context);
    }

    // Otherwise, use the more friendlier console version.
    return new ConsoleTableLogFormatter(context);
}