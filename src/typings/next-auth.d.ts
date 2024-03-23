import 'next-auth'
import 'next-auth/adapters'

import type { AdapterUserCustom, ExtendedFeideUser } from '@/auth/feide/Types'
import type { FeideAccount } from '@/prisma/client'
import type { BasicMembership } from '@/server/groups/Types'
import type { Permission } from '@prisma/client'
import type { UserFiltered } from '@/server/users/Types'

declare module 'next-auth' {
    interface User {
        id: number | string,
    }

    interface Session {
        user: UserFiltered,
        permissions: Permission[],
        memberships: BasicMembership[],
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
