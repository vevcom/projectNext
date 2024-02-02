import prisma from '@/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { AuthOptions, getServerSession } from 'next-auth'
import { notFound, redirect } from 'next/navigation'

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            authorize: async (credentials) => {
                const user = await prisma.user.findUnique({
                    where: {
                        username: credentials?.username
                    }
                })
                // TODO - faktisk gjør encryption, legg til hashing på POST
                if (user?.password === credentials?.password) {
                    if (typeof user?.id === 'number') {
                        return { ...user }
                    }
                }
                return null
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
            if (typeof user?.id === 'number' && user?.email) {
                token.user = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    firstname: user.firstname,
                    lastname: user.lastname
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

/**
 * Returns the user object from the current session. If there is no session
 * ```null``` is returned.
 *
 * This function is for server side components and actions. For client side
 * components use ```useUser```.
 */
export async function getUser() {
    const session = await getServerSession(authOptions)

    return session?.user ?? null
}

type RequireUserArgsType = {
    returnUrl?: string | null,
    redirectUrl?: string | null,
}

/**
 * Gets user in the same way as ```getUser```, but redirects when the user is not
 * logged in.
 *
 * This function is for server side components. For client side components
 * use ```useUser```. For actions use ```getUser```.
 */
export async function requireUser({ returnUrl = null, redirectUrl = null }: RequireUserArgsType) {
    const user = await getUser()

    if (user === null) {
        if (returnUrl !== null) redirect(`/login?callbackUrl=${returnUrl}`)

        if (redirectUrl !== null) redirect(redirectUrl)

        notFound()
    }

    return user
}
