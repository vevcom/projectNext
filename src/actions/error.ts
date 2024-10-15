import { errorCodes, type ErrorCode, type ErrorMessage } from '@/services/error'
import type { SafeParseError } from 'zod'
import type { ActionReturnError } from './Types'

export function createActionError(errorCode: ErrorCode, error?: string | ErrorMessage[]): ActionReturnError {
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

