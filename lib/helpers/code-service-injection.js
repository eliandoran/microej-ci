import fs from "fs";
import path from "path";
import glob from "fast-glob";

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

function processJavaFile(javaFilePath) {
    const javaContent = fs.readFileSync(javaFilePath).toString("utf-8");

    const pattern = /(Services.of|ServiceLoaderFactory.getServiceLoader().getService)\((\w*)\.class/g;
    let result;
    const serviceInjectionCalls = new Set();

    while (result = pattern.exec(javaContent)) {
        const serviceName = result[3];
        serviceInjectionCalls.add(serviceName);
    }    

    return serviceInjectionCalls;
}
