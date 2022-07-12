import getProjectStructure from "./project-structure.js";
import { default as getResourceLists, mergeResources } from "./project-lists.js";
import { getServiceInjectionCalls } from "./code-service-injection.js";

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
        }
    
        mergeResources(projectStructure);
    
        for (const module of projectStructure.allModules) {
            console.log(module.baseDir);
            module.serviceInjectionCalls = getServiceInjectionCalls(module);
            console.log(module.serviceInjectionCalls);
        }
    
        return projectStructure;
    }

}

