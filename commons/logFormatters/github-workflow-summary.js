import fs from "fs";
import { groupLogsByFile } from "./common.js";

export function generateSummary(log, context) {
    const summaryFilePath = process.env["GITHUB_STEP_SUMMARY"];
    if (!summaryFilePath) {
        return;
    }

    const groupedLogs = groupLogsByFile(log, context.baseDir);

    // Further group the logs by level.
    const byLevel = {};
    for (const log of groupedLogs) {
        if (!byLevel[log.level]) {
            byLevel[log.level] = [];
        }

        byLevel[log.level].push(log);
    }

    let summary = [];
    for (const logsByLevel of Object.values(byLevel)) {
        summary.push(listLogs(logsByLevel));
    }

    fs.writeFileSync(summaryFilePath, summary.flat().join("\n"));
}

function listLogs(logs) {
    const output = [];
    for (const log of logs) {
        output.push(` - ${log.message}`);
    }
    return output;
}