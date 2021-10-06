export default function checkForStructuralIssues(context) {
    const msgids = {};
    const msgidRegex = /^msgid\s*\"(.*)\"\s*$/gm;

    let msgidMatch;

    do {
        msgidMatch = msgidRegex.exec(context.poFileContents);

        if (msgidMatch) {
            const msgid = msgidMatch[1];

            if (!msgids[msgid]) {
                msgids[msgid] = true;
            } else {
                // Found duplicate key, raise an error.
                context.log.log(context.logLevel, `Duplicate msgid: ${msgid}`, {
                    file: context.poFilePath
                });
            }
        }
    } while (msgidMatch);

}