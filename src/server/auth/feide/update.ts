import 'server-only'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import { readJWTPayload } from '@/auth/jwt'
import type { TokenSetParameters } from 'openid-client'

export async function updateFeideAccount(
    accountId: string,
    token: TokenSetParameters,
): Promise<boolean> {
    const expiresAt = token.expires_at ? new Date(token.expires_at * 1000) : new Date()

    if (!token.expires_at || !token.access_token || !token.id_token) {
        throw new Error('Missing required fields in token')
    }

    const tokenData = readJWTPayload(token.id_token)

    await prismaCall(() => prisma.feideAccount.update({
        where: {
            id: accountId
        },
        data: {
            accessToken: token.access_token,
            expiresAt,
            issuedAt: new Date(tokenData.iat * 1000),
        }
    }))

    // TODO: If the query fails maybe the user is not connected to feide account

    return true
}

export async function updateEmailForFeideAccount(accountId: string, email: string): Promise<void> {
    await prismaCall(() => prisma.feideAccount.update({
        where: {
            id: accountId
        },
        data: {
            email
        }
    }))
}
