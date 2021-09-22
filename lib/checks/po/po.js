import glob from "fast-glob";
import path from "path";

export default class PoChecker {

  constructor(context) {
    this.context = context;
  }

  startCheck() {
    const baseDir = this.context.baseDir;
    const poFilePattern = path.join(baseDir, "**", "*.po");
    const poFilePaths = glob.sync(poFilePattern);
    console.log(poFilePaths);
  }

}