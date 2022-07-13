import getIvyModules from "../parsers/java/ivy-modules.js";
import { default as getResourceLists, mergeResources } from "../parsers/java/module-lists.js";
import { getServiceInjectionCalls, mergeServiceInjectionCalls } from "./code-service-injection.js";
import checkUndeclaredServiceCalls from "../checks/services/undeclared-service-calls.js";

export default class ServiceResourceChecker {

    constructor(context, config) {
        this.context = context;
        this.config = config;
        this.log = context.log;

        if (!context.log) {
            throw "Missing log in context.";
        }
    }

    startCheck() {
        this.parseProjects();
    }

    parseProjects() {
        const baseDir = this.context.baseDir;
        const projectStructure = getIvyModules(baseDir);
    
        for (const module of projectStructure.allModules) {
            module.resources = getResourceLists(module);                    
            module.serviceInjectionCalls = getServiceInjectionCalls(module);
        }
    
        mergeResources(projectStructure);    
        mergeServiceInjectionCalls(projectStructure);

        /*for (const module of projectStructure.allModules) {
            console.log(JSON.stringify(module, null, 4));
        }*/

        checkUndeclaredServiceCalls({
            modules: projectStructure.allModules,
            baseDir,
            config: this.config,
            log: this.context.log
        });
    
        return projectStructure;
    }

}

