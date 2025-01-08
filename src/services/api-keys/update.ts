import 'server-only'
import { updateApiKeyValidation } from './validation'
import { adminApiKeyAuther } from './authers'
import { ServiceMethod } from '@/services/ServiceMethod'
import { prismaCall } from '@/services/prismaCall'
import { ServerError } from '@/services/error'
import logger from '@/lib/logger'
import { default as globalPrisma } from '@/prisma'
import { z } from 'zod'
import type { ApiKey } from '@prisma/client'

export const updateApiKey = ServiceMethod({
    auther: adminApiKeyAuther,
    dynamicAuthFields: () => ({}),
    paramsSchema: z.number(),
    dataValidation: updateApiKeyValidation,
    method: async ({ prisma, params: id, data }): Promise<void> => {
        if (data.active && data.expiresAt && data.expiresAt < new Date()) {
            throw new ServerError('BAD PARAMETERS', 'Hvis du vil aktivere en nøkkel, kan den ikke ha utløpt')
        }

        await prisma.apiKey.update({
            where: { id },
            data,
        })
    },
})

// TODO: Translate this into service method
/**
 * This function takes an api kay that comes from the database and checks if it is expired.
 * If it is it will update the active status to false and return the updated api key.
 * WARNING: Make sure to only pass api-keys that come straight from the database to this function.
 * @param apiKey - The api key to update if expired
 * @returns
 */
export async function updateApiKeyIfExpired<ExtraFields extends object>(
    apiKey: Pick<ApiKey, 'expiresAt' | 'active' | 'id'> & ExtraFields
): Promise<Pick<ApiKey, 'expiresAt' | 'active' | 'id'> & ExtraFields> {
    if (!apiKey) {
        throw new ServerError('NOT FOUND', 'Nøkkelen finnes ikke')
    }

    if (!apiKey.expiresAt || apiKey.expiresAt > new Date()) return apiKey
    logger.info('Deactivating expired api key', { id: apiKey.id })

    const updated = await prismaCall(() => globalPrisma.apiKey.update({
        where: { id: apiKey.id },
        data: { active: false },
        select: { active: true },
    }))
    return {
        ...apiKey,
        active: updated.active,
    }
}
