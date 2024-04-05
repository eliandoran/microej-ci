import table from "table";
import { groupLogsByFile } from "./common.js";

export default class ConsoleTableLogFormatter {

  constructor(context) {
    this.context = context;
    this.numErrors = 0;
  }

  format(log) {
    this.numErrors = 0;

    const data = [];
    data.push([
      "#",
      "Level",
      "Message",
      "Source"
    ]);

    let index = 1;
    const groupedLogs = groupLogsByFile(log, this.context.baseDir);
    for (const entry of groupedLogs) {
      if (entry.level == "error") {
        this.numErrors++;
      }

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
    if (this.numErrors > 0) {
      process.exit(1);
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