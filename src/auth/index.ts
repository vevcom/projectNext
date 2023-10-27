import CredentialsProvider from "next-auth/providers/credentials"
import { AuthOptions, User } from "next-auth"

import prisma from "@/prisma"
import { use } from "react"

const authOptions : AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials, req) => {
                const user = await prisma.user.findUnique({
                    where: {
                        username: credentials?.username
                    }
                })
                // TODO - faktisk gjør encryption, legg til hashing på POST
                if (user?.password === credentials?.password) {
                    if (typeof user?.id == 'number') {
                        return {...user}
                    }
                }
                return null
            }
        })        
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async session({ session, token }) {
            session.user = token.user;
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.user = user
            }
            return token;
        },
    },
    pages: {
        signIn: '/login',
        signOut: '/logout'   
    }
}

export default authOptions