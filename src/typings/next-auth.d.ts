import type { UserWithPermissions } from '@/auth'
import 'next-auth'
import 'next-auth/adapters'

declare module 'next-auth' {
    interface User extends UserWithPermissions {id: number}

    interface Session {
        user: UserWithPermissions
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        user: UserWithPermissions
    }
}

