import 'server-only'
import { apiKeyFilterSelection } from './ConfigVars'
import { updateApiKeyIfExpired } from './update'
import { adminApiKeyAuther, readApiKeyHashedAndEncryptedAuther } from './authers'
import { ServiceMethod } from '@/services/ServiceMethod'
import { ServerError } from '@/services/error'
import { z } from 'zod'
import type { ApiKeyFiltered } from './Types'

export const readApiKeys = ServiceMethod({
    auther: () => adminApiKeyAuther.dynamicFields({}),
    method: async ({ prisma }): Promise<ApiKeyFiltered[]> => {
        const apiKeys = await prisma.apiKey.findMany({
            select: apiKeyFilterSelection,
            orderBy: [
                { active: 'desc' },
                { name: 'asc' }
            ]
        })

        return await Promise.all(apiKeys.map(updateApiKeyIfExpired))
    }
})

export const readApiKey = ServiceMethod({
    auther: () => adminApiKeyAuther.dynamicFields({}),
    paramsSchema: z.union([z.number(), z.string()]),
    method: async ({ prisma, params: idOrName }): Promise<ApiKeyFiltered> => {
        const apiKey = await prisma.apiKey.findUnique({
            where: {
                id: typeof idOrName === 'number' ? idOrName : undefined,
                name: typeof idOrName === 'string' ? idOrName : undefined
            },
            select: apiKeyFilterSelection
        })

        if (!apiKey) throw new ServerError('BAD PARAMETERS', 'Api key does not exist')
        return updateApiKeyIfExpired(apiKey)
    }
})

export const readApiKeyHashedAndEncrypted = ServiceMethod({
    auther: () => readApiKeyHashedAndEncryptedAuther.dynamicFields({}),
    paramsSchema: z.number(),
    method: async ({ prisma, params: id }) => {
        const apiKey = await prisma.apiKey.findUniqueOrThrow({
            where: { id },
            select: {
                keyHashEncrypted: true,
                active: true,
                expiresAt: true,
                id: true,
                permissions: true
            }
        })

        return updateApiKeyIfExpired(apiKey)
    }
})
