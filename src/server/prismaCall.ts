import 'server-only'
import logger from '@/logger'
import { createPrismaActionError } from '@/actions/error'
import type { Prisma } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function prismaCall<T>(
    prismaFn: () => Promise<T>,
    callType: 'UPDATE' | 'CREATE' | 'DESTROY' | 'READ',
    model: Prisma.ModelName,
    message?: string
): Promise<ActionReturn<T>> {
    try {
        const ret = await prismaFn()
        logger.info(`${callType} - success for ${model} ${message ? `: ${message}` : ''}`)
        return { success: true, data: ret }
    } catch (error) {
        logger.error(`${callType} - failed for ${model} ${message ? `: ${message}` : ''}`)
        return createPrismaActionError(error)
    }
}
