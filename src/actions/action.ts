import 'server-only'
import { safeServerCall } from './safeServerCall'
import { Session } from '@/auth/Session'
import type { ActionReturn } from './Types'
import type { ServiceMethodType } from '@/services/ServiceMethod'
import type { z } from 'zod'

// This function is overloaded to allow for different combinations of parameters and data.

export function action<Return>(
    serviceMethod: ServiceMethodType<boolean, Return, undefined, undefined>
): () => Promise<ActionReturn<Return>>

export function action<Return, ParamsSchema extends z.ZodTypeAny>(
    serviceMethod: ServiceMethodType<boolean, Return, ParamsSchema, undefined>
): (params: z.input<ParamsSchema>) => Promise<ActionReturn<Return>>

export function action<Return, DataSchema extends z.ZodTypeAny | undefined>(
    serviceMethod: ServiceMethodType<boolean, Return, undefined, DataSchema>
): (data: z.input<NonNullable<DataSchema>> | FormData) => Promise<ActionReturn<Return>>

export function action<Return, ParamsSchema extends z.ZodTypeAny, DataSchema extends z.ZodTypeAny | undefined>(
    serviceMethod: ServiceMethodType<boolean, Return, ParamsSchema, DataSchema>
): (params: z.input<ParamsSchema>, data: z.input<NonNullable<DataSchema>> | FormData) => Promise<ActionReturn<Return>>

/**
 * Turn a service method into suitable function for an action.
 *
 * @param serviceMethod - The service method to create an action for.
 * @returns - A function that takes in data (which may be FormData) and/or/nor parameters and calls the service method.
 */
export function action<
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataSchema extends z.ZodTypeAny | undefined = undefined
>(
    serviceMethod: ServiceMethodType<boolean, Return, ParamsSchema, DataSchema>
) {
    // Letting the arguments to the actual function be unknown is safer as anything can be passed to it form the client.
    // The action and service method will validate the parameter and data before it is used.
    //
    // For convinience this function is given a return type that is more specific. The return type is a function that
    // has arguments witch match the underlying service method. This makes programming easier as intellisesne can
    // help and errors are caught at compile time.
    const actionUnsafe = async (params?: unknown, data?: unknown) => {
        const session = await Session.fromNextAuth()

        // Treat empty form data as undefined. This is required because the form component will always send
        // a FormData instance, even if no data is being sent.
        if (data instanceof FormData && data.entries().next().done) {
            data = undefined
        }

        return safeServerCall(() => serviceMethod.newClient().executeUnsafe({ session, params, data }))
    }

    // If the service method has a params schema, we require the params to be passed to the action.
    if (serviceMethod.paramsSchema) {
        return actionUnsafe
    }

    // Otherwise we return a function that takes no params, only data.
    return actionUnsafe.bind(null, undefined)
}
