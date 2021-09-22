import glob from "fast-glob";
import path from "path";

export default class PoChecker {

  constructor(context, config) {
    this.context = context;
    this.config = config;
  }

  startCheck() {
    const baseDir = this.context.baseDir;
    const poFilePattern = path.join(baseDir, this.config.filePattern);
    const poFilePaths = glob.sync(poFilePattern);
    
    for (const poFilePath of poFilePaths) {
      console.info(`Found .po file: ${poFilePath}.`);
    }
  }

}