import glob from "fast-glob";
import path from "path";
import fs from "fs";

export default function getResourceLists(module) {
    const filePattern = "src/main/resources/**/*.list";
    const listPattern = path.join(module.baseDir, filePattern);
    const listPaths = glob.sync(listPattern);

    const lists = {};
    for (const listPath of listPaths) {
        const domain = getListDomain(listPath);
        if (lists[domain] == undefined) {
            lists[domain] = [];
        }

        const parsedList = parseList(domain, listPath);
        lists[domain] = [ ...lists[domain], ...parsedList ];
    }    

    return lists;
}

export function mergeResources({ allModules, groupedModules }) {
    for (const module of allModules) {        
        console.log(module.organisation, module.name);
        mergeModuleResources(module, groupedModules);
        //processLists(module.resources);
    }
}

function mergeModuleResources(module, groupedModules) {    
    console.info(`Merge: ${module.name}`);
    console.group();

    if (module.allResources) {
        console.info("Already done.");
        console.groupEnd();
        return;
    }    

    module.allResources = { ...module.resources };

    for (const dependency of module.dependencies) {
        const org = dependency.org;
        if (!groupedModules[org]) {            
            continue;
        }
        
        const name = dependency.name;
        const dependencyModule = groupedModules[org][name];
        if (!dependencyModule) {
            continue;
        }

        console.info(`Found dependency: ${org}/${name}`);

        if (dependencyModule.dependencies) {
            mergeModuleResources(dependencyModule, groupedModules);
        }                

        for (const resourceType of Object.keys(dependencyModule.resources)) {
            if (!module.allResources[resourceType]) {
                module.allResources[resourceType] = [];
            }            

            module.allResources[resourceType] = [
                ...module.allResources[resourceType], ...dependencyModule.allResources[resourceType] ];
        }
    }

    console.groupEnd();
}

function getListDomain(listPath) {
    const segments = listPath.split(".");
    return segments[segments.length - 2];
}

function parseList(domain, listPath) {
    return fs.readFileSync(listPath)
        .toString("utf-8")
        .split("\n")
        .filter((line) => {
            return(line.trim().length > 0 && !line.startsWith("#"))
        });
}

function processLists(lists) {
    const domainMappings = {
        "properties": parsePropertiesList
    };

    for (const domain of Object.keys(lists)) {
        console.log("Process", lists[domain]);
        const mappedDomain = domainMappings[domain];
        if (mappedDomain) {
            lists[domain] = lists[domain].map((line) => mappedDomain(line));
        }
    }
}

function parsePropertiesList(listContent) {
    console.log("Got: ", listContent);
    const result = {};
    for (const line of listContent) {
        const segments = line.split("=", 2);
        result[segments[0]] = segments[1];
    }
    return result;
}