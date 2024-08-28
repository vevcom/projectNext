import 'server-only'
import { updateApiKeyValidation } from './validation'
import { prismaCall } from '@/server/prismaCall'
import { ServerError } from '@/server/error'
import prisma from '@/prisma'
import type { UpdateApiKeyTypes } from './validation'

export async function updateApiKey(id: number, rawdata: UpdateApiKeyTypes['Detailed']): Promise<void> {
    const data = updateApiKeyValidation.detailedValidate(rawdata)

    if (data.active && data.expiresAt && data.expiresAt < new Date()) {
        throw new ServerError('BAD PARAMETERS', 'If you want to activate the key, the expiration date must be in the future')
    }

    await prismaCall(() => prisma.apiKey.update({
        where: { id },
        data: {
            name: data.name,
            permissions: data.permissions,
            expiresAt: data.expiresAt
        }
    }))
}
