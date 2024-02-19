import type { User as PrismaUser } from '@prisma/client'
import 'next-auth'
import 'next-auth/adapters'

declare module 'next-auth' {
    interface User extends PrismaUser {id: number}

    interface Session {
        user: PrismaUser;
    }
}
declare module 'next-auth/jwt' {
    interface JWT {
        user: PrismaUser
    }
}

