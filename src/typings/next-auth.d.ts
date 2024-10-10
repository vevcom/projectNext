import 'next-auth'
import 'next-auth/adapters'

import type { MembershipFiltered } from '@/services/groups/Types'
import type { Permission } from '@prisma/client'
import type { UserFiltered } from '@/services/users/Types'

declare module 'next-auth' {
    // Normally we dissallow typing with empty objects, but in this case we
    // need to extend the User object with additional properties. The User
    // object is defined in next-auth, and we need to extend it with the
    // properties from UserFiltered. So for this case we allow it.
    //
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
