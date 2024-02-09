const fs = require("fs");

const inputFile = "input/1.txt";

const logRegex = /^.*Z\s*(\[[^\t\n]*\])\s*(.*)$/;
const javadocRegex = /^(.*?):(\d+):\s*(.*?)[\s:-]\s*(.*)$/;

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

function parseJavadocErrors(data) {
    const result = [];

    for (const log of data) {
        const match = javadocRegex.exec(log);
        if (!match) {
            continue;
        }

        result.push({
            file: match[1],
            line: match[2],
            type: match[3],
            text: match[4]
        });
    }

    return result;
}

function parseAntBuildFailures(data) {
    const failedModuleChain = [];
    const textLines = [];

    for (let i=0; i<data.length; i++) {
        if (data[i] === "======================================================================" && i+1<data.length) {
            const moduleMessage = data[i+1];
            if (moduleMessage.startsWith("Exiting failing project")) {
                failedModuleChain.push(data[i+1]);
            }
            i+=2;   // skip the text (added at previous step)
            continue;
        }

        if (failedModuleChain.length == 0) {
            continue;
        }

        if (data[i].startsWith("Total time:")) {
            break;
        }

        textLines.push(data[i]);
    }

    if (textLines.length > 0) {
        return [
            {
                file: `Module: ${failedModuleChain.join("->")}`,
                type: "error",
                text: textLines.join("\n")
            }
        ];
    } else {
        return [];
    }
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