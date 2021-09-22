import table from "table";
import path from "path";

export default class ConsoleTableLogFormatter {

  constructor(context) {
    this.context = context;
  }

  format(log) {
    const data = [];
    data.push([
      "Level",
      "Message",
      "Source"
    ]);

    for (const entry of log._log) {
      data.push([
        entry.level,
        entry.message,
        this._formatFileNameWithLine(entry)
      ]);
    }

    const output = table.table(data);
    console.log(output);
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

}