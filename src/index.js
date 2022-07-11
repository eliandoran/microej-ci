import process from "process";
import fs from "fs";
import path from "path";
import PoChecker from "../lib/checks/po/po.js";
import Log from "../lib/log.js";
import ConsoleTableLogFormatter from "../lib/logFormatters/console-table.js";
import GitHubWorkflowFormatter from "../lib/logFormatters/github-workflow.js";
import getProjectStructure from "../lib/helpers/project-structure.js";

function getConfiguration(baseDir, configPath) {
  const fileContent = fs.readFileSync(configPath).toString("utf-8");
  const config = JSON.parse(fileContent);
  config.baseDir = baseDir;
  return config; 
}

function showUsage() {
  console.info("MicroEJ Checker");
  console.info(`Usage: ${process.argv[0]} ${process.argv[1]} project_directory [config_file]`);
}

function getFormatter(context) {
  // If running under GitHub Actions, use the corresponding format.
  if (process.env["GITHUB_RUN_ID"]) {
    return new GitHubWorkflowFormatter(context);
  }

  // Otherwise, use the more friendlier console version.
  return new ConsoleTableLogFormatter(context);
}

function main() {
  // Check command line arguments.
  if (process.argv.length < 3 || process.argv.length > 4) {
    showUsage();
    return;
  }

  // Determine configuration file path.
  const baseDir = process.argv[2];  
  let configPath = ".microej_check";

  if (process.argv.length == 4) {
    configPath = process.argv[3];
  }

  configPath = path.resolve(baseDir, configPath);
  console.log(`Using configuration file: ${configPath}`);

  // Try reading the configuration file.  
  let config;
  try {
    config = getConfiguration(baseDir, configPath);
  } catch (e) {
    console.log(`Unable to load configuration file: ${e.message}`);
    return;
  }

  // Start the checkers.
  const context = {
    baseDir: config.baseDir
  };

  const poCheckLog = new Log();
  /*const poCheck = new PoChecker({
    baseDir: config.baseDir,
    log: poCheckLog
  }, config.poCheck);

  poCheck.startCheck();*/

  getProjectStructure({
    baseDir: config.baseDir,
    log: poCheckLog
  });

  // Format and display the output.
  const formatter = getFormatter(context);
  formatter.format(poCheckLog);
  formatter.beforeExit();
}

main();