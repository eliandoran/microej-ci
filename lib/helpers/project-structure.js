import glob from "fast-glob";
import path from "path";
import fs from "fs";
import { XMLParser } from "fast-xml-parser";

export default function getProjectStructure(context, config) {
    const baseDir = context.baseDir;
    const filePattern = "**/module.ivy";
    const moduleIvyPattern = path.join(baseDir, filePattern);
    const moduleIvyPaths = glob.sync(moduleIvyPattern);

    for (const ivyModulePath of moduleIvyPaths) {
        const module = parseIvyModule(ivyModulePath);
        console.log(module);
    }
}

function parseIvyModule(ivyModulePath) {
    const ivyModuleContent = fs.readFileSync(ivyModulePath).toString("utf8");
    const parser = new XMLParser({
        ignoreAttributes: false
    });
    const ivyModuleEl = parser.parse(ivyModuleContent)["ivy-module"];

    const organisation = ivyModuleEl.info["@_organisation"];
    const module = ivyModuleEl.info["@_module"];

    return {
        organisation,
        module
    };
}