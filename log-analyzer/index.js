import fs from "fs";
import { parseAntBuildFailures, parseJavadocErrors, parseSoarBuildErrors } from "./parser.js";

const inputFile = 0;

const logRegex = /^.*?(\[[^\t\n]*\])\s*(.*)$/;
const timestampRegex = /^\d{4}-\d{2}-\d{2}/;

const LOG_ERRORS_ONLY = getBooleanEnv("LOG_ANALYZER_LOG_ERRORS_ONLY", true);
const TREAT_WARNINGS_AS_ERRORS = getBooleanEnv("LOG_ANALYZER_WARNINGS_AS_ERRORS", false);
const BASE_DIR = getStringEnv("LOG_ANALYZER_BASE_DIR", "/__w/EMB-IHM_JAVA/EMB-IHM_JAVA/");

function getStringEnv(name, defaultValue) {
    const value = process.env[name];

    if (process.env[name]) {
        return process.env[name];
    }

    return defaultValue;
}

function getBooleanEnv(name, defaultValue) {
    const value = getStringEnv(name, defaultValue);
    return (value && value.toLowerCase() === "true");
}

import Log from "../commons/logFormatters/log.js";
import getFormatter from "../commons/logFormatters/index.js";
import { processJavaWarnings } from "./modules/java-warnings.js";

function parseLogs(inputFile) {
    const byCategory = {};

    const lines = fs.readFileSync(inputFile)
        .toString("utf-8")
        .split("\n");

    for (let line of lines) {
        // Remove timestamp from the logs if present.
        if (timestampRegex.exec(line)) {
            line = line.substring(line.indexOf(" ") + 1);
        }

        const result = logRegex.exec(line);

        let category;
        let log;
        if (result) {
            category = result[1]
            .replace(/\s+/g, " ")
            // we remove [java] tag since it's added only on older versions of MicroEJ
            .replace(/^[java]/g, "");
            log = result[2];
        } else {
            category = "";
            log = line;
        }

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
    const log = new Log(logLevel, TREAT_WARNINGS_AS_ERRORS);

    processJavaWarnings(log, data[""]);

    fs.writeFileSync("debug-output.json", JSON.stringify(data, null, 4));

    // Format and display the output.
    const formatter = getFormatter({
        baseDir: BASE_DIR
    });
    formatter.format(log);
    formatter.beforeExit();
}

main();