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
    const groupedLogs = this._groupData(log);
    for (const entry of groupedLogs) {
      data.push([
        index++,
        formatLogLevel(entry.level),
        entry.message,
        entry.files.join("\n")
      ]);
    }

    const output = table.table(data);
    console.log(output);
  }

  beforeExit() {
    // No action needed.
  }

  _groupData(log) {
    const groupedData = {};
    for (const entry of log._log) {
      const { level, message } = entry;      
      const file = this._formatFileNameWithLine(entry);

      if (!groupedData[message]) {
        groupedData[message] = {
          level,
          message,
          files: [ file ]
        }
      } else {
        groupedData[message].files.push(file);

        // Remove possible duplicates.
        if (groupedData[message].files.length > 1) {
          groupedData[message].files = Array.from(new Set(groupedData[message].files));
        }
      }
    }

    return Object.values(groupedData);
  }

  _formatFileNameWithLine(logEntry) {
    const baseDir = this.context.baseDir;

    if (!logEntry.file) {
      return "";
    }

    if (!baseDir) {
      return logEntry.file;
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