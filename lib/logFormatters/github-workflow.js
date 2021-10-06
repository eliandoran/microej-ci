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
      const message = entry.message;
      console.log(`::${logLevel} file=${file}::${message}`)

      if (logLevel === "error") {
        this.numErrors++;
      }
    }
  }

  beforeExit() {
    if (this.numErrors > 0) {
      process.exit(-this.numErrors);
    }
  }

}
