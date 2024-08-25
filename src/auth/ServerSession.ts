import { getServerSession as getServerSessionNextAuth } from 'next-auth'
import { authOptions } from './authoptions'
import type { Permission } from '@prisma/client'
import { readDefaultPermissions } from '@/server/permissionRoles/read'
import type { UserFiltered } from '@/server/users/Types'
//TODO: Import this type
type MembershipFiltered = {
    
}

export type UserGuaranteeOption = 'HAS_USER' | 'MAYBE_USER' | 'NO_USER'

type Session<UserGuarantee extends UserGuaranteeOption> = {
    user: UserGuarantee extends 'HAS_USER' ? UserFiltered : (
        UserGuarantee extends 'MAYBE_USER' ? UserFiltered | null : (
        UserGuarantee extends 'NO_USER' ? null : never
        )
    ),
    permissions: Permission[],
    memberships: MembershipFiltered[], 
}

export class ServerSession<UserGuarantee extends UserGuaranteeOption> {
    private session: Session<UserGuarantee> 
    
    private constructor(session: Session<UserGuarantee>) {
        this.session = session
    }

    public get user() {
        return this.session.user
    }

    public get permissions() {
        return this.session.permissions
    }

    public get memberships() {
        return this.session.memberships
    }

    public static async current(): Promise<ServerSession<'MAYBE_USER'>> {
        const {
            user = null,
            permissions = await readDefaultPermissions(),
            memberships = [],
        } = await getServerSessionNextAuth(authOptions) ?? {}
        return new ServerSession({user, permissions, memberships})
    }

    public auth(auth) {

    }
}