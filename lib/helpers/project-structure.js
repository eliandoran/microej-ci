import glob from "fast-glob";
import path from "path";
import fs from "fs";
import { XMLParser } from "fast-xml-parser";

export default function getProjectStructure(context, config) {
    const baseDir = context.baseDir;
    const filePattern = "**/module.ivy";
    const moduleIvyPattern = path.join(baseDir, filePattern);
    const moduleIvyPaths = glob.sync(moduleIvyPattern);

    const modules = [];
    for (const ivyModulePath of moduleIvyPaths) {
        modules.push(parseIvyModule(ivyModulePath));
    }

    const result = groupModulesByOrganisation(modules);
    console.log(result);
}

function groupModulesByOrganisation(allModules) {
    const result = {};
    for (const module of allModules) {        
        const org = module.organisation;
        if (result[org] === undefined) {
            result[org] = {};
        }
        result[org][module.name] = module;
    }

    return result;
}

function parseIvyModule(ivyModulePath) {
    console.log("File: ", ivyModulePath);

    const ivyModuleContent = fs.readFileSync(ivyModulePath).toString("utf8");
    const parser = new XMLParser({
        ignoreAttributes: false
    });
    const ivyModuleEl = parser.parse(ivyModuleContent)["ivy-module"];

    const organisation = ivyModuleEl.info["@_organisation"];
    const name = ivyModuleEl.info["@_module"];

    const dependenciesEl = ivyModuleEl.dependencies;
    const dependencies = [];

    if (dependenciesEl !== undefined) {
        if (dependenciesEl.dependency.length > 0) {
            for (const dependency of dependenciesEl.dependency) {
                dependencies.push(parseDependency(dependency));
            }
        } else {
            // For modules with just one dependency.
            dependencies.push(parseDependency(dependenciesEl.dependency));
        }
    }

    return {
        organisation,
        name,
        dependencies
    };
}

function parseDependency(dependency) {
    return {
        org: dependency["@_org"],
        name: dependency["@_name"],
        rev: dependency["@_rev"]
    };
}