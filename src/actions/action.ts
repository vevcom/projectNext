import '@pn-server-only'
import { safeServerCall } from './safeServerCall'
import { Session } from '@/auth/Session'
import type { ActionReturn } from './Types'
import type { ServiceMethodType } from '@/services/ServiceMethod'
import type { z } from 'zod'

// This function is overloaded to allow for different combinations of parameters and data.

export function action<Return>(
    serviceMethod: ServiceMethodType<boolean, Return, undefined, undefined, undefined>
): () => Promise<ActionReturn<Return>>

export function action<
    Return,
    ImplementationParamsSchema extends z.ZodTypeAny
>(
    serviceMethod: ServiceMethodType<boolean, Return, undefined, undefined, ImplementationParamsSchema>
): (
    implementationParams: { implementationParams?: z.input<NonNullable<ImplementationParamsSchema>> },
) => Promise<ActionReturn<Return>>

export function action<
    Return,
    ParamsSchema extends z.ZodTypeAny
>(
    serviceMethod: ServiceMethodType<boolean, Return, ParamsSchema, undefined, undefined>
): (
    params: { params?: z.input<NonNullable<ParamsSchema>> },
) => Promise<ActionReturn<Return>>

export function action<
    Return,
    DataSchema extends z.ZodTypeAny
>(
    serviceMethod: ServiceMethodType<boolean, Return, undefined, DataSchema, undefined>
): (
    data: { data?: z.input<NonNullable<DataSchema>> } | FormData
) => Promise<ActionReturn<Return>>

export function action<
    Return,
    ParamsSchema extends z.ZodTypeAny,
    ImplementationParamsSchema extends z.ZodTypeAny
>(
    serviceMethod: ServiceMethodType<boolean, Return, ParamsSchema, undefined, ImplementationParamsSchema>
): (
    implementationParams: { implementationParams?: z.input<ImplementationParamsSchema> },
    params: { params?: z.input<ParamsSchema> },
) => Promise<ActionReturn<Return>>

export function action<
    Return,
    ParamsSchema extends z.ZodTypeAny,
    DataSchema extends z.ZodTypeAny
>(
    serviceMethod: ServiceMethodType<boolean, Return, ParamsSchema, DataSchema, undefined>
): (
    params: { params?: z.input<ParamsSchema> },
    data: { data?: z.input<DataSchema> } | FormData
) => Promise<ActionReturn<Return>>

export function action<
    Return,
    ImplementationParamsSchema extends z.ZodTypeAny,
    DataSchema extends z.ZodTypeAny
>(
    serviceMethod: ServiceMethodType<boolean, Return, undefined, DataSchema, ImplementationParamsSchema>
): (
    implementationParams: { implementationParams?: z.input<ImplementationParamsSchema> },
    params: { params?: unknown },
    data: { data?: z.input<DataSchema> } | FormData
) => Promise<ActionReturn<Return>>

export function action<
    Return,
    ImplementationParamsSchema extends z.ZodTypeAny,
    ParamsSchema extends z.ZodTypeAny,
    DataSchema extends z.ZodTypeAny
>(
    serviceMethod: ServiceMethodType<boolean, Return, ParamsSchema, DataSchema, ImplementationParamsSchema>
): (
    implementationParams: { implementationParams?: z.input<ImplementationParamsSchema> },
    params: { params?: z.input<ParamsSchema> },
    data: { data?: z.input<DataSchema> } | FormData
) => Promise<ActionReturn<Return>>


/**
 * Turn a service method into suitable function for an action.
 *
 * @param serviceMethod - The service method to create an action for.
 * @returns - A function that takes in data (which may be FormData) and/or/nor parameters and calls the service method.
 */
export function action<
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataSchema extends z.ZodTypeAny | undefined = undefined,
    ImplementationParamsSchema extends z.ZodTypeAny | undefined = undefined
>(
    serviceMethod: ServiceMethodType<boolean, Return, ParamsSchema, DataSchema, ImplementationParamsSchema>
) {
    // Letting the arguments to the actual function be unknown is safer as anything can be passed to it form the client.
    // The action and service method will validate the parameter and data before it is used.
    //
    // For convinience this function is given a return type that is more specific. The return type is a function that
    // has arguments witch match the underlying service method. This makes programming easier as intellisesne can
    // help and errors are caught at compile time.
    const actionUnsafe = async (
        implementationParams: { implementationParams?: unknown },
        params: { params?: unknown },
        data: { data?: unknown } | FormData
    ) => {
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
            () => serviceMethod.newClient().executeUnsafe({
                session,
                params: params?.params,
                data: processedData,
                implementationParams: implementationParams?.implementationParams
            })
        )
    }

    if (serviceMethod.implementationParamsSchema) {
        return actionUnsafe
    }

    if (serviceMethod.paramsSchema) {
        return actionUnsafe.bind(null, { implementationParams: undefined })
    }

    return actionUnsafe.bind(null, { implementationParams: undefined }, { params: undefined })
}
