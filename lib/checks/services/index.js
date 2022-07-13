import parseJavaProjects from "../../parsers/java/index.js";
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
        const baseDir = this.context.baseDir;
        const projectStructure = parseJavaProjects(baseDir);

        checkUndeclaredServiceCalls({
            modules: projectStructure.allModules,
            baseDir,
            config: this.config,
            log: this.context.log
        });
    }

}

