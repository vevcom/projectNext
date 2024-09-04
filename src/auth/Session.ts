import { authOptions } from './authoptions'
import { readDefaultPermissions } from '@/services/permissionRoles/read'
import { readApiKeyHashedAndEncrypted } from '@/services/api-keys/read'
import { apiKeyDecryptAndCompare } from '@/services/api-keys/hashEncryptKey'
import { decodeApiKey } from '@/services/api-keys/apiKeyEncoder'
import { ServerError } from '@/services/error'
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

    public static empty(): SessionNoUser {
        return new Session({ user: null, permissions: [], memberships: [] })
    }

    public static async fromNextAuth(): Promise<SessionMaybeUser> {
        const {
            user = null,
            permissions = await readDefaultPermissions(),
            memberships = [],
        } = await getSessionNextAuth(authOptions) ?? {}
        return new Session({ user, permissions, memberships })
    }

    /**
     * This function generates a Session from an api-key. If the kwy is bad
     * an error will be thrown.
     * @param key - The key provided by client in the `id=keyId&key=key` format
     * If the key is null, the session will be cratedwith only default permissios
     */
    public static async fromApiKey(keyAndIdEncoded: string | null): Promise<SessionNoUser> {
        const defaultPermissions = await readDefaultPermissions()
        if (!keyAndIdEncoded) return new Session({ user: null, permissions: defaultPermissions, memberships: [] })
        const { id, key } = decodeApiKey(keyAndIdEncoded)
        const { keyHashEncrypted, active, permissions } = await readApiKeyHashedAndEncrypted(id)
        if (!active) throw new ServerError('INVALID API KEY', 'Api nøkkelen har utløpt')

        const success = await apiKeyDecryptAndCompare(key, keyHashEncrypted)
        if (!success) throw new ServerError('INVALID API KEY', 'Api nøkkelen er ikke valid')

        return new Session({
            user: null,
            permissions: [...defaultPermissions, ...permissions].filter(
                (permission, i, ps) => ps.indexOf(permission) === i
            ),
            memberships: []
        })
    }
}
