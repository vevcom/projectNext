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
                console.log("AUTORIZE!!")

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
            console.log("SESSION")
            session.user = token.user;
            return session;
        },
        async jwt({ token, user }) {
            console.log("JWT")
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