import table from "table";

export default class ConsoleTableLogFormatter {
  format(log) {
    const data = [];
    data.push([
      "Level",
      "File",
      "Message"
    ]);

    for (const entry of log._log) {
      data.push([
        entry.level,
        formatFileNameWithLine(entry),
        entry.message
      ]);
    }

    const output = table.table(data);
    console.log(output);
  }
}

function formatFileNameWithLine(logEntry) {
  if (!logEntry.file) {
    return "";
  }

  if (logEntry.line) {
    return `${logEntry.file}:${logEntry.line}`; 
  } else {
    return `${logEntry.file}`;
  }
}