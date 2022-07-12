export default function checkUndeclaredServiceCalls(context) {
    for (const module of context.modules) {
        console.log(module.name);
        const properties = module.allResources.properties;
        const serviceCalls = module.allServiceInjectionCalls;

        for (const serviceCall of serviceCalls) {
            const implementation = properties[serviceCall];
            console.log(`\t${serviceCall} -> ${implementation}`);
        }
    }
}