const javadocRegex = /^(.*?):(\d+):\s*(.*?)[\s:-]\s*(.*)$/;

export function parseJavadocErrors(data) {
    if (!data) return [];
    
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

export function parseAntBuildFailures(data) {
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