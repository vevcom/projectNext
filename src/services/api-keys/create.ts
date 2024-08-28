import 'server-only'
import { createApiKeyValidation } from './validation'
import { apiKeyFilterSelection, KeyAllowedChars, KeyLength } from './ConfigVars'
import { apiKeyHashAndEncrypt } from './hashEncryptKey'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import crypto from 'crypto'
import type { ApiKeyFilteredWithKey } from './Types'
import type { CreateApiKeyTypes } from './validation'

function generateRandomString(allowedChars: string, length: number): string {
    let result = ''
    const bytes = crypto.randomBytes(length)
    for (let i = 0; i < length; i++) {
        result += allowedChars[bytes[i] % allowedChars.length]
    }
    return result
}

export async function createApiKey(rawdata: CreateApiKeyTypes['Detailed']): Promise<ApiKeyFilteredWithKey> {
    const data = createApiKeyValidation.detailedValidate(rawdata)

    const NODE_ENV = process.env.NODE_ENV
    const prepend = NODE_ENV === 'production' ? 'prod' : 'dev'

    const key = prepend + generateRandomString(KeyAllowedChars, KeyLength - prepend.length)
    const keyHashEncrypted = await apiKeyHashAndEncrypt(key)

    const apiKey = await prismaCall(() => prisma.apiKey.create({
        data: {
            keyHashEncrypted,
            name: data.name,
            active: true,
        },
        select: apiKeyFilterSelection
    }))
    return { ...apiKey, key }
}
