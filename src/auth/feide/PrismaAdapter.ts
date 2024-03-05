import 'server-only'
import { getAdapterUserByFeideAccount, createFeideAccount } from './index'
import { adapterUserCutomFields } from './Types'
import type { AdapterUserCustom } from './Types'
import type { Adapter, AdapterUser, AdapterAccount } from 'next-auth/adapters'
import type { PrismaClient } from '@prisma/client'

function addALotOfFrustrationWithNextAuth(user: AdapterUserCustom): AdapterUser {
    return {
        ...user,
        emailVerified: null,
        id: String(user.id)
    }
}

function HS_MAA_GAA(user: AdapterUserCustom | null | undefined): AdapterUser | null {
    if (user === null || user === undefined) {
        return null
    }
    return addALotOfFrustrationWithNextAuth(user)
}

async function generateUsername(prisma: PrismaClient, user: Omit<AdapterUser, 'id'>): Promise<string> {
    const results = await prisma.user.findMany({
        where: {
            username: {
                startsWith: user.username

            }
        }
    })

    const existingUsernames = new Set(results.map(dbuser => dbuser.username))
    let username = user.username

    if (!existingUsernames.has(username)) {
        return username
    }

    const lastlastname = user.lastname.toLowerCase().split(' ').pop() || ''

    // Find overlap in lastlastname
    let overlap = 0
    for (let i = lastlastname.length; i >= 1; i--) {
        if (username.slice(-i) === lastlastname.slice(0, i)) {
            overlap = i
            break
        }
    }

    for (let i = overlap + 1; i <= lastlastname.length; i++) {
        username = `${user.username}${lastlastname.slice(overlap, i)}`
        if (!existingUsernames.has(username)) {
            return username
        }
    }

    // No overlap in lastname
    // Add a number to the end
    for (let i = 1; !existingUsernames.has(username); i++) {
        username = `${user.username}${i}`
    }

    return username
}

export default function PrismaAdapter(prisma: PrismaClient): Adapter {
    return {
        async createUser(user: Omit<AdapterUser, 'id'>): Promise<AdapterUser> {
            const username = await generateUsername(prisma, user)
            const ret = await prisma.user.create({
                data: {
                    username,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                },
                select: adapterUserCutomFields
            })

            return addALotOfFrustrationWithNextAuth(ret)
        },

        async getUser(id: string | number): Promise<AdapterUser | null> {
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(id)
                },
                select: adapterUserCutomFields
            })

            return HS_MAA_GAA(user)
        },

        async getUserByEmail(email: string): Promise<AdapterUser | null> {
            const user = await prisma.user.findUnique({
                where: {
                    email
                },
                select: adapterUserCutomFields
            })
            const ret = HS_MAA_GAA(user)
            console.log(ret)
            return ret
        },

        async getUserByAccount({
            providerAccountId,
            provider
        }: {
            providerAccountId: string,
            provider: string
        }): Promise<AdapterUser | null> {
            if (provider !== 'feide') {
                console.log(provider)
                throw new Error('Unsupported provider')
            }

            const user = await getAdapterUserByFeideAccount(providerAccountId)

            if (!user.success) {
                return null
            }

            const ret = HS_MAA_GAA(user.data)
            return ret
        },

        async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>): Promise<AdapterUser> {
            const ret = await prisma.user.findUnique({
                where: {
                    id: Number(user.id)
                },
                select: adapterUserCutomFields
            })

            return HS_MAA_GAA(ret) as AdapterUser
        },
        async linkAccount(account: AdapterAccount): Promise<void> {
            if (!account.access_token || !account.expires_at) {
                throw Error('Missing required fields in account')
            }

            await createFeideAccount({
                id: account.providerAccountId,
                accessToken: account.access_token,
                expiresAt: new Date(account.expires_at * 1000),
                issuedAt: new Date(),
                userId: Number(account.userId),
            })
        },
        async deleteUser() {
            throw Error('Delete user from next uath is not implemented')
        },
        async unlinkAccount() {
            throw Error('Unlink account from next auth is not implemented')
        },
        async createSession() {
            throw Error('Create session from next auth is not implemented')
        },
        async getSessionAndUser() {
            throw Error('Get session and user from next auth is not implemented')
        },
        async updateSession() {
            throw Error('Update session from next auth is not implemented')
        },
        async deleteSession() {
            throw Error('Delete session from next auth is not implemented')
        },
        async createVerificationToken() {
            throw Error('Create verification token from next auth is not implemented')
        },
        async useVerificationToken() {
            throw Error('Use verification token from next auth is not implemented')
        },
    }
}
