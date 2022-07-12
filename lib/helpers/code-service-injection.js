import fs from "fs";
import path from "path";
import glob from "fast-glob";
import { AssertionError } from "assert";

export function getServiceInjectionCalls(module) {
    const filePattern = "**/src/*/java/**/*.java";
    const javaPattern = path.join(module.baseDir, filePattern);
    const javaPaths = glob.sync(javaPattern);

    let serviceInjectionCalls = [];
    for (const javaPath of javaPaths) {
        serviceInjectionCalls = [ ...serviceInjectionCalls, ...processJavaFile(javaPath) ];
    }

    return new Set(serviceInjectionCalls);
}

export function mergeServiceInjectionCalls({ allModules, groupedModules }) {
    for (const module of allModules) {
        mergeModuleServiceInjectionCalls(module, groupedModules);
    }
}

function mergeModuleServiceInjectionCalls(module, groupedModules) {
    if (module.allServiceInjectionCalls) {
        return;
    }

    module.allServiceInjectionCalls = [ ...module.serviceInjectionCalls ];

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

        if (dependencyModule.dependencies) {
            mergeModuleServiceInjectionCalls(dependencyModule, groupedModules);
        }

        module.allServiceInjectionCalls = [ ...module.allServiceInjectionCalls,
            ...dependencyModule.allServiceInjectionCalls ];
    }
}

function processJavaFile(javaFilePath) {
    const javaContent = fs.readFileSync(javaFilePath).toString("utf-8");
    const importMap = buildImportMap(javaContent);

    const pattern = /(Services.of|ServiceLoaderFactory.getServiceLoader().getService)\((\w*)\.class/g;
    let match;
    const serviceInjectionCalls = new Set();

    while (match = pattern.exec(javaContent)) {
        const serviceName = match[3];
        let serviceFqdn = importMap[serviceName];

        if (!serviceFqdn) {
            const packageName = getPackageName(javaContent);
            serviceFqdn = `${packageName}.${serviceName}`;
        }

        serviceInjectionCalls.add(serviceFqdn);
    }    

    return serviceInjectionCalls;
}

function getPackageName(javaContent) {
    const packagePattern = /package\s*([\w\.]*)/g;
    const packageName = packagePattern.exec(javaContent)[1];
    return packageName;
}

function buildImportMap(javaContent) {
    const importPattern = /^\s*import\s*([\w\.]*)/gm;
    let match;
    let result = {};

    while (match = importPattern.exec(javaContent)) {
        const fqdn = match[1];
        const segments = fqdn.split(".");
        const name = segments[segments.length - 1];
        result[name] = fqdn;
    }

    return result;
}
