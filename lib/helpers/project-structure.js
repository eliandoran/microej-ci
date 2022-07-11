import glob from "fast-glob";
import path from "path";
import fs from "fs";
import { XMLParser } from "fast-xml-parser";

export default function getProjectStructure(baseDir) {
    const filePattern = "**/module.ivy";
    const moduleIvyPattern = path.join(baseDir, filePattern);
    const moduleIvyPaths = glob.sync(moduleIvyPattern);

    const allModules = [];
    for (const ivyModulePath of moduleIvyPaths) {
        allModules.push(parseIvyModule(ivyModulePath));
    }

    const groupedModules = groupModulesByOrganisation(allModules);    
    return {
        allModules,
        groupedModules
    };
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
    const ivyModuleContent = fs.readFileSync(ivyModulePath).toString("utf8");
    const parser = new XMLParser({
        ignoreAttributes: false
    });
    const ivyModuleEl = parser.parse(ivyModuleContent)["ivy-module"];

    // Parse name and organisation.
    const organisation = ivyModuleEl.info["@_organisation"];
    const name = ivyModuleEl.info["@_module"];

    // Parse dependencies.
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

    // Parse resources.
    const baseDir = path.dirname(ivyModulePath);

    return {
        organisation,
        name,
        dependencies,
        baseDir
    };
}

function parseDependency(dependency) {
    return {
        org: dependency["@_org"],
        name: dependency["@_name"],
        rev: dependency["@_rev"]
    };
}