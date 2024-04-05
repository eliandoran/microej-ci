import path from "path";

export function groupLogsByFile(log, baseDir) {
    const groupedData = {};
    for (const entry of log._log) {
        const { level, message } = entry;      
        const file = formatFileNameWithLine(entry, baseDir);

        if (!groupedData[message]) {
            groupedData[message] = {
                level,
                message,
                files: [ file ]
            }
        } else {
            groupedData[message].files.push(file);

            // Remove possible duplicates.
            if (groupedData[message].files.length > 1) {
                groupedData[message].files = Array.from(new Set(groupedData[message].files));
            }
        }
    }

    return Object.values(groupedData);
}

function formatFileNameWithLine(logEntry, baseDir) {
    if (!logEntry.file) {
        return "";
    }

    if (!baseDir) {
        return logEntry.file;
    }

    const relPath = path.relative(baseDir, logEntry.file);

    if (logEntry.line) {
        return `${relPath}:${logEntry.line}`; 
    } else {
        return `${relPath}`;
    }
}