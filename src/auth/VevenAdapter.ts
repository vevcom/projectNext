import '@pn-server-only'
import { readJWTPayload } from '@/jwt/jwtReadUnsecure'
import { createFeideAccount } from '@/services/auth/feideAccounts/create'
import { readUserOrNullOfFeideAccount } from '@/services/auth/feideAccounts/read'
import { userOperations } from '@/services/users/operations'
import { userFilterSelection } from '@/services/users/constants'
import type { UserFiltered } from '@/services/users/Types'
import type { PrismaClient } from '@prisma/client'
import type { Adapter, AdapterUser, AdapterAccount } from 'next-auth/adapters'

/**
 * Utility function for converting a user object to
 * be compatible with next auths `AdapterUser` type.
 *
 * @param user - User of the type used in veven.
 * @returns User object of the type `AdapterUser`.
 */
function convertToAdapterUser(user: UserFiltered): AdapterUser {
    return {
        ...user,
        id: String(user.id),
    }
}

/**
 * Utility function for generating a unique username for a user based on apreferred username.
 * This function will return the preferred username if it's not taken.
 * If the username is taken it will use the users lastname to make the username unique.
 * If the username is still not unique it will add a number to the end.
 *
 * @param prisma - Prisma client to use for connecting to to the db.
 * @param preferredUsername - The preffered username.
 * @param lastname - Lastname of the user.
 * @returns A username guaranteed to be unique in the db.
 */
async function generateUsername(prisma: PrismaClient, preferredUsername: string, lastname: string): Promise<string> {
    const results = await prisma.user.findMany({
        where: {
            username: {
                startsWith: preferredUsername
            }
        },
        select: {
            username: true
        }
    })

    const existingUsernames = new Set(results.map(dbuser => dbuser.username))
    let username = preferredUsername

    if (!existingUsernames.has(username)) {
        return username
    }

    const lastlastname = lastname.toLowerCase().split(' ').pop() || ''

    // Find overlap in lastlastname
    let overlap = 0
    for (let i = lastlastname.length; i >= 1; i--) {
        if (username.slice(-i) === lastlastname.slice(0, i)) {
            overlap = i
            break
        }
    }

    for (let i = overlap; i < lastlastname.length; i++) {
        username = `${username}${lastlastname[i]}`
        if (!existingUsernames.has(username)) {
            return username
        }
    }

    // No overlap in lastname
    // Add a number to the end
    for (let i = 1; !existingUsernames.has(username); i++) {
        username = `${username}${i}`
    }

    return username
}

export default function VevenAdapter(prisma: PrismaClient): Adapter {
    return {
        async createUser(user: AdapterUser) {
            if (!user.username || !user.firstname || !user.lastname) {
                throw new Error()
            }

            const username = await generateUsername(prisma, user.username, user.lastname)

            const createdUser = await prisma.user.create({
                data: {
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    username,
                    emailVerified: null,
                },
                select: userFilterSelection,
            })

            return convertToAdapterUser(createdUser)
        },

        async getUser(id) {
            console.log('get id')

            const user = await userOperations.readOrNull({
                params: { id: Number(id) },
                bypassAuth: true,
            })

            return user && convertToAdapterUser(user)
        },

        async getUserByEmail(email) {
            console.log('get email')
            console.log(email)
            const user = await userOperations.readOrNull({
                params: { email },
                bypassAuth: true,
            })

            if (user) {
                return convertToAdapterUser(user)
            }

            const account = await prisma.feideAccount.findUnique({
                where: {
                    email,
                },
                include: {
                    user: {
                        select: userFilterSelection,
                    },
                },
            })
            if (!account) return null

            return convertToAdapterUser(account.user)
        },

        async getUserByAccount({ providerAccountId, provider }) {
            console.log('get account')

            if (provider !== 'feide') {
                throw new Error('Unsupported provider')
            }

            const user = await readUserOrNullOfFeideAccount(providerAccountId)

            return user && convertToAdapterUser(user)
        },

        async updateUser(user) {
            console.log('update u')

            const updatedUser = await prisma.user.update({
                where: {
                    id: Number(user.id),
                },
                data: {
                    firstname: user.firstname,
                    lastname: user.lastname,
                },
                select: userFilterSelection,
            })

            return convertToAdapterUser(updatedUser)
        },

        async linkAccount(account: AdapterAccount) {
            console.log('link acc')

            if (!account.access_token || !account.expires_at || !account.id_token) {
                throw new Error('Missing required fields in account')
            }

            const tokenData = readJWTPayload<{ email: string }>(account.id_token)

            await createFeideAccount({
                id: account.providerAccountId,
                accessToken: account.access_token,
                expiresAt: new Date(account.expires_at * 1000),
                issuedAt: new Date(tokenData.iat * 1000),
                userId: Number(account.userId),
                email: tokenData.email,
            })
        },
        async deleteUser() {
            throw new Error('Delete user from next auth is not implemented')
        },
        async unlinkAccount() {
            throw new Error('Unlink account from next auth is not implemented')
        },
        async createSession() {
            throw new Error('Create session from next auth is not implemented')
        },
        async getSessionAndUser() {
            throw new Error('Get session and user from next auth is not implemented')
        },
        async updateSession() {
            throw new Error('Update session from next auth is not implemented')
        },
        async deleteSession() {
            throw new Error('Delete session from next auth is not implemented')
        },
        async createVerificationToken() {
            throw new Error('Create verification token from next auth is not implemented')
        },
        async useVerificationToken() {
            throw new Error('Use verification token from next auth is not implemented')
        },
    }
}
