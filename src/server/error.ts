export type ErrorCode =
    | 'DUPLICATE'
    | 'NOT FOUND'
    | 'BAD PARAMETERS'
    | 'UNAUTHENTICATED'
    | 'UNAUTHORIZED'
    | 'UNKNOWN ERROR'

export type ErrorMessage = {
    path?: (number | string)[],
    message: string,
}

export class ServerError extends Error {
    errorCode: ErrorCode;
    errors: ErrorMessage[];

    constructor(errorCode: ErrorCode, errors: string | ErrorMessage[]) {
        const parsed_errors = typeof errors === 'string'
            ? [{ message: errors }]
            : errors
        
        super(errorCode)
        
        this.errorCode = errorCode
        this.errors = parsed_errors
        this.name = "ServerError"
    }
}
