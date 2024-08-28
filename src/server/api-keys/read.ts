import 'server-only'
import { apiKeyFilterSelection } from './ConfigVars'
import { ServerError } from '@/server/error'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { ApiKeyFiltered } from './Types'

export async function readApiKeys(): Promise<ApiKeyFiltered[]> {
    return await prismaCall(() =>
        prisma.apiKey.findMany({
            select: apiKeyFilterSelection
        })
    )
}

export async function readApiKey(id: number): Promise<ApiKeyFiltered> {
    const apiKey = await prismaCall(() =>
        prisma.apiKey.findUnique({
            where: {
                id
            },
            select: apiKeyFilterSelection
        })
    )
    if (!apiKey) throw new ServerError('BAD PARAMETERS', 'Api key does not exist')
    return apiKey
}
