import type { User as prismaUser } from '@prisma/client'
import 'next-auth'
import 'next-auth/adapters'

declare module 'next-auth' {
    interface User extends prismaUser {id: number}

    interface Session {
        user: prismaUser;
    }
}
declare module 'next-auth/jwt' {
    interface JWT {
        user: prismaUser
    }
}

