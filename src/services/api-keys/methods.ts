import '@pn-server-only'
import { apiKeyAuthers } from './authers'
import { apiKeySchemas } from './schemas'
import { apiKeyHashAndEncrypt } from './hashEncryptKey'
import { encodeApiKey } from './apiKeyEncoder'
import { apiFilterSelection, apiKeyLength } from './config'
import { ServerError } from '@/services/error'
import { defineOperation } from '@/services/serviceOperation'
import logger from '@/lib/logger'
import { z } from 'zod'
import crypto from 'crypto'
import type { ApiKeyFiltered, ApiKeyFilteredWithKey } from './Types'

/**
 * Updates the active status of an api key if it has expired, i.e. if the expiresAt date is in the past.
 * This method is used when reading api keys to ensure that the active status is correct.
 *
 * Note: This operaiton is only used internally.
 */
const updateIfExpired = defineOperation({
    authorizer: () => apiKeyAuthers.updateIfExpired.dynamicFields({}),
    paramsSchema: z.object({
        id: z.number(),
        expiresAt: z.date().nullable(),
        active: z.boolean(),
    }),
    operation: async ({ prisma, params: apiKey }) => {
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
    create: defineOperation({
        authorizer: () => apiKeyAuthers.create.dynamicFields({}),
        dataSchema: apiKeySchemas.create,
        operation: async ({ prisma, data }): Promise<ApiKeyFilteredWithKey> => {
            const NODE_ENV = process.env.NODE_ENV
            const prepend = NODE_ENV === 'production' ? 'prod' : 'dev'

            const key = prepend + crypto.randomBytes(apiKeyLength - prepend.length).toString('hex')
            const keyHashEncrypted = await apiKeyHashAndEncrypt(key)

            const apiKey = await prisma.apiKey.create({
                data: {
                    keyHashEncrypted,
                    name: data.name,
                    active: true,
                },
                select: apiFilterSelection,
            })
            return { ...apiKey, key: encodeApiKey({ key, id: apiKey.id }) }
        }
    }),
    read: defineOperation({
        authorizer: () => apiKeyAuthers.read.dynamicFields({}),
        paramsSchema: z.union([z.object({ id: z.number() }), z.object({ name: z.string() })]),
        operation: async ({ prisma, params }): Promise<ApiKeyFiltered> => {
            const apiKey = await prisma.apiKey.findUnique({
                where: {
                    id: 'id' in params ? params.id : undefined,
                    name: 'name' in params ? params.name : undefined,
                },
                select: apiFilterSelection,
            })

            if (!apiKey) throw new ServerError('BAD PARAMETERS', 'Api key does not exist')
            return {
                ...apiKey,
                ...await updateIfExpired({
                    params: apiKey,
                    bypassAuth: true,
                })
            }
        }
    }),
    readMany: defineOperation({
        authorizer: () => apiKeyAuthers.readMany.dynamicFields({}),
        operation: async ({ prisma }): Promise<ApiKeyFiltered[]> => {
            const apiKeys = await prisma.apiKey.findMany({
                select: apiFilterSelection,
                orderBy: [
                    { active: 'desc' },
                    { name: 'asc' }
                ]
            })

            return await Promise.all(apiKeys.map(async apiKey => ({
                ...apiKey,
                ...await updateIfExpired({
                    params: apiKey,
                    bypassAuth: true,
                })
            })))
        }
    }),
    readWithHash: defineOperation({
        authorizer: () => apiKeyAuthers.readWithHash.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        operation: async ({ prisma, params }) => {
            const apiKey = await prisma.apiKey.findUniqueOrThrow({
                where: { id: params.id },
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
                ...await updateIfExpired({
                    params: apiKey,
                    bypassAuth: true,
                }),
            }
        }
    }),
    update: defineOperation({
        authorizer: () => apiKeyAuthers.update.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: apiKeySchemas.update,
        operation: async ({ prisma, params, data }) => {
            if (data.active && data.expiresAt && data.expiresAt < new Date()) {
                throw new ServerError('BAD PARAMETERS', 'Hvis du vil aktivere en nøkkel, kan den ikke ha utløpt')
            }

            const { name } = await prisma.apiKey.update({
                where: { id: params.id },
                data,
            })
            return { name }
        },
    }),
    destroy: defineOperation({
        authorizer: () => apiKeyAuthers.destroy.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        opensTransaction: true,
        operation: async ({ prisma, params }): Promise<void> => {
            await prisma.$transaction(async (tx) => {
                const apiKey = await tx.apiKey.findUniqueOrThrow({
                    where: { id: params.id },
                    select: { active: true }
                })

                if (apiKey.active) {
                    throw new ServerError('BAD PARAMETERS', 'Du kan ikke slette en aktiv nøkkel - deaktiver den først')
                }

                await tx.apiKey.delete({
                    where: { id: params.id }
                })
            })
        }
    }),
}
