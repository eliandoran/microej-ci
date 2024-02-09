const fs = require("fs");

const inputFile = "input/1.txt";

const logRegex = /^.*Z\s*(\[.*\])\s*(.*)$/;

function parseLogs(inputFile) {
    const lines = fs.readFileSync(inputFile)
        .toString("utf-8")
        .split("\n")
        .map((line) => {
            const result = logRegex.exec(line);

            if (!result) {
                console.info("Skipped ", line);
                return null;
            }

            const [ _, category, log ] = Array.from(result);
            if (!log) {
                return null;
            }

            return {
                category,
                log
            };
        })
        .filter((e) => e !== null);    
    return lines;
}


const output = parseLogs(inputFile);
fs.writeFileSync("output.json", JSON.stringify(output, null, 4));