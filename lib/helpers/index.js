import glob from "fast-glob";
import path from "path";
import getProjectStructure from "./project-structure.js";

export default function parseProjects(context, config) {
    const baseDir = context.baseDir;
    const projectStructure = getProjectStructure(baseDir);

    for (const module of projectStructure.allModules) {
        getResourceLists(module);
    }
}

function getResourceLists(module) {
    const filePattern = "src/main/resources/**/*.list";
    const listPattern = path.join(module.baseDir, filePattern);
    const listPaths = glob.sync(listPattern);

    console.log(listPaths);
}
