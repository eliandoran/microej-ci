const fs = require("fs");

const inputFile = "input/1.txt";

const logRegex = /^.*Z\s*(\[[^\t\n]*\])\s*(.*)$/;
const javadocRegex = /^(.*?):(\d+):\s*(.*):\s*(.*)$$/;

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

function groupLogsByType(logs) {
    const byType = {};

    for (const log of logs) {
        const type = log.type;
        if (!byType[type]) {
            byType[type] = [];
        }

        delete log.type;
        byType[type].push(log);
    }

    return byType;
}

const data = parseLogs(inputFile);
const logs = groupLogsByType(parseJavadocErrors(data["[java] [microej.javadoc]"]));

fs.writeFileSync("debug-output.json", JSON.stringify(data, null, 4));
fs.writeFileSync("logs.json", JSON.stringify(logs, null, 4));