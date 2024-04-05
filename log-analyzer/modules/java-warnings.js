/*
 * Checks for "WARNING IN" in logs and parses them, with the possibility
 * of raising them as errors if desired.
 */

const warningRegex = /^\d+\. (WARNING) in (.*?)\s+\(at line (\d+)\)/;

export function processJavaWarnings(log, allLogs) {
    
    for (let i=0; i<allLogs.length; i++) {
        const line = allLogs[i];
        const match = warningRegex.exec(line);
        if (!match) continue;


        // The first line of the warning contains most information.
        const [ _, level, file, lineNumber ] = match;

        // The actual message is in the last line before ----------.
        const lastLineIndex = allLogs.indexOf("----------", i);
        if (lastLineIndex === -1) continue;
        const message = allLogs[lastLineIndex - 1];

        if (!message) continue;

        // Log the warning.
        log.log("warning", message, {
            file,
            line: lineNumber
        });
    }
}