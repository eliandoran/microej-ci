import glob from "fast-glob";
import path from "path";

export default function getProjectStructure(context, config) {
    const baseDir = context.baseDir;
    const filePattern = "**/module.ivy";
    const moduleIvyPattern = path.join(baseDir, filePattern);
    const moduleIvyPaths = glob.sync(moduleIvyPattern);

    for (const ivyModulePath of moduleIvyPaths) {
        console.log(ivyModulePath);
    }
}