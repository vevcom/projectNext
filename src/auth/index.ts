import FeideProvider from './feide/FeideProvider'
import PrismaAdapter from './feide/PrismaAdapter'
import signUp from './feide/signUp'
import { updateFeideAccount } from './feide/index'
import prisma from '@/prisma'
import { readPermissionsOfUser } from '@/actions/permissions/read'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getServerSession } from 'next-auth'
import { notFound, redirect } from 'next/navigation'
import { decode } from 'next-auth/jwt'
import type { JWT } from 'next-auth/jwt'
import type { AuthOptions, Profile, User as nextAuthUser } from 'next-auth'
import type { Permission, User } from '@prisma/client'
import type { ExtendedFeideUser } from './feide/Types'

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

                // Sign in with email insted of username

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
        }),
        FeideProvider({
            clientId: process.env.FEIDE_CLIENT_ID ?? 'no_id',
            clientSecret: process.env.FEIDE_CLIENT_SECRET ?? 'no_secret',
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

            if (credentials === null) {
                const hasFeide = await prisma.feideAccount.findUnique({
                    where: {
                        userId: token.user.id
                    },
                    select: {
                        userId: true
                    }
                })

                if (hasFeide) {
                    return token
                }
            }

            // Check if the users credentials were updated after the token was
            // created. I.e. if the user updates their password you don't want
            // their old token to be valid. 'iat' is given in seconds so we
            // have to convert it to milliseconds.
            // Add 10 seconds to get time to login after a credentials update
            if (!credentials || token.iat * 1000 < credentials.credentialsUpdatedAt.getTime() - 10000) return null

            return token
        },
    },
    callbacks: {
        async session({ session, token }) {
            session.user = token.user
            return session
        },
        async jwt({
            token,
            user,
            trigger,
            profile
        }: {
            token: JWT,
            user: nextAuthUser,
            trigger?: 'update' | 'signIn' | 'signUp',
            profile?: Profile,
        }) {
            if (!trigger) {
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

            if (trigger === 'signUp') {
                token.email = undefined
                user.id = Number(user.id)
                if (!profile || !profile.sub) {
                    throw Error('No profile found when signing up')
                }
                signUp({ user, profile } as {user: nextAuthUser, profile: ExtendedFeideUser})
            }

            // Check if user logged in with feide
            if (trigger === 'signIn' && profile?.sub) {
                updateFeideAccount(profile.sub, profile.tokens)
            }

            // The 'user' object will only be set when the trigger is 'signIn'.
            // We also have to type guard 'user.id' because the default next
            // auth type for it is different from our model.
            const userId = user ? Number(user.id) : token?.user.id

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
        }
    },
    pages: {
        signIn: '/login',
        signOut: '/logout',
        newUser: '/register'
    },
    adapter: PrismaAdapter(prisma),
}


export type UserWithPermissions = Omit<User, 'id'> & {
    id: number,
    permissions: Permission[]
}

type GetUserArgsType<R extends boolean = boolean> = {
    requiredPermissions?: Permission[] | undefined,
    required?: R,
    redirectUrl?: string,
    returnUrl?: string,
}

type RequiredGetUserReturnType = {
    user: UserWithPermissions,
    authorized: true,
    status: 'AUTHORIZED',
}

type GetUserReturnType = RequiredGetUserReturnType | {
    user: null,
    authorized: false,
    status: 'UNAUTHENTICATED',
} | {
    user: UserWithPermissions,
    authorized: false,
    status: 'UNAUTHORIZED',
}

export type AuthStatus = GetUserReturnType['status']

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
export async function getUser(args?: GetUserArgsType<false>): Promise<GetUserReturnType>
export async function getUser(args?: GetUserArgsType<true>): Promise<RequiredGetUserReturnType>
export async function getUser({
    requiredPermissions,
    required,
    redirectUrl,
    returnUrl,
}: GetUserArgsType = {}): Promise<GetUserReturnType> {
    const user = (await getServerSession(authOptions))?.user ?? null

    if (
        user && // Check if user is authenticated...
        (
            !requiredPermissions || // ...and if the user has all the required permissions (if any are given).
            requiredPermissions.every(permission => user.permissions.includes(permission))
        )
    ) {
        return { user, authorized: true, status: 'AUTHORIZED' }
    }

    if (required) {
        if (!user && returnUrl) {
            redirect(`/login?callbackUrl=${encodeURI(returnUrl)}`)
        }

        if (redirectUrl) {
            redirect(redirectUrl)
        }

        notFound() // Should probably redirect to an unauthorized page when we have one.
    }

    // Cannot have ternary expression for just status because then ts gets confused.
    return user
        ? { user, authorized: false, status: 'UNAUTHORIZED' }
        : { user, authorized: false, status: 'UNAUTHENTICATED' }
}
