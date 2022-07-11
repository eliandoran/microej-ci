import glob from "fast-glob";
import path from "path";
import fs from "fs";
import getProjectStructure from "./project-structure.js";

export default function parseProjects(context, config) {
    const baseDir = context.baseDir;
    const projectStructure = getProjectStructure(baseDir);

    for (const module of projectStructure.allModules) {
        module.resources = getResourceLists(module);
    }

    return projectStructure;
}

function getResourceLists(module) {
    const filePattern = "src/main/resources/**/*.list";
    const listPattern = path.join(module.baseDir, filePattern);
    const listPaths = glob.sync(listPattern);

    const lists = {};
    for (const listPath of listPaths) {
        const domain = getListDomain(listPath);
        if (lists[domain] == undefined) {
            lists[domain] = [];
        }

        lists[domain].push(parseList(listPath));
    }

    return lists;
}

function getListDomain(listPath) {
    const segments = listPath.split(".");
    return segments[segments.length - 2];
}

function parseList(listPath) {
    const listContent = fs.readFileSync(listPath).toString("utf-8");
    return listContent
        .split("\n")
        .filter((line) => {
            return(line.trim().length > 0 && !line.startsWith("#"))
        });
}