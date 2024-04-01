export type ServerErrorCode =
    | 'DUPLICATE'
    | 'NOT FOUND'
    | 'BAD PARAMETERS'
    | 'UNKNOWN ERROR'

export type ErrorMessage = {
    path?: (number | string)[],
    message: string,
}

export class ServerError extends Error {
    errorCode: ServerErrorCode
    errors: ErrorMessage[]

    constructor(errorCode: ServerErrorCode, errors: string | ErrorMessage[]) {
        const parsedErrors = typeof errors === 'string'
            ? [{ message: errors }]
            : errors

        super(errorCode)

        this.errorCode = errorCode
        this.errors = parsedErrors
        this.name = 'ServerError'
    }
}
