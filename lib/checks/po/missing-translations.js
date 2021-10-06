import { parseTranslationDomain } from "./utils.js";

export default function checkForMissingTranslations(context) {
  const domainMsgids = groupMsgidsByDomain(context);
  
  for (const domain of Object.keys(domainMsgids)) {
    for (const poFile of context.poFiles) {
      const poDomain = parseTranslationDomain(poFile.path);
      if (poDomain !== domain) {
        continue;
      }

      for (const msgid of domainMsgids[domain]) {
        if (!poFile.messages[msgid]) {
          context.log.log(context.logLevel, `${domain}@${poFile.languageCode}: Missing translation with msgid "${msgid}".`, {
            file: poFile.path
          });
        }
      }
    }
  }
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
