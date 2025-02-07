import 'server-only'
import { apiKeyAuthers } from './authers'
import { apiKeysConfig } from './config'
import { apiKeySchemas } from './schemas'
import { apiKeyHashAndEncrypt } from './hashEncryptKey'
import { encodeApiKey } from './apiKeyEncoder'
import { ServerError } from '@/services/error'
import { ServiceMethod } from '@/services/ServiceMethod'
import logger from '@/lib/logger'
import { z } from 'zod'
import crypto from 'crypto'
import type { ApiKeyFiltered, ApiKeyFilteredWithKey } from './Types'

const updateIfExpired = ServiceMethod({
    auther: () => apiKeyAuthers.updateIfExpired.dynamicFields({}),
    paramsSchema: z.object({
        id: z.number(),
        expiresAt: z.date().nullable(),
        active: z.boolean(),
    }),
    method: async ({ prisma, params: apiKey }) => {
        if (!apiKey) {
            throw new ServerError('NOT FOUND', 'Nøkkelen finnes ikke')
        }

        if (!apiKey.expiresAt || apiKey.expiresAt > new Date()) return { active: apiKey.active }
        logger.info('Deactivating expired api key', { id: apiKey.id })

        const updated = await prisma.apiKey.update({
            where: { id: apiKey.id },
            data: { active: false },
            select: { active: true },
        })
        return {
            active: updated.active,
        }
    }
})

export const apiKeyMethods = {
    create: ServiceMethod({
        auther: () => apiKeyAuthers.create.dynamicFields({}),
        dataSchema: apiKeySchemas.create,
        method: async ({ prisma, data }): Promise<ApiKeyFilteredWithKey> => {
            const NODE_ENV = process.env.NODE_ENV
            const prepend = NODE_ENV === 'production' ? 'prod' : 'dev'

            const key = prepend + crypto.randomBytes(apiKeysConfig.keyLength - prepend.length).toString('hex')
            const keyHashEncrypted = await apiKeyHashAndEncrypt(key)

            const apiKey = await prisma.apiKey.create({
                data: {
                    keyHashEncrypted,
                    name: data.name,
                    active: true,
                },
                select: apiKeysConfig.filterSelection
            })
            return { ...apiKey, key: encodeApiKey({ key, id: apiKey.id }) }
        }
    }),
    read: ServiceMethod({
        auther: () => apiKeyAuthers.read.dynamicFields({}),
        paramsSchema: z.union([z.number(), z.string()]),
        method: async ({ prisma, params: idOrName }): Promise<ApiKeyFiltered> => {
            const apiKey = await prisma.apiKey.findUnique({
                where: {
                    id: typeof idOrName === 'number' ? idOrName : undefined,
                    name: typeof idOrName === 'string' ? idOrName : undefined
                },
                select: apiKeysConfig.filterSelection
            })

            if (!apiKey) throw new ServerError('BAD PARAMETERS', 'Api key does not exist')
            return {
                ...apiKey,
                ...await updateIfExpired.client(prisma).execute({
                    params: apiKey,
                    session: null,
                    bypassAuth: true,
                })
            }
        }
    }),
    readMany: ServiceMethod({
        auther: () => apiKeyAuthers.readMany.dynamicFields({}),
        method: async ({ prisma }): Promise<ApiKeyFiltered[]> => {
            const apiKeys = await prisma.apiKey.findMany({
                select: apiKeysConfig.filterSelection,
                orderBy: [
                    { active: 'desc' },
                    { name: 'asc' }
                ]
            })

            return await Promise.all(apiKeys.map(async apiKey => ({
                ...apiKey,
                ...await updateIfExpired.client(prisma).execute({
                    params: apiKey,
                    session: null,
                    bypassAuth: true,
                })
            })))
        }
    }),
    readWithHash: ServiceMethod({
        auther: () => apiKeyAuthers.readWithHash.dynamicFields({}),
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

            return {
                ...apiKey,
                ...await updateIfExpired.client(prisma).execute({
                    params: apiKey,
                    session: null,
                    bypassAuth: true,
                }),
            }
        }
    }),
    update: ServiceMethod({
        auther: () => apiKeyAuthers.update.dynamicFields({}),
        paramsSchema: z.number(),
        dataSchema: apiKeySchemas.update,
        method: async ({ prisma, params: id, data }): Promise<void> => {
            if (data.active && data.expiresAt && data.expiresAt < new Date()) {
                throw new ServerError('BAD PARAMETERS', 'Hvis du vil aktivere en nøkkel, kan den ikke ha utløpt')
            }

            await prisma.apiKey.update({
                where: { id },
                data,
            })
        },
    }),
    updateIfExpired,
    destroy: ServiceMethod({
        auther: () => apiKeyAuthers.destroy.dynamicFields({}),
        paramsSchema: z.number(),
        opensTransaction: true,
        method: async ({ prisma, params: id }): Promise<void> => {
            await prisma.$transaction(async (tx) => {
                const apiKey = await tx.apiKey.findUniqueOrThrow({
                    where: { id },
                    select: { active: true }
                })

                if (apiKey.active) {
                    throw new ServerError('BAD PARAMETERS', 'Du kan ikke slette en aktiv nøkkel - deaktiver den først')
                }

                await tx.apiKey.delete({
                    where: { id }
                })
            })
        }
    }),
} as const
