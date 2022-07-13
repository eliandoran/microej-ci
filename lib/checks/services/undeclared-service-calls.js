import glob from "fast-glob";

export default function checkUndeclaredServiceCalls(context) {
    const { mainProjects } = context.config;
    const modules = findModules(mainProjects, context.modules, context.baseDir);
    const ignoreServices = context.config.ignoreServices || [];

    for (const module of modules) {
        const properties = module.allResources.properties;
        const serviceCalls = module.allServiceInjectionCalls;

        for (const serviceCall of serviceCalls) {
            const implementation = properties[serviceCall];

            if (ignoreServices.includes(serviceCall)) {
                continue;
            }

            if (!implementation) {
                context.log.log("error", `A service was called via ServiceLoaderFactory, but it is not declared in a ".properties" file:\n${serviceCall}`, {
                    file: module.baseDir
                });
            }
        }
    }
}

function findModules(projectPattern, allModules, baseDir) {
    const projectPaths = glob.sync(projectPattern, {
        cwd: baseDir,
        onlyDirectories: true,
        absolute: true
    });
    
    let modules = [];
    for (const projectPath of projectPaths) {
        for (const module of allModules) {
            if (module.baseDir === projectPath) {
                modules.push(module);
            }
        }
    }

    return modules;
}