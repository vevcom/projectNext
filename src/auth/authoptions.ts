import FeideProvider from './feide/FeideProvider'
import PrismaAdapter from './feide/PrismaAdapter'
import signUp from './feide/signUp'
import { updateFeideAccount } from './feide/index'
import prisma from '@/prisma'
import { readPermissionsOfUser } from '@/server/rolePermissions/read'
import CredentialsProvider from 'next-auth/providers/credentials'
import { decode } from 'next-auth/jwt'
import type { JWT } from 'next-auth/jwt'
import type { AuthOptions, Profile, User as nextAuthUser } from 'next-auth'
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
