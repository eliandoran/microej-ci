import fs from "fs";
import { parseAntBuildFailures, parseJavadocErrors } from "./parser.js";

const inputFile = 0;

const logRegex = /^.*Z\s*(\[[^\t\n]*\])\s*(.*)$/;

const LOG_ERRORS_ONLY = (process.env.LOG_ANALYZER_LOG_ERRORS_ONLY === "true" || true);
const BASE_DIR = (process.env.LOG_ANALYZER_BASE_DIR || "/__w/EMB-IHM_JAVA/EMB-IHM_JAVA/");

import Log from "../commons/logFormatters/log.js";
import getFormatter from "../commons/logFormatters/index.js";

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

function main() {
    const data = parseLogs(inputFile);

    const log = new Log();

    parseAntBuildFailures(log, data["[java]"]),
    parseJavadocErrors(log, data["[java] [microej.javadoc]"])

    fs.writeFileSync("debug-output.json", JSON.stringify(data, null, 4));

    // Format and display the output.
    const formatter = getFormatter({
        baseDir: BASE_DIR
    });
    formatter.format(log);
    formatter.beforeExit();
}

main();