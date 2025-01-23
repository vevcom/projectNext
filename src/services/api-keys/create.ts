import 'server-only'
import { createApiKeyValidation } from './validation'
import { apiKeyFilterSelection, KeyLength } from './ConfigVars'
import { apiKeyHashAndEncrypt } from './hashEncryptKey'
import { encodeApiKey } from './apiKeyEncoder'
import { adminApiKeyAuther } from './authers'
import { ServiceMethod } from '@/services/ServiceMethod'
import crypto from 'crypto'
import type { ApiKeyFilteredWithKey } from './Types'

export const createApiKey = ServiceMethod({
    auther: () => adminApiKeyAuther.dynamicFields({}),
    dataValidation: createApiKeyValidation,
    method: async ({ prisma, data }): Promise<ApiKeyFilteredWithKey> => {
        const NODE_ENV = process.env.NODE_ENV
        const prepend = NODE_ENV === 'production' ? 'prod' : 'dev'

        const key = prepend + crypto.randomBytes(KeyLength - prepend.length).toString('hex')
        const keyHashEncrypted = await apiKeyHashAndEncrypt(key)

        const apiKey = await prisma.apiKey.create({
            data: {
                keyHashEncrypted,
                name: data.name,
                active: true,
            },
            select: apiKeyFilterSelection
        })
        return { ...apiKey, key: encodeApiKey({ key, id: apiKey.id }) }
    }
})
