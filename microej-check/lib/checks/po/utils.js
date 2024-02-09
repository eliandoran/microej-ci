import path from "path";

export function parseTranslationDomain(poFilePath) {
  return path.parse(poFilePath).name;
}

export function formatArrayAsBulletedList(list) {
  return list.map((line) => ` - ${line}`).join("\n");
}