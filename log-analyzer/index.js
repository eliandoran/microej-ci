import fs from "fs";
import { parseAntBuildFailures, parseJavadocErrors } from "./parser.js";

const inputFile = 0;

const logRegex = /^.*Z\s*(\[[^\t\n]*\])\s*(.*)$/;

const LOG_ERRORS_ONLY = (process.env.LOG_ANALYZER_LOG_ERRORS_ONLY === "true" || true);
const FILE_REMOVE_PREFIX = (process.env.LOG_ANALYZER_FILE_REMOVE_PREFIX || "/__w/EMB-IHM_JAVA/EMB-IHM_JAVA/");

function parseLogs(inputFile) {
    const byCategory = {};

    const lines = fs.readFileSync(inputFile)
        .toString("utf-8")
        .split("\n");

    for (const line of lines) {
        const result = logRegex.exec(line);

        if (!result) {
            console.info("Skipped ", line);
            continue;
        }

        const category = result[1].replace(/\s+/, " ");
        const log = result[2];

        if (!log) continue;

        if (!byCategory[category]) {
            byCategory[category] = [];
        }

        byCategory[category].push(log);
    }

    return byCategory;
}

function groupLogsByType(logs) {
    const byType = {};

    for (const log of logs) {
        const type = log.type;

        if (LOG_ERRORS_ONLY && type !== "error") {
            console.info(`Skipped ${JSON.stringify(log)}`);
            continue;
        }

        if (!byType[type]) {
            byType[type] = [];
        }
        
        log.file = normalizeFilePath(log.file);
        delete log.type;
        byType[type].push(log);
    }

    return byType;
}

function normalizeFilePath(path) {
    const pos = path.indexOf(FILE_REMOVE_PREFIX);
    if (pos == 0) {
        path = path.substr(FILE_REMOVE_PREFIX.length);
    }

    return path;
}

const data = parseLogs(inputFile);

const logs = groupLogsByType([
    ...parseAntBuildFailures(data["[java]"]),
    ...parseJavadocErrors(data["[java] [microej.javadoc]"])
]);

fs.writeFileSync("debug-output.json", JSON.stringify(data, null, 4));
fs.writeFileSync("logs.json", JSON.stringify(logs, null, 4));