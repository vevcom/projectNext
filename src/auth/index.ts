import prisma from '@/prisma'
import { readPermissionsOfUser } from '@/actions/permissions/read'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getServerSession } from 'next-auth'
import { notFound, redirect } from 'next/navigation'
import { decode } from 'next-auth/jwt'
import type { AuthOptions } from 'next-auth'
import type { Permission, User } from '@prisma/client'

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            authorize: async (credentials) => {
                if (!credentials?.username || !credentials.password) return null

                // This should be an action
                const userCredentials = await prisma.credentials.findUnique({
                    where: {
                        username: credentials.username,
                    },
                    select: {
                        userId: true,
                        passwordHash: true,
                    },
                })

                if (!userCredentials) return null

                // TODO - faktisk gjør encryption, legg til hashing på POST
                if (userCredentials.passwordHash !== credentials.password) return null

                return { id: userCredentials.userId }
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    jwt: {
        async decode(params) {
            const token = await decode(params)

            // iat = issued at (timestamp given in seconds since epoch)
            if (!token || !token.iat) return null

            const credentials = await prisma.credentials.findUnique({
                where: {
                    userId: token.user.id
                },
                select: {
                    credentialsUpdatedAt: true
                }
            })

            // Check if the users credentials were updated after the token was
            // created. I.e. if the user updates their password you don't want
            // their old token to be valid. 'iat' is given in seconds so we
            // have to convert it to milliseconds.
            if (!credentials || token.iat * 1000 < credentials.credentialsUpdatedAt.getTime()) return null

            return token
        },
    },
    callbacks: {
        async session({ session, token }) {
            session.user = token.user
            return session
        },
        async jwt({ token, user, trigger }) {
            if (trigger !== 'signIn' && trigger !== 'update') {
                // TODO - refactor when read user action exists
                const dbUser = await prisma.user.findUniqueOrThrow({
                    where: {
                        id: token.user.id,
                    },
                    select: {
                        updatedAt: true,
                    },
                })

                // Check if the user data that is on the jwt was changed
                // after the token was created. If so get new data from db.
                // 'iat' is given in seconds so we have to convert it to
                // milliseconds.
                if (token.iat && token.iat * 1000 > dbUser?.updatedAt.getTime()) {
                    return token
                }
            }

            // The 'user' object will only be set when the trigger is 'signIn'.
            // We also have to type guard 'user.id' because the default next
            // auth type for it is different from our model.
            const userId = user && typeof user.id === 'number' ? user.id : token?.user.id

            // TODO - refactor when read user action exists
            const userInfo = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
            })

            const userPermissions = await readPermissionsOfUser(userId)

            if (!userInfo || !userPermissions.success) throw Error('Could not read user from database when setting jwt')

            token.user = {
                ...userInfo,
                permissions: userPermissions.data
            }

            return token
        },
    },
    pages: {
        signIn: '/login',
        signOut: '/logout'
    }
}

export type AuthStatus = 'unauthenticated' | 'unauthorized' | 'authorized'

export type UserWithPermissions = User & {
    permissions: Permission[]
}

type GetUserArgsType = {
    permissions?: Permission[] | undefined,
}

type GetUserReturnType = {
    user: UserWithPermissions | null,
    status: AuthStatus,
}

/**
 * Returns the user object from the current session. If there is no session or the
 * user does not have adequate permissions `null` is returned.
 *
 * @param permissions - A list of permissions that the user must have.
 *
 * This function is for server side components and actions. For client side
 * components use `useUser`.
 */
export async function getUser({ permissions }: GetUserArgsType = {}): Promise<GetUserReturnType> {
    const user = (await getServerSession(authOptions))?.user

    if (!user) {
        return { user: null, status: 'unauthenticated' }
    }

    // Check if user has all required permissions
    if (permissions && !permissions.every(permission => user.permissions.includes(permission))) {
        return { user: null, status: 'unauthorized' }
    }

    return { user, status: 'authorized' }
}

type RequireUserArgsType = {
    returnUrl?: string | undefined,
    redirectUrl?: string | undefined,
    permissions?: Permission[] | undefined,
}

/**
 * Gets user in the same way as `getUser`, but redirects when the user is not
 * logged in. This function will never return `null`.
 *
 * @param returnUrl - The url to the current page. If set the user will be
 * redirected to a login page for login, and then back after successfull
 * login. Must be set manually because next js doesn't provide a function to
 * retrive the current url of the page on the server side.
 *
 * @param redirectUrl - The url that the user should be redirected to if there
 * is no session and/or if the user doesn't have adequate permissions. If it's
 * not set user will be redirected to a 404.
 *
 * @param permissions - A list of permissions that the user must have.
 *
 * This function is for server side components. For client side components
 * use `useUser`. For actions use `getUser`.
 */
export async function requireUser({
    returnUrl,
    redirectUrl,
    permissions,
}: RequireUserArgsType = {}): Promise<UserWithPermissions> {
    const { user, status } = await getUser({ permissions })

    if (!user) {
        if (status === 'unauthenticated' && typeof returnUrl === 'string') {
            redirect(`/login?callbackUrl=${returnUrl}`)
        }

        if (typeof redirectUrl === 'string') {
            redirect(redirectUrl)
        }

        notFound()
    }

    return user
}
