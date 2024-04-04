export default class Log {

  constructor(logLevels, warningsAsErrors) {
    this._log = [];
    this._logLevels = logLevels;
    this.warningsAsErrors = warningsAsErrors;
  }

  log(level, message, data) {
    if (this.warningsAsErrors && level === "warning") {
      level = "error";
    }

    if (this._logLevels && !this._logLevels.includes(level)) {
      return;
    }

    this._log.push({
      level,
      message,
      ...data
    });
  }

  error(message, data) {
    this.log("error", message, data);
  }

  warn(message, data) {
    this.log("warning", message, data);
  }

}