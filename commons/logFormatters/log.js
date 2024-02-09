export default class Log {

  constructor(logLevels) {
    this._log = [];
    this._logLevels = logLevels;
  }

  log(level, message, data) {
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