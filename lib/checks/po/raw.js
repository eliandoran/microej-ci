import { formatArrayAsBulletedList } from "./utils.js";

export default function checkForStructuralIssues(context) {
    const msgids = {};
    const duplicateMsgids = [];
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
                duplicateMsgids.push(msgid);
            }
        }
    } while (msgidMatch);

    if (duplicateMsgids.length > 0) {
        context.log.log(context.logLevel, `Duplicate msgids:\n${formatArrayAsBulletedList(duplicateMsgids)}`, {
            file: context.poFilePath
        });
    }

}