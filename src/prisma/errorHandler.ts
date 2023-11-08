import { Prisma } from '@prisma/client'

export default function errorHandeler(err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        return { success: false, error: 'Duplicate entry' }
    }
    return { success: false, error: 'unknown error' }
}