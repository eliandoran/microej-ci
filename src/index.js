import fs from "fs";
import PoChecker from "../lib/checks/po/po.js";
import Log from "../lib/log.js";
import ConsoleTableLogFormatter from "../lib/logFormatters/console-table.js";

function getConfiguration() {
  const configPath = "config.json";
  const fileContent = fs.readFileSync(configPath).toString("utf-8");
  return JSON.parse(fileContent);
}

function main() {
  const config = getConfiguration();
  const context = {
    baseDir: config.baseDir
  };

  const poCheckLog = new Log();
  const poCheck = new PoChecker({
    baseDir: config.baseDir,
    log: poCheckLog
  }, config.poCheck);

  poCheck.startCheck();

  const formatter = new ConsoleTableLogFormatter();
  formatter.format(poCheckLog);
}

main();