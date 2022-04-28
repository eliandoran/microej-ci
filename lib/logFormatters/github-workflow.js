import path from "path";

const LOG_LEVEL_MAPPINGS = {
  "error": "error",
  "warning": "warning",
  "info": "notice"
};

export default class GitHubWorkflowFormatter {

  constructor(context) {
    this.context = context;
    this.numErrors = 0;
  }

  format(log) {
    this.numErrors = 0;

    for (const entry of log._log) {
      const logLevel = LOG_LEVEL_MAPPINGS[entry.level] || LOG_LEVEL_MAPPINGS["info"];
      const file = entry.file;
      
      const messageFile = this._formatFileNameWithLine(entry);
      let message = `${messageFile}: ${entry.message}`;
      message = message.replace(/\n/g, "%0A");  // Handle newlines in GitHub Actions  
      console.log(`::${logLevel} file=${file}::${message}`);

      if (logLevel === "error") {
        this.numErrors++;
      }
    }
  }

  _formatFileNameWithLine(logEntry) {
    const baseDir = this.context.baseDir;

    if (!logEntry.file) {
      return "";
    }

    const relPath = path.relative(baseDir, logEntry.file);
  
    if (logEntry.line) {
      return `${relPath}:${logEntry.line}`; 
    } else {
      return `${relPath}`;
    }
  }

  beforeExit() {
    if (this.numErrors > 0) {
      process.exit(-this.numErrors);
    }
  }

}
