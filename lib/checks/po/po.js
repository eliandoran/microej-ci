import glob from "fast-glob";
import path from "path";
import gettext from "gettext-parser";
import fs from "fs";

export default class PoChecker {

  constructor(context, config) {
    this.context = context;
    this.config = config;

    if (!config.filePattern) {
      throw "Missing configuration field: filePattern";
    }
  }

  startCheck() {
    const baseDir = this.context.baseDir;
    const poFilePattern = path.join(baseDir, this.config.filePattern);
    const poFilePaths = glob.sync(poFilePattern);
    
    for (const poFilePath of poFilePaths) {
      console.info(`Processing .po file: ${poFilePath}.`);
      this.processSingleTranslationFile(poFilePath);
    }
  }

  processSingleTranslationFile(poPath) {
    const poFileContent = fs.readFileSync(poPath).toString("utf8");
    const messages = gettext.po.parse(poFileContent);
    console.log(messages);
  }

}