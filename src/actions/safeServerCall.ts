import { createActionError, createZodActionError } from './actionError'
import { ParseError, Smorekopp } from '@/services/error'
import type { ActionReturn } from './actionTypes'

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
