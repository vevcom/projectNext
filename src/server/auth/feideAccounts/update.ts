import 'server-only'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import { readJWTPayload } from '@/auth/jwtClient'
import { ServerError } from '@/server/error'
import type { Account } from 'next-auth'

export async function updateFeideAccount(
    accountId: string,
    account: Account,
): Promise<boolean> {
    if (account.provider !== 'feide') {
        throw new ServerError('UNKNOWN ERROR', 'Tried to update feide account with data for a non feide account.')
    }

    if (!account.expires_at || !account.access_token || !account.id_token) {
        throw new Error('Missing required fields in account')
    }

    const tokenData = readJWTPayload(account.id_token)

    const accessToken = account.access_token
    const expiresAt = new Date(account.expires_at * 1000)
    const issuedAt = new Date(tokenData.iat * 1000)

    await prismaCall(() => prisma.feideAccount.update({
        where: {
            id: accountId
        },
        data: {
            accessToken,
            expiresAt,
            issuedAt,
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
