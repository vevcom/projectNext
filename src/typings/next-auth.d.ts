import 'next-auth'
import 'next-auth/adapters'

import type { MembershipFiltered } from '@/server/groups/Types'
import type { Permission } from '@prisma/client'
import type { UserFiltered } from '@/server/users/Types'

declare module 'next-auth' {
    interface User extends Partial<UserFiltered> {}

    interface Session {
        user: UserFiltered,
        permissions: Permission[],
        memberships: MembershipFiltered[],
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        provider: 'credentials' | 'feide',
        user: UserFiltered,
        permissions: Permission[],
        memberships: MembershipFiltered[],

        // The standard JWT payload is hidden by next auth. To get correct
        // type hinting we need to declare the properties we wish to
        // access. Currently we only need to use iat (issued at).
        //
        // See https://www.rfc-editor.org/rfc/rfc7519#section-4.1 for the
        // JWT payload specification.
        iat?: number,
    }
}
