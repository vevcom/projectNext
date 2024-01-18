import { ActionReturn } from '@/actions/type'
import { Prisma } from '@prisma/client'

export default function errorHandeler(err: unknown) : ActionReturn<never> {
    //LOGGER 
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        return { success: false, error: [{ message: 'Duplicate entry' }] }
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        return { success: false, error: [{ message: 'Record not found' }] }
    }
    return { success: false, error: [{ message: 'unknown error' }] }
}
