import glob from "fast-glob";
import checkUndeclaredServiceCalls from "./undeclared-service-calls.js";

export default class ServiceResourceChecker {

    constructor(context, config) {
        this.context = context;
        this.config = config;
        this.log = context.log;

        if (!context.log) {
            throw "Missing log in context.";
        }
    }

    getName() {
        return "Service loading checker";
    }

    startCheck() {
        const { baseDir, projectStructure } = this.context;
        const mainModules = findModules(this.config.mainProjects, projectStructure, baseDir);

        checkUndeclaredServiceCalls({
            allModules: projectStructure.allModules,        
            mainModules: mainModules,
            baseDir,
            config: this.config,
            log: this.context.log
        });
    }

}

function findModules(projectPattern, projectStructure, baseDir) {
    const projectPaths = glob.sync(projectPattern, {
        cwd: baseDir,
        onlyDirectories: true,
        absolute: true
    });
    
    let modules = [];
    for (const projectPath of projectPaths) {
        for (const module of projectStructure.allModules) {
            if (module.baseDir === projectPath) {
                modules.push(module);
            }
        }
    }

    return modules;
}