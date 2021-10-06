import process from "process";
import fs from "fs";
import path from "path";
import PoChecker from "../lib/checks/po/po.js";
import Log from "../lib/log.js";
import ConsoleTableLogFormatter from "../lib/logFormatters/console-table.js";

function getConfiguration(baseDir) {
  const configPath = path.join(baseDir, ".microej_check");
  const fileContent = fs.readFileSync(configPath).toString("utf-8");
  const config = JSON.parse(fileContent);
  config.baseDir = baseDir;
  return config; 
}

function showUsage() {
  console.info("MicroEJ Checker");
  console.info(`Usage: ${process.argv[0]} ${process.argv[1]} project_directory`);
}

function main() {
  // Check command line arguments.
  if (process.argv.length !== 3) {
    showUsage();
    return;
  }

  // Try reading the configuration file.
  const baseDir = process.argv[2];
  let config;
  try {
    config = getConfiguration(baseDir)
  } catch (e) {
    console.log(`Unable to load configuration file: ${e.message}`);
    return;
  }

  // Start the checkers.
  const context = {
    baseDir: config.baseDir
  };

  const poCheckLog = new Log();
  const poCheck = new PoChecker({
    baseDir: config.baseDir,
    log: poCheckLog
  }, config.poCheck);

  poCheck.startCheck();

  // Format and display the output.
  const formatter = new ConsoleTableLogFormatter(context);
  formatter.format(poCheckLog);
}

main();