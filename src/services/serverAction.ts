import '@pn-server-only'
import { safeServerCall } from './actionError'
import { Session } from '@/auth/session/Session'
import type { Action, ActionReturn } from './actionTypes'
import type { ServiceOperation } from '@/services/serviceOperation'
import type { z } from 'zod'

// This function is overloaded to allow for different combinations of parameters and data.

export function makeAction<
    Return,
    ImplementationParamsSchema extends undefined,
    ParamsSchema extends undefined,
    DataSchema extends undefined
>(
    serviceOperation: ServiceOperation<boolean, Return, ParamsSchema, DataSchema, ImplementationParamsSchema>
): Action<Return, ImplementationParamsSchema, ParamsSchema, DataSchema>

export function makeAction<
    Return,
    ImplementationParamsSchema extends z.ZodTypeAny,
    ParamsSchema extends undefined,
    DataSchema extends undefined
>(
    serviceOperation: ServiceOperation<boolean, Return, ParamsSchema, DataSchema, ImplementationParamsSchema>
): Action<Return, ImplementationParamsSchema, ParamsSchema, DataSchema>

export function makeAction<
    Return,
    ImplementationParamsSchema extends undefined,
    ParamsSchema extends z.ZodTypeAny,
    DataSchema extends undefined
>(
    serviceOperation: ServiceOperation<boolean, Return, ParamsSchema, DataSchema, ImplementationParamsSchema>
): Action<Return, ImplementationParamsSchema, ParamsSchema, DataSchema>

export function makeAction<
    Return,
    ImplementationParamsSchema extends undefined,
    ParamsSchema extends undefined,
    DataSchema extends z.ZodTypeAny
>(
    serviceOperation: ServiceOperation<boolean, Return, ParamsSchema, DataSchema, ImplementationParamsSchema>
): Action<Return, ImplementationParamsSchema, ParamsSchema, DataSchema>

export function makeAction<
    Return,
    ImplementationParamsSchema extends z.ZodTypeAny,
    ParamsSchema extends z.ZodTypeAny,
    DataSchema extends undefined
>(
    serviceOperation: ServiceOperation<boolean, Return, ParamsSchema, DataSchema, ImplementationParamsSchema>
): Action<Return, ImplementationParamsSchema, ParamsSchema, DataSchema>

export function makeAction<
    Return,
    ImplementationParamsSchema extends undefined,
    ParamsSchema extends z.ZodTypeAny,
    DataSchema extends z.ZodTypeAny
>(
    serviceOperation: ServiceOperation<boolean, Return, ParamsSchema, DataSchema, ImplementationParamsSchema>
): Action<Return, ImplementationParamsSchema, ParamsSchema, DataSchema>

export function makeAction<
    Return,
    ImplementationParamsSchema extends z.ZodTypeAny,
    ParamsSchema extends undefined,
    DataSchema extends z.ZodTypeAny
>(
    serviceOperation: ServiceOperation<boolean, Return, ParamsSchema, DataSchema, ImplementationParamsSchema>
): Action<Return, ImplementationParamsSchema, ParamsSchema, DataSchema>

export function makeAction<
    Return,
    ImplementationParamsSchema extends z.ZodTypeAny,
    ParamsSchema extends z.ZodTypeAny,
    DataSchema extends z.ZodTypeAny
>(
    serviceOperation: ServiceOperation<boolean, Return, ParamsSchema, DataSchema, ImplementationParamsSchema>
): Action<Return, ImplementationParamsSchema, ParamsSchema, DataSchema>


/**
 * Turn a service operation into suitable function for an action.
 *
 * @param serviceOperation - The service operation to create an action for.
 * @returns - A function that takes in data (which may be FormData) and/or/nor parameters and calls the service operation.
 */
export function makeAction<
    Return,
    ImplementationParamsSchema extends z.ZodTypeAny | undefined = undefined,
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataSchema extends z.ZodTypeAny | undefined = undefined
>(
    serviceOperation: ServiceOperation<boolean, Return, ParamsSchema, DataSchema, ImplementationParamsSchema>
): Action<Return, ImplementationParamsSchema, ParamsSchema, DataSchema> {
    // Letting the arguments to the actual function be unknown is safer as anything can be passed to it form the client.
    // The action and service operation will validate the parameter and data before it is used.
    //
    // For convinience this function is given a return type that is more specific. The return type is a function that
    // has arguments witch match the underlying service operation. This makes programming easier as intellisesne can
    // help and errors are caught at compile time.
    const actionUnsafe = async (
        implementationParams: { implementationParams: unknown },
        params: { params: unknown },
        data: { data: unknown } | FormData,
    ): Promise<ActionReturn<Return>> => {
        const session = await Session.fromNextAuth()

        let processedData: unknown
        if (data instanceof FormData) {
            // Treat empty form data as undefined. This is required because the form component will always send
            // a FormData instance, even if no data is being sent.
            if (data.entries().next().done) {
                processedData = undefined
            } else {
                processedData = data
            }
        } else {
            processedData = data?.data ?? undefined
        }

        return safeServerCall(
            () => serviceOperation<'UNSAFE'>({
                session,
                params: params?.params,
                data: processedData,
                implementationParams: implementationParams?.implementationParams
            })
        )
    }

    if (serviceOperation.implementationParamsSchema) {
        return actionUnsafe as Action<Return, ImplementationParamsSchema, ParamsSchema, DataSchema>
    }

    if (serviceOperation.paramsSchema) {
        return (
            actionUnsafe.bind(null, { implementationParams: undefined }) as
            Action<Return, ImplementationParamsSchema, ParamsSchema, DataSchema>
        )
    }

    return (
        actionUnsafe.bind(null, { implementationParams: undefined }, { params: undefined }) as
        Action<Return, ImplementationParamsSchema, ParamsSchema, DataSchema>
    )
}
