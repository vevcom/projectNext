import 'server-only'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { adapterUserCutomFields } from '@/auth/feide/Types'
import type { TokenSetParameters } from 'openid-client'
import type { FeideAccount } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { AdapterUserCustom } from '@/auth/feide/Types'

export async function updateFeideAccount(
    accountId: string,
    token: TokenSetParameters,
): Promise<ActionReturn<boolean>> {
    try {
        const expiresAt = token.expires_at ? new Date(token.expires_at * 1000) : new Date()
        if (!token.expires_at || !token.access_token || !token.id_token) {
            throw new Error('Missing required fields in token')
        }

        const tokenData = readJWTPayload(token.id_token)

        await prisma.feideAccount.update({
            where: {
                id: accountId
            },
            data: {
                accessToken: token.access_token,
                expiresAt,
                issuedAt: new Date(tokenData.iat * 1000),
            }
        })

        // TODO: If the query fails maybe the user is not connected to feide account

        return { success: true, data: true }
    } catch (error) {
        return errorHandler(error)
    }
}

export async function updateEmailForFeideAccount(accountId: string, email: string): Promise<ActionReturn<boolean>> {
    try {
        await prisma.feideAccount.update({
            where: {
                id: accountId
            },
            data: {
                email
            }
        })

        return { success: true, data: true }
    } catch (error) {
        return errorHandler(error)
    }
}

export async function createFeideAccount({
    id,
    accessToken,
    expiresAt,
    issuedAt,
    userId,
    email,
}: FeideAccount): Promise<ActionReturn<FeideAccount>> {
    try {
        const ret = await prisma.feideAccount.create({
            data: {
                id,
                accessToken,
                expiresAt,
                issuedAt,
                email,
                user: {
                    connect: {
                        id: userId,
                    },
                }
            }
        })

        return { success: true, data: ret }
    } catch (e) {
        return errorHandler(e)
    }
}

export async function getAdapterUserByFeideAccount(feideId: string): Promise<ActionReturn<AdapterUserCustom | null>> {
    try {
        const account = await prisma.feideAccount.findUnique({
            where: {
                id: feideId
            },
            select: {
                user: {
                    select: adapterUserCutomFields
                }
            }
        })

        if (account === null) {
            return { success: false, error: [{ message: 'Account not found' }] }
        }

        return { success: true, data: account.user }
    } catch (e) {
        return errorHandler(e)
    }
}

export function readJWTPayload(jwt: string) : {
    iss: string,
    jti: string,
    aud: string,
    sub: string,
    iat: number,
    exp: number,
    email: string,
    name: string
} {
    const parts = jwt.split('.')
    const payload = Buffer.from(parts[1], 'base64').toString('utf-8')
    return JSON.parse(payload)
}