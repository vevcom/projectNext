import { Prisma } from '@prisma/client'
import type { SafeParseError } from 'zod'
import type { ActionReturnError } from './Types'
import { ErrorMessage } from '@/server/error'
import { ActionErrorCode } from './Types'

export function createActionError(errorCode: ActionErrorCode, error?: string | ErrorMessage[]): ActionReturnError {
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

export function createPrismaActionError(err: unknown): ActionReturnError {
    // TODO - LOGGER

    if (!(err instanceof Prisma.PrismaClientKnownRequestError)) {
        return createActionError('UNKNOWN ERROR', 'unknown error')
    }

    const errorMessages: { [key: string]: ActionReturnError } = {
        P2002: createActionError('DUPLICATE'),
        P2025: createActionError('NOT FOUND'),
    }

    return errorMessages[err.code] ?? createActionError('UNKNOWN ERROR', `unknown prisma error ${err.code}`)
}

