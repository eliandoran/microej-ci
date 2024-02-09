const javadocRegex = /^(.*?):(\d+):\s*(.*?)[\s:-]\s*(.*)$/;

export function parseJavadocErrors(log, data) {
    if (!data) return [];
    
    const result = [];

    for (const logLine of data) {
        const match = javadocRegex.exec(logLine);
        if (!match) {
            continue;
        }

        const [ _, file, line, level, message ] = Array.from(match);
        log.log(level, message, {
            file,
            line
        });
    }

    return result;
}

export function parseAntBuildFailures(log, data) {
    if (!data) return [];

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
        log.error(textLines.join("\n"), {
            project: `${failedModuleChain.join("->")}`
        });
    }
}