import CredentialsProvider from "next-auth/providers/credentials"

import prisma from "@/prisma"

const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const user = await prisma.user.findUnique({
                    where: {
                        username: credentials.username
                    }
                })
                
                // TODO - faktisk gjør encryption
                return user?.password === credentials.password ? user : null
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
                token.user = user;
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