import { ServerError } from './error'
import { default as prismaDefault } from '@/prisma'
import { Prisma } from '@prisma/client'
import type { ServerErrorCode } from './error'

const errorMessagesMap: { [key: string]: [ServerErrorCode, string] } = {
    P2002: ['DUPLICATE', 'duplicate entry'],
    P2025: ['NOT FOUND', 'not found'],
}

/**
 * A function that translates prisma calls into ServerErorrs if they throw errors
 * @param call - A async prisma function to call.
 * @returns
 */
export async function prismaCall<T>(call: () => Promise<T>): Promise<T> {
    try {
        return await call()
    } catch (error) {
        if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
            console.error(error)
            throw new ServerError('UNKNOWN ERROR', 'unknown error')
        }

        const pError = errorMessagesMap[error.code]
        if (pError) throw new ServerError(pError[0], pError[1])
        throw new ServerError('UNKNOWN ERROR', 'unknown prisma error')
    }
}

export async function prismaErrorWrapper<T>(
    call: () => Promise<T>,
) {
    return await prismaCall(call)
}
