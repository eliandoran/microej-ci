import getProjectStructure from "./project-structure.js";
import getResourceLists from "./project-lists.js";

export default function parseProjects(context, config) {
    const baseDir = context.baseDir;
    const projectStructure = getProjectStructure(baseDir);

    for (const module of projectStructure.allModules) {
        module.resources = getResourceLists(module);
    }

    return projectStructure;
}
