import fs from "fs";
import { groupLogsByFile } from "./common.js";

export function generateSummary(log, context) {
    const summaryFilePath = process.env["GITHUB_STEP_SUMMARY"];
    if (!summaryFilePath) {
        return;
    }

    const summary = [];
    const groupedLogs = groupLogsByFile(log, context.baseDir);

    // Further group the logs by level.
    const byLevel = {};
    for (const log of groupedLogs) {
        if (!byLevel[log.level]) {
            byLevel[log.level] = [];
        }

        byLevel[log.level].push(log);
    }

    fs.writeFileSync(summaryFilePath, summary.join("\n"));
}