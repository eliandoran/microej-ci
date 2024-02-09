const fs = require("fs");

const inputFile = "input/1.txt";

const logRegex = /^.*Z\s*(\[.*\])\s*(.*)$/;
const lines = fs.readFileSync(inputFile)
    .toString("utf-8")
    .split("\n")
    .map((line) => {
        const result = logRegex.exec(line);
        if (!result) {
            console.info("Skipped ", line);
            return null;
        }

        return {
            category: result[1],
            log: result[2]
        };
    })
    .filter((e) => e !== null);

const output = fs.writeFileSync("output.json", JSON.stringify(lines, null, 4));