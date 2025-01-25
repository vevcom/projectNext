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

export type SessionType<UserGuarantee extends UserGuaranteeOption> = {
    user: UserGuarantee extends 'HAS_USER' ? UserFiltered : (
        UserGuarantee extends 'NO_USER' ? null : never
    ),
    permissions: Permission[],
    memberships: MembershipFiltered[],
    apiKeyId?: number,
}

export type SessionUser = SessionType<'HAS_USER'>
export type SessionNoUser = SessionType<'NO_USER'>
export type SessionMaybeUser = SessionType<'HAS_USER'> | SessionType<'NO_USER'>

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

    public get apiKeyId() {
        return this.session.apiKeyId
    }

    /**
     * This functions makes sure the Session class can be sent to the client
     * @returns A javascript object representation of the session
     */
    public toJsObject(): SessionType<UserGuarantee> {
        return {
            user: this.user,
            permissions: this.permissions,
            memberships: this.memberships,
            apiKeyId: this.apiKeyId,
        }
    }

    public static empty(): Session<'NO_USER'> {
        return new Session<'NO_USER'>({ user: null, permissions: [], memberships: [] })
    }

    public static async fromJsObject(jsObject: SessionMaybeUser): Promise<Session<'NO_USER'> | Session<'HAS_USER'>> {
        if (jsObject instanceof Session) return jsObject
        return new Session(jsObject)
    }

    public static async fromNextAuth(): Promise<Session<'NO_USER'> | Session<'HAS_USER'>> {
        const {
            user = null,
            permissions = await readDefaultPermissions(),
            memberships = [],
        } = await getSessionNextAuth(authOptions) ?? {}
        return new Session({ user, permissions, memberships })
    }

    /**
     * This function generates a Session from an api-key. If the key is bad
     * an error will be thrown.
     * @param key - The key provided by client in the `id=keyId&key=key` format
     * If the key is null, the session will be cratedwith only default permissios
     */
    public static async fromApiKey(keyAndIdEncoded: string | null): Promise<Session<'NO_USER'>> {
        const defaultPermissions = await readDefaultPermissions()
        if (!keyAndIdEncoded) return new Session<'NO_USER'>({ user: null, permissions: defaultPermissions, memberships: [] })
        const { id, key } = decodeApiKey(keyAndIdEncoded)
        const { keyHashEncrypted, active, permissions } = await readApiKeyHashedAndEncrypted.newClient().execute({
            session: null,
            params: id
        })
        if (!active) throw new ServerError('INVALID API KEY', 'Api nøkkelen har utløpt')

        const success = await apiKeyDecryptAndCompare(key, keyHashEncrypted)
        if (!success) throw new ServerError('INVALID API KEY', 'Api nøkkelen er ikke valid')

        return new Session<'NO_USER'>({
            user: null,
            permissions: [...defaultPermissions, ...permissions].filter(
                (permission, i, ps) => ps.indexOf(permission) === i
            ),
            memberships: [],
            apiKeyId: id,
        })
    }
}
