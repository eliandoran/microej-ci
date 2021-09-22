import { parseTranslationDomain } from "./utils.js";

export default function checkForMissingTranslations(context) {
  const domainMsgids = groupMsgidsByDomain(context);
  console.log(domainMsgids);
}

function groupMsgidsByDomain(context) {
  const domainMsgids = {};

  for (const poFile of context.poFiles) {
    const path = poFile.path;
    const translationDomain = parseTranslationDomain(path);
    
    if (!domainMsgids[translationDomain]) {
      domainMsgids[translationDomain] = new Set();
    }

    const msgids = domainMsgids[translationDomain];
    for (const msgid of Object.keys(poFile.messages)) {
      msgids.add(msgid);
    }
  }

  return domainMsgids;
}
