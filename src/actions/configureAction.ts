export function configureAction<
    PP, P extends { params: PP } | { implementationParams: PP },
    D extends unknown[], R>(action: (p: P, ...d: D) => R, paramsOrImplementationParams: P
) {
    return action.bind(null, paramsOrImplementationParams)
}
