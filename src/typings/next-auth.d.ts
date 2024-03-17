import type { ExpandedUser } from '@/auth/user'

import 'next-auth'
import 'next-auth/adapters'

import type { AdapterUserCustom, ExtendedFeideUser } from '@/auth/feide/Types'
import type { FeideAccount } from '@/prisma/client'

declare module 'next-auth' {

    interface User {
        id: number | string,
    }

    interface Session {
        user: ExpandedUser,
    }

    interface Profile extends ExtendedFeideUser {
        sub: string,
    }
}

declare module 'next-auth/adapters' {
    interface AdapterUser extends AdapterUserCustom {}
    interface AdapterAccount extends FeideAccount {}
}

declare module 'next-auth/jwt' {
    interface JWT {
        user: ExpandedUser,

        // The standard JWT payload is hidden by next auth. To get correct
        // type hinting we need to declare the properties we wish to
        // access. Currently we only need to use iat (issued at).
        //
        // See https://www.rfc-editor.org/rfc/rfc7519#section-4.1 for the
        // JWT payload specification.
        iat?: number,
    }
}
