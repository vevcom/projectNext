import type { UserWithPermissions } from '@/auth'

import 'next-auth'
import 'next-auth/adapters'

import { AdapterUserCustom } from '@/auth/feide/Types'
import { FeideAccount } from '@/prisma/client'

declare module 'next-auth' {

    interface User {
        id: number,
    }

    interface Session {
        user: UserWithPermissions,
    }
}

declare module 'next-auth/adapters' {
    interface AdapterUser extends AdapterUserCustom {}
    interface AdapterAccount extends FeideAccount {}
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
