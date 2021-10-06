import { formatArrayAsBulletedList, parseTranslationDomain } from "./utils.js";

export default function checkForMissingTranslations(context) {
  const domainMsgids = groupMsgidsByDomain(context);
  
  for (const domain of Object.keys(domainMsgids)) {
    for (const poFile of context.poFiles) {
      let missingTranslations = [];

      const poDomain = parseTranslationDomain(poFile.path);
      if (poDomain !== domain) {
        continue;
      }

      for (const msgid of domainMsgids[domain]) {
        if (!poFile.messages[msgid]) {
          missingTranslations.push(msgid);  
        }
      }

      if (missingTranslations.length > 0) {
        context.log.log(context.logLevel, `${domain}@${poFile.languageCode}: Missing translations with msgids:\n${formatArrayAsBulletedList(missingTranslations)}`, {
          file: poFile.path
        });
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
