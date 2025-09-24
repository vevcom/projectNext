import { z } from "zod";
import { Action, ActionOnlyData, ActionOnlyParams } from "./action";

/**
 * A simple utility function to bind parameters to an action.
 * Under the hood this function simply calls "action.bind(null, params)",
 * but it is more readable to use this function.
 *
 * @param action - An action that takes parameters.
 * @param params - The parameters to bind to the action.
 * @returns - The same action with the parameters bound to it.
 */
export function bindParams<
    Return,
    ParamsSchema extends z.ZodTypeAny,
    DataSchema extends z.ZodTypeAny,
>(action: Action<Return, ParamsSchema, DataSchema>, params: z.input<ParamsSchema>): ActionOnlyData<Return, DataSchema> {
    // Not ideal to use 'as unknown' but TS does not handle tuple arguments well in this case.
    return (action as unknown as ActionOnlyParams<Return, ParamsSchema>).bind(null, { params })
}
