export default function checkUndeclaredServiceCalls(context) {
    const ignoreServices = context.config.ignoreServices || [];

    for (const module of context.mainModules) {
        const properties = module.allResources.properties;
        const serviceCalls = module.allServiceInjectionCalls;

        for (const fqdn of Object.keys(serviceCalls)) {
            const implementation = properties[fqdn];

            if (ignoreServices.includes(fqdn)) {
                continue;
            }

            if (!implementation) {
                for (const file of serviceCalls[fqdn]) {
                    context.log.log("error", `A service was called via ServiceLoaderFactory, but it is not declared in a ".properties" file:\n${fqdn}`, {
                        file
                    });
                }
            }
        }
    }
}

