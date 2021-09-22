import path from "path";

export function parseTranslationDomain(poFilePath) {
  return path.parse(poFilePath).name;
}