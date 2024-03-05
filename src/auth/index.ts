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


export type UserWithPermissions = User & {
    permissions: Permission[]
}

type GetUserArgsType<R extends boolean = boolean> = {
    requiredPermissions?: Permission[] | undefined,
    required?: R,
    redirectUrl?: string,
    returnUrl?: string,
}

type GetUserReturnTypeSafe = {
    user: UserWithPermissions,
    status: 'AUTHORIZED',
}

type GetUserReturnTypeUnsafe = GetUserReturnTypeSafe | {
    user: null,
    status: 'UNAUTHENTICATED',
} | {
    user: UserWithPermissions,
    status: 'UNAUTHORIZED',
}

export type AuthStatus = GetUserReturnTypeUnsafe['status']

/**
 * Returns the user object from the current session. If there is no session or the
 * user does not have adequate permissions `null` is returned. Except if `required`
 * is true, then the user gets redirected.
 *
 * This function is for server side components and actions. For client side
 * components use `useUser`.
 *
 * @param requiredPermissions - A list of permissions that the user must have.
 * @param required - Wheter or not to redirect the user if user is not authorized.
 * @param redirectUrl - The url to redirect the user to, by default to 404 page.
 * @param returnUrl - If set, the user is redirected to the login page and then back to the given url.
 *
 * @returns The user object and auth status (either `AUTHORIZED`, `UNAUTHENTICATED`, or `UNAUTHORIZED`).
 */
// This function is overloaded to get correct typing for when required is set to true or false.
export async function getUser(args: GetUserArgsType<false>): Promise<GetUserReturnTypeSafe>
export async function getUser(args: GetUserArgsType<true>): Promise<GetUserReturnTypeSafe>
export async function getUser({
    requiredPermissions,
    required,
    redirectUrl,
    returnUrl,
}: GetUserArgsType = {}) {
    const user = (await getServerSession(authOptions))?.user ?? null

    const authorized = user && (!requiredPermissions || !requiredPermissions.every(permission => user.permissions.includes(permission)))

    if (authorized) {
        return { user, status: 'AUTHORIZED' }
    }

    if (required !== true) {
        return { status: 'UNAUTHENTICATED', user: null }
    }

    if (!user && returnUrl) {
        redirect(`/login?callbackUrl=${encodeURI(returnUrl)}`)
    }

    if (redirectUrl) {
        redirect(redirectUrl)
    }

    notFound() // Should probably redirect to a unauthorized page when we have one
}
