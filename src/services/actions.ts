'use server'

import type { AuthStatus } from '@/auth/getUser'
import { Session } from '@/auth/Session'
import { ParseError, Smorekopp, errorCodes } from '@/services/error'
import type { ErrorCode, ErrorMessage } from '@/services/error'
import type { ServiceMethodExecuteArgs, ServiceMethodType } from '@/services/ServiceMethod'
import '@pn-server-only'
import type { SafeParseError, z } from 'zod'

export type ActionReturnError = {
    success: false,
    errorCode: ErrorCode,
    httpCode: number,
    error?: ErrorMessage[],
}

export type ActionReturn<ReturnType, DataGuarantee extends boolean = true> = (
    ActionReturnError
) | {
    success: true,
} & (
    DataGuarantee extends true ? {
        data: ReturnType
    } : {
        data?: ReturnType
    }
)

export type Action<ReturnType, DataGuarantee extends boolean = true> = (formData: FormData) => (
    Promise<ActionReturn<ReturnType, DataGuarantee>>
)

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
    // For convenience this function is given a return type that is more specific. The return type is a function that
    // has arguments witch match the underlying service method. This makes programming easier as Intellisense can
    // help and errors are caught at compile time.
    const actionUnsafe = async (params?: unknown, data?: unknown) => {
        const session = await Session.fromNextAuth()

        // Treat empty form data as undefined. This is required because the form component will always send
        // a FormData instance, even if no data is being sent.
        if (data instanceof FormData && data.entries().next().done) {
            data = undefined
        }

        return safeServerCall(() => serviceMethod({
            session,
            params,
            data,
        } as unknown as ServiceMethodExecuteArgs<ParamsSchema, DataSchema, boolean>))
    }

    // If the service method has a params schema, we require the params to be passed to the action.
    if (serviceMethod.paramsSchema) {
        return actionUnsafe
    }

    // Otherwise we return a function that takes no params, only data.
    return actionUnsafe.bind(null, undefined)
}/**
 * A simple utility function to bind parameters to an action.
 * Under the hood this function simply calls "action.bind(null, params)",
 * but it is more readable to use this function.
 *
 * @param action - An action that takes parameters.
 * @param params - The parameters to bind to the action.
 * @returns - The same action with the parameters bound to it.
 */
export function bindParams<P, D extends unknown[], R>(action: (p: P, ...dataArgs: D) => R, params: P) {
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
export function bindData<D, R>(action: (dataValue: D) => R, data: D) {
    return action.bind(null, data)
}

export function createActionError(errorCode: ErrorCode | AuthStatus, error?: string | ErrorMessage[]): ActionReturnError {
    if (errorCode === 'AUTHORIZED' || errorCode === 'AUTHORIZED_NO_USER') {
        return {
            success: false,
            errorCode: 'UNKNOWN ERROR',
            httpCode: 500,
            error: typeof error === 'string' ? [{ message: error }] : error,
        }
    }
    return {
        success: false,
        errorCode,
        httpCode: errorCodes.find(e => e.name === errorCode)?.httpCode ?? 500,
        error: typeof error === 'string' ? [{ message: error }] : error,
    }
}

export function createZodActionError<T>(parse: SafeParseError<T>): ActionReturnError {
    return {
        success: false,
        httpCode: 400,
        errorCode: 'BAD PARAMETERS',
        error: parse.error.issues,
    }
}

/**
 * A function that calls a server function. If all goes well, it returns a ActionReturn with the data.
 * If an error is thrown it returns ActionReturn of success false and the error.
 * The function handles ServerErrors class, and treats all other errors as unknown.
 * @param call - A async server function to call.
 * @returns - A promise that resolves to an ActionReturn.
 */
export async function safeServerCall<T>(call: () => Promise<T>): Promise<ActionReturn<T>> {
    try {
        const data = await call()
        return {
            success: true,
            data
        }
    } catch (error) {
        if (error instanceof ParseError) {
            return createZodActionError(error.parseError)
        }
        if (error instanceof Smorekopp) {
            return createActionError(error.errorCode, error.errors)
        }
        return createActionError('UNKNOWN ERROR', 'unknown error')
    }
}
