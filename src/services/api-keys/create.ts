import 'server-only'
import { createApiKeyValidation } from './validation'
import { apiKeyFilterSelection, KeyLength } from './ConfigVars'
import { apiKeyHashAndEncrypt } from './hashEncryptKey'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import crypto from 'crypto'
import type { ApiKeyFilteredWithKey } from './Types'
import type { CreateApiKeyTypes } from './validation'
import { encodeApiKey } from './apiKeyEncoder'

export async function createApiKey(rawdata: CreateApiKeyTypes['Detailed']): Promise<ApiKeyFilteredWithKey> {
    const data = createApiKeyValidation.detailedValidate(rawdata)

    const NODE_ENV = process.env.NODE_ENV
    const prepend = NODE_ENV === 'production' ? 'prod' : 'dev'

    const key = prepend + crypto.randomBytes(KeyLength - prepend.length).toString('hex')
    const keyHashEncrypted = await apiKeyHashAndEncrypt(key)

    const apiKey = await prismaCall(() => prisma.apiKey.create({
        data: {
            keyHashEncrypted,
            name: data.name,
            active: true,
        },
        select: apiKeyFilterSelection
    }))
    return { ...apiKey, key: encodeApiKey({ key, id: apiKey.id }) }
}
