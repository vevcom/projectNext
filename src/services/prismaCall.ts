import { ServerError } from './error'
import { default as prismaDefault } from '@/prisma'
import { Prisma } from '@prisma/client'
import type { ServerErrorCode } from './error'
import prisma from '@/prisma'

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

export type PrismaTransaction = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]


export async function prismaTransactionWithErrorConvertion<T>(
    call: (prisma: PrismaTransaction) => Promise<T>
) {
    return prismaDefault.$transaction(async prisma => await prismaCall(() => call(prisma)))
}
