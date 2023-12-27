import { ActionReturn } from '@/actions/type'
import { Prisma } from '@prisma/client'

export default function errorHandeler(err: unknown) : ActionReturn<never> {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        return { success: false, error: [{ message: 'Duplicate entry' }] }
    }
    return { success: false, error: [{ message: 'unknown error' }] }
}
