import glob from "fast-glob";
import path from "path";
import gettext from "gettext-parser";
import fs from "fs";
import checkForMissingTranslations from "./missing-translations.js";

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
    this.poFiles = [];

    const baseDir = this.context.baseDir;
    const poFilePattern = path.join(baseDir, this.config.filePattern);
    const poFilePaths = glob.sync(poFilePattern);
    
    for (const poFilePath of poFilePaths) {
      console.info(`Processing .po file: ${poFilePath}.`);
      const parsedPoFiles = this.processSingleTranslationFile(poFilePath);
      this.poFiles.push(parsedPoFiles);
    }

    checkForMissingTranslations({
      poFiles: this.poFiles
    });
  }

  processSingleTranslationFile(poPath) {
    const poFileContent = fs.readFileSync(poPath).toString("utf8");

    try {
      const poFile = gettext.po.parse(poFileContent);
      const messages = {};
      const rawMessages = poFile.translations[''];

      for (const msgid of Object.keys(rawMessages)) {
        const rawMessage = rawMessages[msgid];
        messages[msgid] = {
          msgstr: rawMessage.msgstr[0],
          comments: rawMessage.comments?.translator
        };
      }

      return {
        path: poPath,
        messages
      };
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