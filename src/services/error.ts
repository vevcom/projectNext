import type { AuthStatus } from '@/auth/getUser'

export type ServerErrorCode =
    | 'DUPLICATE'
    | 'NOT FOUND'
    | 'BAD PARAMETERS'
    | 'UNKNOWN ERROR'
    | 'JWT EXPIRED'
    | 'JWT INVALID'
    | 'SERVER ERROR'
    | 'INVALID CONFIGURATION'
    | 'NOT IMPLEMENTED'
    | 'INVALID API KEY'

export type ErrorCodes = ServerErrorCode | AuthStatus

export type ErrorMessage = {
    path?: (number | string)[],
    message: string,
}

export class Smorekopp<ValidCodes extends ErrorCodes> extends Error {
    errorCode: ValidCodes
    errors: ErrorMessage[]

    constructor(errorCode: ValidCodes, errors?: string | ErrorMessage[]) {
        const parsedErrors = typeof errors === 'string'
            ? [{ message: errors }]
            : errors

        super(errorCode)

        this.errorCode = errorCode
        this.errors = parsedErrors ?? []
        this.name = 'ServerError'
    }
}

export class ServerError extends Smorekopp<ServerErrorCode> {
    public serviceCausedError: string | undefined
    constructor(errorCode: ServerErrorCode, errors: string | ErrorMessage[], serviceCausedError?: string) {
        super(errorCode, errors)
        this.serviceCausedError = serviceCausedError
    }
}
