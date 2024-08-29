import 'server-only'
import { updateApiKeyValidation } from './validation'
import { prismaCall } from '@/services/prismaCall'
import { ServerError } from '@/services/error'
import prisma from '@/prisma'
import logger from '@/logger'
import { getTimeNow } from '@/dates/getTimeNow'
import type { ApiKey } from '@prisma/client'
import type { UpdateApiKeyTypes } from './validation'

export async function updateApiKey(id: number, rawdata: UpdateApiKeyTypes['Detailed']): Promise<void> {
    const data = updateApiKeyValidation.detailedValidate(rawdata)

    if (data.active && data.expiresAt && data.expiresAt < getTimeNow()) {
        throw new ServerError('BAD PARAMETERS', 'Hvis du vil aktivere en nøkkel, kan den ikke ha utløpt')
    }

    await prismaCall(() => prisma.apiKey.update({
        where: { id },
        data,
    }))
}

export async function updateApiKeyIfExpired<ExtraFields extends object>(
    apiKey: Pick<ApiKey, 'expiresAt' | 'active' | 'id'> & ExtraFields
): Promise<Pick<ApiKey, 'expiresAt' | 'active' | 'id'> & ExtraFields> {
    if (!apiKey) {
        throw new ServerError('NOT FOUND', 'Nøkkelen finnes ikke')
    }

    if (!apiKey.expiresAt || apiKey.expiresAt > getTimeNow()) return apiKey
    logger.info('Deactivating expired api key', { id: apiKey.id })

    const updated = await prismaCall(() => prisma.apiKey.update({
        where: { id: apiKey.id },
        data: { active: false }
    }))
    return {
        ...apiKey,
        active: updated.active,
    }
}
