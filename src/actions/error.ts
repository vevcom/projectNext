import type { ErrorMessage } from '@/server/error'
import type { SafeParseError } from 'zod'
import type { ActionReturnError, ActionErrorCode } from './Types'

export function createActionError(errorCode: ActionErrorCode | 'AUTHORIZED_NO_USER', error?: string | ErrorMessage[]): ActionReturnError {
    return {
        success: false,
        errorCode,
        error: typeof error === 'string' ? [{ message: error }] : error,
    }
}

export function createZodActionError<T>(parse: SafeParseError<T>): ActionReturnError {
    return {
        success: false,
        errorCode: 'BAD PARAMETERS',
        error: parse.error.issues
    }
}

