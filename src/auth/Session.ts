import { authOptions } from './authoptions'
import { readDefaultPermissions } from '@/services/permissionRoles/read'
import { getServerSession as getSessionNextAuth } from 'next-auth'
import type { Permission } from '@prisma/client'
import type { UserFiltered } from '@/services/users/Types'
import type { MembershipFiltered } from '@/services/groups/memberships/Types'

export type UserGuaranteeOption = 'HAS_USER' | 'NO_USER'

type SessionType<UserGuarantee extends UserGuaranteeOption> = {
    user: UserGuarantee extends 'HAS_USER' ? UserFiltered : (
        UserGuarantee extends 'NO_USER' ? null : never
    ),
    permissions: Permission[],
    memberships: MembershipFiltered[],
}

export type SessionUser = Session<'HAS_USER'>
export type SessionNoUser = Session<'NO_USER'>
export type SessionMaybeUser = Session<'HAS_USER'> | Session<'NO_USER'>

export class Session<UserGuarantee extends UserGuaranteeOption> {
    private session: SessionType<UserGuarantee>

    private constructor(session: SessionType<UserGuarantee>) {
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

    public static async fromNextAuth(): Promise<SessionMaybeUser> {
        const {
            user = null,
            permissions = await readDefaultPermissions(),
            memberships = [],
        } = await getSessionNextAuth(authOptions) ?? {}
        return new Session({ user, permissions, memberships })
    }

    public static async fromApiKey(apiKeyHashedAndEncrypted: string): Promise<SessionNoUser> {
        throw new Error(`Not implemented${apiKeyHashedAndEncrypted}`)
    }
}
