import getIvyModules from "./ivy-modules.js";
import { default as getResourceLists, mergeResources } from "./module-lists.js";
import { getServiceInjectionCalls, mergeServiceInjectionCalls } from "./service-injection-calls.js";

export default function parseJavaProjects(baseDir) {    
    const projectStructure = getIvyModules(baseDir);

    for (const module of projectStructure.allModules) {
        module.resources = getResourceLists(module);                    
        module.serviceInjectionCalls = getServiceInjectionCalls(module);
    }

    mergeResources(projectStructure);    
    mergeServiceInjectionCalls(projectStructure);

    return projectStructure;
}