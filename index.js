const fs = require("fs");

const inputFile = "input/1.txt";

const logRegex = /^.*Z\s*(\[[^\t\n]*\])\s*(.*)$/;

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

const output = parseLogs(inputFile);
fs.writeFileSync("debug-output.json", JSON.stringify(output, null, 4));