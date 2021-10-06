import table from "table";
import path from "path";

export default class ConsoleTableLogFormatter {

  constructor(context) {
    this.context = context;
  }

  format(log) {
    const data = [];
    data.push([
      "#",
      "Level",
      "Message",
      "Source"
    ]);

    let index = 1;
    for (const entry of log._log) {
      data.push([
        index++,
        formatLogLevel(entry.level),
        entry.message,
        this._formatFileNameWithLine(entry)
      ]);
    }

    const output = table.table(data, {
      drawHorizontalLine: (lineIndex, rowCount) => {
        return (lineIndex < 2 || lineIndex > rowCount - 1);
      }
    });
    console.log(output);
  }

  beforeExit() {
    // No action needed.
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

function formatLogLevel(level) {
  switch (level) {
    case "error":
      return "ERR"
    case "info":
      return "INFO"
    case "warning":
      return "WARN";
    default:
      return level;
  }
}