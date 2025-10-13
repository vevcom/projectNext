import type { ErrorMessage, ErrorCode } from '@/services/error'

/**
 * The return type of an action on error.
 */
export type ActionError = {
    success: false,
    errorCode: ErrorCode,
    httpCode: number,
    error?: ErrorMessage[],
}

/**
 * The return type of an action on success.
 */
export type ActionData<T = undefined> = {
    success: true,
    data: T,
}

/**
 * The return type of an action. Either success with data or error with error info.
 */
export type ActionReturn<T = undefined> = ActionData<T> | ActionError

export type Action<T = undefined> = (formData: FormData) => (
    Promise<ActionReturn<T>>
)
