const fs = require("fs");

const inputFile = "input/1.txt";

const logRegex = /^.*Z\s*(\[[^\t\n]*\])\s*(.*)$/;
const javadocRegex = /^(.*?):(\d+):\s*(.*?)[\s:-]\s*(.*)$/;

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
        if (!byType[type]) {
            byType[type] = [];
        }

        delete log.type;
        byType[type].push(log);
    }

    return byType;
}

const data = parseLogs(inputFile);

const logs = groupLogsByType([
    ...parseAntBuildFailures(data["[java]"]),
    ...parseJavadocErrors(data["[java] [microej.javadoc]"])
]);

fs.writeFileSync("debug-output.json", JSON.stringify(data, null, 4));
fs.writeFileSync("logs.json", JSON.stringify(logs, null, 4));