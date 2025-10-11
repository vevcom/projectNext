export function configureAction<
    P, O extends { params: P } | { implementationParams: P },
    D extends unknown[], R
>(action: (params: O, ...rest: D) => R, paramsOrImplementationParams: O) {
    return action.bind(null, paramsOrImplementationParams)
}
