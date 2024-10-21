import { errorCodes, type ErrorCode, type ErrorMessage } from '@/services/error'
import type { AuthStatus } from '@/auth/getUser'
import type { SafeParseError } from 'zod'
import type { ActionReturnError } from './Types'

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

