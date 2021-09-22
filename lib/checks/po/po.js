import glob from "fast-glob";
import path from "path";
import gettext from "gettext-parser";
import fs from "fs";

export default class PoChecker {

  constructor(context, config) {
    this.context = context;
    this.config = config;
    this.log = context.log;

    if (!context.log) {
      throw "Missing log in context.";
    }

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

    try {
      const messages = gettext.po.parse(poFileContent);
      console.log(messages);
    } catch (e) {
      if (e instanceof SyntaxError) {
        // Syntax errors are an issue of the .po file, and not a runtime errors.
        // As such, they must be reported to the user via the log.
        this.log.error("Unable to read .po file due to syntax errors.", {
          file: poPath,
          line: e.lineNumber
        });
        return;
      }

      throw e;
    }
  }

}