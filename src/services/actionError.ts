import { errorCodes, type ErrorCode, type ErrorMessage } from '@/services/error'
import { ParseError, Smorekopp } from '@/services/error'
import type { AuthStatus } from '@/auth/getUser'
import type { SafeParseError } from 'zod'
import type { ActionError, ActionReturn } from './actionTypes'

/**
 * @deprecated With the "new" service method system this should not be called directly.
 * The action creation utility should handle this internally.
 */
export function createActionError(errorCode: ErrorCode | AuthStatus, error?: string | ErrorMessage[]): ActionError {
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

/**
 * @deprecated With the "new" service method system this should not be called directly.
 * The action creation utility should handle this internally.
 */
export function createZodActionError<T>(parse: SafeParseError<T>): ActionError {
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
            data,
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
