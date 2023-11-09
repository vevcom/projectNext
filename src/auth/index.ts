import { notFound, redirect } from 'next/navigation'
import CredentialsProvider from 'next-auth/providers/credentials'
import { AuthOptions, getServerSession } from 'next-auth'

import prisma from '@/prisma'

export const authOptions : AuthOptions = {
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
                    lastname: user.lastname,
                    roles: user.roles
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

export async function getSession() {
    return await getServerSession(authOptions)
}

export async function getUser() {
    return (await getSession())?.user
}

import { getCsrfToken } from 'next-auth/react'
export async function updateSession(newSession: Record<string, any>) {
  await fetch(`/api/auth/session`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      csrfToken: await getCsrfToken(),
      data: newSession,
    }),
  })
}

type authLevelType = {
    roles: string[], 
    permissions: string[],
    commitiees: string[]
}

export async function requireAuth(authLevel: authLevelType, redirectUrl = authOptions.pages?.signIn) {
    const user = await getUser()

    if(!user) {
        redirect(redirectUrl ?? notFound())
    }

    const authorized = user.roles.some(role => authLevel.roles.includes(role))

    if(!authorized) {
        redirect(redirectUrl ?? notFound())
    }
}