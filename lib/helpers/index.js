import getProjectStructure from "./project-structure.js";
import { default as getResourceLists, mergeResources } from "./project-lists.js";
import { getServiceInjectionCalls, mergeServiceInjectionCalls } from "./code-service-injection.js";
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

    startCheck() {
        this.parseProjects();
    }

    parseProjects() {
        const baseDir = this.context.baseDir;
        const projectStructure = getProjectStructure(baseDir);
    
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
            modules: projectStructure.allModules
        });
    
        return projectStructure;
    }

}

