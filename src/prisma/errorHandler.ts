import { ActionReturn } from '@/actions/type'
import { Prisma } from '@prisma/client'

export default function errorHandeler(err: unknown) : ActionReturn<never> {
    // TODO - LOGGER

    if (!(err instanceof Prisma.PrismaClientKnownRequestError)) {
        return { success: false, error: [{ message: 'unknown error' }] }
    }

    const errorMessages: { [key: string]: string } = {
        P2002: 'duplicate entry',
        P2025: 'record not found',
    }

    const errorMessage = errorMessages[err.code] ?? 'unknown prisma error'

    return { success: false, error: [{ message: errorMessage }] }
}
