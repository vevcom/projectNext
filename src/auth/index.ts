import prisma from '@/prisma'
import { readPermissionsOfUser } from '@/actions/permissions/read'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getServerSession } from 'next-auth'
import { notFound, redirect } from 'next/navigation'
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
                // Dette burde være en action
                const user = await prisma.user.findUnique({
                    where: {
                        username: credentials?.username
                    }
                })

                if (!user) return null

                // TODO - faktisk gjør encryption, legg til hashing på POST
                if (user.password !== credentials?.password) return null

                const permissionsRes = await readPermissionsOfUser(user.id)

                if (!permissionsRes.success) return null

                return {
                    ...user,
                    permissions: permissionsRes.data
                }
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async session({ session, token }) {
            session.user = token.user
            return session
        },
        async jwt({ token, user }) {
            // The user object is only set when the token is created upon
            // login. 
            //
            // We also need type guarding for user.id and user.email
            // because the default next auth types are different from our
            // prisma model.
            if (user && typeof user.id === 'number' && user.email) {
                // Here we have to manually type out all the properties of
                // the user object because typescript doesn't recognize
                // the typeguard for some reason
                token.user = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    permissions: user.permissions,
                }
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
