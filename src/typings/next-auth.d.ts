import type { UserWithPermissions } from '@/auth'

import 'next-auth'
import 'next-auth/adapters'

import type { User as PrismaUser } from '@prisma/client'
import { nextAuthUserFields } from '@/auth/feide/Types'

declare module 'next-auth' {

    interface User {
        id: number,
    }

    interface Session {
        user: UserWithPermissions,
    }
}

declare module 'next-auth/adapters' {
    interface AdapterUser extends Pick<PrismaUser, typeof nextAuthUserFields[number]> {}
}

declare module 'next-auth/jwt' {
    interface JWT {
        user: UserWithPermissions,

        // The standard JWT payload is hidden by next auth. To get correct
        // type hinting we need to declare the properties we wish to
        // access. Currently we only need to use iat (issued at).
        //
        // See https://www.rfc-editor.org/rfc/rfc7519#section-4.1 for the
        // JWT payload specification.
        iat?: number,
    }
}
