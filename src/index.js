import fs from "fs";
import PoChecker from "../lib/checks/po/po.js";

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

  const poCheck = new PoChecker(context, config.poCheck);
  poCheck.startCheck();
}

main();