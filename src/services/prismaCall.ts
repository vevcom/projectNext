import { ServerError, Smorekopp } from './error'
import { Prisma } from '@prisma/client'
import type { ServerErrorCode } from './error'

const errorMessagesMap: { [key: string]: [ServerErrorCode, string] } = {
    P2002: ['DUPLICATE', 'duplicate entry'],
    P2025: ['NOT FOUND', 'not found'],
}

/**
 * A function that translates prisma calls into ServerErorrs if they throw errors
 *
 * THIS FUNCTION HAS BEEN DEPRECATED IN FAVOR OF prismaErrorWrapper
 *
 * @deprecated
 * @param call - A async prisma function to call.
 * @returns
 */
export async function prismaCall<T>(call: () => T | Promise<T>): Promise<T> {
    try {
        return await call()
    } catch (error) {
        if (error instanceof Smorekopp) {
            throw error
        }

        if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
            console.error(error)
            throw new ServerError('UNKNOWN ERROR', 'unknown error')
        }

        console.error(error) // TODO: Add the details from the error to the ServerError
        const pError = errorMessagesMap[error.code]
        if (pError) throw new ServerError(pError[0], pError[1])
        throw new ServerError('UNKNOWN ERROR', 'unknown prisma error')
    }
}

//TODO: Remove prismaCall and use prismaErrorWrapper instead
/**
 * A function that wraps a prisma call in a try catch block and throws a ServerError if it fails.
 *
 * @param call - The function to be wrapped
 * @returns
 */
export async function prismaErrorWrapper<T>(
    call: () => T | Promise<T>,
) {
    return await prismaCall(call)
}
