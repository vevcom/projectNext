import type { Session, UserGuaranteeOption } from '@/auth/Session'

export type AuthStatus = 'AUTHORIZED' | 'UNAUTHORIZED' | 'AUTHORIZED_NO_USER' | 'UNAUTHENTICATED'

export class AuthResult<const UserGuatantee extends UserGuaranteeOption, const Authorized extends boolean> {
    public session: Session<UserGuatantee>
    private authorized_: Authorized
    public get authorized() {
        return this.authorized_
    }

    public constructor(session: Session<UserGuatantee>, authorized: Authorized) {
        this.session = session
        this.authorized_ = authorized
    }

    public get status(): AuthStatus {
        if (this.session.user) {
            if (this.authorized) return 'AUTHORIZED'
            return 'UNAUTHORIZED'
        }
        if (this.authorized) return 'AUTHORIZED_NO_USER'
        return 'UNAUTHENTICATED'
    }
}

