import glob from "fast-glob";
import path from "path";
import gettext from "gettext-parser";
import fs from "fs";
import checkForMissingTranslations from "./missing-translations.js";
import checkForStructuralIssues from "./raw.js";

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
      const parsedPoFile = this.processSingleTranslationFile(poFilePath);
      if (parsedPoFile) {
        this.poFiles.push(parsedPoFile);
      }
    }

    checkForMissingTranslations({
      poFiles: this.poFiles,
      log: this.log,
      logLevel: this.config.missingTranslationLogLevel || "warning"
    });
  }

  processSingleTranslationFile(poPath) {
    const poFileContent = fs.readFileSync(poPath).toString("utf8");

    checkForStructuralIssues({
      poFilePath: poPath,
      poFileContents: poFileContent,
      log: this.log,
      logLevel: this.config.missingTranslationLogLevel || "warning"
    });

    try {
      const poFile = gettext.po.parse(poFileContent);
      const messages = {};
      const rawMessages = poFile.translations[''];
      const languageCode = poFile.headers.Language;

      for (const msgid of Object.keys(rawMessages)) {
        const rawMessage = rawMessages[msgid];
        messages[msgid] = {
          msgstr: rawMessage.msgstr[0],
          comments: rawMessage.comments?.translator
        };
      }

      return {
        path: poPath,
        messages,
        languageCode
      };
    } catch (e) {
      if (e instanceof SyntaxError) {
        // Syntax errors are an issue of the .po file, and not a runtime errors.
        // As such, they must be reported to the user via the log.
        this.log.error(e.message, {
          file: poPath,
          line: e.lineNumber
        });
        return;
      }

      throw e;
    }
  }

}