/**
 * A simple utility function to bind parameters to an action.
 * Under the hood this function simply calls "action.bind(null, params)",
 * but it is more readable to use this function.
 *
 * @param action - An action that takes parameters.
 * @param params - The parameters to bind to the action.
 * @returns - The same action with the parameters bound to it.
 */
export function bindParams<P, D extends unknown[], R>(action: (p: P, ...d: D) => R, params: P) {
    return action.bind(null, params)
}

/**
 * A simple utility function to bind data to an action.
 * Under the hood this function simply calls "action.bind(null, data)",
 * but it is more readable to use this function.
 *
 * @param action - An action that takes data.
 * @param bindData - The data to bind to the action.
 * @returns - The same action with the data bound to it.
 */
export function bindData<D, R>(action: (d: D) => R, data: D) {
    return action.bind(null, data)
}
