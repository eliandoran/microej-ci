import fs from "fs";
import { parseAntBuildFailures, parseJavadocErrors, parseSoarBuildErrors } from "./parser.js";

const inputFile = 0;

const logRegex = /^.*?(\[[^\t\n]*\])\s*(.*)$/;

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

        const category = result[1]
            .replace(/\s+/g, " ")
            // we remove [java] tag since it's added only on older versions of MicroEJ
            .replace(/^[java]/g, "");
        const log = result[2];

        if (!log) continue;

        if (!byCategory[category]) {
            byCategory[category] = [];
        }

        byCategory[category].push(log);

        // Special treatment, for multiple categories append them to the base category as well.
        const categoryComponents = category.match(/\[\w+\]/g);
        if (categoryComponents && categoryComponents.length > 1) {
            const firstCategory = categoryComponents[0];
            if (!byCategory[firstCategory]) byCategory[firstCategory] = [];
            byCategory[firstCategory].push(log);
        }
    }

    return byCategory;
}

function main() {
    const data = parseLogs(inputFile);

    const logLevel = (LOG_ERRORS_ONLY ? [ "error" ] : undefined);
    const log = new Log(logLevel);

    parseAntBuildFailures(log, data[""]);
    parseSoarBuildErrors(log, data[""]);
    parseJavadocErrors(log, data["[microej.javadoc]"]);

    fs.writeFileSync("debug-output.json", JSON.stringify(data, null, 4));

    // Format and display the output.
    const formatter = getFormatter({
        baseDir: BASE_DIR
    });
    formatter.format(log);
    formatter.beforeExit();
}

main();