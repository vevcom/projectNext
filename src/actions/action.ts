import 'server-only'
import { createZodActionError } from './error'
import { safeServerCall } from './safeServerCall'
import { Session } from '@/auth/Session'
import { Smorekopp } from '@/services/error'
import type { ActionReturn } from './Types'
import type {
    ServiceMethodParamsData,
    ServiceMethodParamsDataUnsafe,
    ServiceMethodReturn,
    Validation
} from '@/services/ServiceMethod'
import type { z } from 'zod'

// TODO: Find better names for these types.

export type ActionParamsData<
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataValidation extends Validation<unknown, unknown> | undefined = undefined,
> = {
    [K in keyof ServiceMethodParamsData<ParamsSchema, DataValidation>]: (
        K extends 'data'
            ? FormData
            : never
    ) | ServiceMethodParamsData<ParamsSchema, DataValidation>[K]
}

export type ActionType<
    Return,
    Args extends ServiceMethodParamsDataUnsafe,
> = keyof Args extends never ? (args?: Args) => Promise<ActionReturn<Return>> : (args: Args) => Promise<ActionReturn<Return>>

/**
 * Turn a service method into suitable function for an action.
 *
 * @param serviceMethod - The service method to create an action for.
 * @returns - A function that takes in data (which may be FormData) and/or/nor parameters and calls the service method.
 */
export function action<
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataValidation extends Validation<unknown, unknown> | undefined = undefined,
>(
    serviceMethod: ServiceMethodReturn<boolean, Return, ParamsSchema, DataValidation>
): ActionType<Return, ActionParamsData<ParamsSchema, DataValidation>> {
    // Letting the arguments to the actual function be unknown is safer as anything can be passed to it form the client.
    // The action and service method will validate the parameter and data before it is used.
    //
    // For convinience this function is given a return type that is more specific. The return type is a function that
    // has arguments witch match the underlying service method. This makes programming easier as intellisesne can
    // help and errors are caught at compile time.
    return async (args: ServiceMethodParamsDataUnsafe = {}) => {
        const session = await Session.fromNextAuth()

        if (args.data) {
            if (!serviceMethod.dataValidation) {
                throw new Smorekopp('SERVER ERROR', 'Action recieved data, but service method has no validation.')
            }

            const parse = serviceMethod.dataValidation.typeValidate(args.data)
            if (!parse.success) return createZodActionError(parse)
            args.data = parse.data
        }

        return safeServerCall(() => serviceMethod.newClient().executeUnsafe({ session, ...args }))
    }
}
