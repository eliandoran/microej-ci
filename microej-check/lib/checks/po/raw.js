import { formatArrayAsBulletedList, parseTranslationDomain } from "./utils.js";

export default function checkForStructuralIssues(context) {
    const msgids = {};
    const duplicateMsgids = [];
    const msgidRegex = /^msgid\s*\"(.*)\"\s*$/gm;
    const poFile = context.poFileContents;
    const poPath = context.poFilePath;
    const poDomain = parseTranslationDomain(poPath);
    const languageCode = /^\"Language:\s*(\w*_\w*)/gm.exec(poFile)[1];

    let msgidMatch;

    do {
        msgidMatch = msgidRegex.exec(poFile);

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
        context.log.log(context.logLevel, `${poDomain}@${languageCode}: Duplicate msgids:\n${formatArrayAsBulletedList(duplicateMsgids)}`, {
            file: poPath
        });
    }

}