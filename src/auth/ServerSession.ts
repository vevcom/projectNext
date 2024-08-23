import { getServerSession as getServerSessionNextAuth } from 'next-auth'
import { authOptions } from './authoptions'
import type { Permission } from '@prisma/client'
import { readDefaultPermissions } from '@/server/permissionRoles/read'
import type { UserFiltered } from '@/server/users/Types'
//TODO: Import this type
type MembershipFiltered = {
    
}

type Session<UserGuarantee extends 'HAS_USER' | 'MAYBE_USER' | 'NO_USER'> = {
    user: UserGuarantee extends 'HAS_USER' ? UserFiltered : (
        UserGuarantee extends 'MAYBE_USER' ? UserFiltered | null : (
        UserGuarantee extends 'NO_USER' ? null : never
        )
    ),
    permissions: Permission[],
    memberships: MembershipFiltered[], 
}

export class ServerSession {
    private session: Session<'MAYBE_USER'> 
    
    private constructor(session: Session<'MAYBE_USER'>) {
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

    public static async currentSession(): Promise<ServerSession> {
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