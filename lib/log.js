export default class Log {

  constructor() {
    this._log = [];
  }

  log(level, message, data) {
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