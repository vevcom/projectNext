import 'server-only'
import { apiKeyFilterSelection } from './ConfigVars'
import { updateApiKeyIfExpired } from './update'
import { ServerError } from '@/services/error'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import type { ApiKeyFiltered } from './Types'


export async function readApiKeys(): Promise<ApiKeyFiltered[]> {
    const apiKeys = await prismaCall(() =>
        prisma.apiKey.findMany({
            select: apiKeyFilterSelection,
            orderBy: [
                { active: 'desc' },
                { name: 'asc' }
            ]
        })
    )
    return await Promise.all(apiKeys.map(updateApiKeyIfExpired))
}

export async function readApiKey(idOrName: number | string): Promise<ApiKeyFiltered> {
    const apiKey = await prismaCall(() =>
        prisma.apiKey.findUnique({
            where: {
                id: typeof idOrName === 'number' ? idOrName : undefined,
                name: typeof idOrName === 'string' ? idOrName : undefined
            },
            select: apiKeyFilterSelection
        })
    )
    if (!apiKey) throw new ServerError('BAD PARAMETERS', 'Api key does not exist')
    return updateApiKeyIfExpired(apiKey)
}