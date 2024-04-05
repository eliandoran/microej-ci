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
    for (const [ level, logsByLevel ] of Object.entries(byLevel)) {
        summary.push(getHeaderForErrorLevel(level, logsByLevel.length));
        summary.push(listLogs(logsByLevel));
    }

    fs.writeFileSync(summaryFilePath, summary.flat().join("\n"));
}

function listLogs(logs) {
    const output = [];
    for (const log of logs) {
        output.push(`1. ${log.message}`);

        for (const file of log.files) {
            output.push(`\t- ${file}`);
        }
    }
    return output;
}

function getHeaderForErrorLevel(level, count) {
    switch (level) {
        case "error":
            return `## :x: ${count} ${formatPlural(count, "Error", "Errors")}`;
        case "warning":
            return `## :heavy_exclamation_mark: ${count} ${formatPlural(count, "Warning", "Warnings")}`;
        default:
            return `## ${level}`;
    }
}

function formatPlural(count, singular, plural) {
    return (count == 1 ? singular : plural);
}