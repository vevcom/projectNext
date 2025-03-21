import 'server-only'
import { createZodActionError } from './error'
import { safeServerCall } from './safeServerCall'
import { Session } from '@/auth/Session'
import { Smorekopp } from '@/services/error'
import type { ExtractDetailedType, ValidationTypeUnknown } from '@/services/Validation'
import type { ActionReturn } from './Types'
import type { ServiceMethodType } from '@/services/ServiceMethod'
import type { z } from 'zod'

// This function is overloaded to allow for different combinations of parameters and data.

export function action<Return>(
    serviceMethod: ServiceMethodType<boolean, Return, undefined, undefined>
): () => Promise<ActionReturn<Return>>

export function action<Return, ParamsSchema extends z.ZodTypeAny>(
    serviceMethod: ServiceMethodType<boolean, Return, ParamsSchema, undefined>
): (params: z.infer<ParamsSchema>) => Promise<ActionReturn<Return>>

export function action<Return, DataValidation extends ValidationTypeUnknown>(
    serviceMethod: ServiceMethodType<boolean, Return, undefined, DataValidation>
): (data: ExtractDetailedType<DataValidation> | FormData) => Promise<ActionReturn<Return>>

export function action<Return, ParamsSchema extends z.ZodTypeAny, DataValidation extends ValidationTypeUnknown>(
    serviceMethod: ServiceMethodType<boolean, Return, ParamsSchema, DataValidation>
): (params: z.infer<ParamsSchema>, data: ExtractDetailedType<DataValidation> | FormData) => Promise<ActionReturn<Return>>

/**
 * Turn a service method into suitable function for an action.
 *
 * @param serviceMethod - The service method to create an action for.
 * @returns - A function that takes in data (which may be FormData) and/or/nor parameters and calls the service method.
 */
export function action<
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataValidation extends ValidationTypeUnknown | undefined = undefined,
>(
    serviceMethod: ServiceMethodType<boolean, Return, ParamsSchema, DataValidation>
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

        // Validate data if it's present.
        if (data) {
            if (!serviceMethod.dataValidation) {
                throw new Smorekopp('SERVER ERROR', 'Action recieved data, but service method has no validation.')
            }

            const parse = serviceMethod.dataValidation.typeValidate(data)
            if (!parse.success) return createZodActionError(parse)
            data = parse.data
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
