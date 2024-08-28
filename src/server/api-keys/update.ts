import 'server-only'
import { updateApiKeyValidation } from './validation'
import { prismaCall } from '@/server/prismaCall'
import { ServerError } from '@/server/error'
import prisma from '@/prisma'
import type { UpdateApiKeyTypes } from './validation'

export async function updateApiKey(id: number, rawdata: UpdateApiKeyTypes['Detailed']): Promise<void> {
    const data = updateApiKeyValidation.detailedValidate(rawdata)

    if (data.active && data.expiresAt && data.expiresAt < new Date()) {
        throw new ServerError('BAD PARAMETERS', 'Hvis du vil aktivere en nøkkel, kan den ikke ha utløpt')
    }

    await prismaCall(() => prisma.apiKey.update({
        where: { id },
        data,
    }))
}
