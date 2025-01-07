import type { ActionReturn } from './Types'

/**
 * A utility function to bind parameters to an action.
 * @param action - The action to bind parameters to.
 * @param params - The parameters to bind to the action.
 * @returns A function that takes data and calls the action with the bound parameters and the data.
 */
export function bindParams<Return, Params = undefined, Data = undefined>(
    action: (args: { params: Params, data: Data | FormData }) => Promise<ActionReturn<Return>>,
    params: Params
) {
    // Here we do a cast to avoid having to pass "undefined" explicitly when data is not required for action.
    // This specific type cast is safe because in the case when
    return ((data: Data | FormData) => action({ params, data })) as Data extends undefined
        ? (() => Promise<ActionReturn<Return>>)
        : ((data: Data | FormData) => Promise<ActionReturn<Return>>)
}
