import { ServerSession, UserGuaranteeOption } from "../ServerSession";

export class AuthResult<UserGuatantee extends UserGuaranteeOption> {
    public session: ServerSession<UserGuatantee>
    private authorized_: boolean
    public get authorized() {
        return this.authorized_
    }

    public constructor(session: ServerSession<UserGuatantee>, authorized: boolean) {
        this.session = session
        this.authorized_ = authorized
    }

    public get status() {
        if (this.authorized) {
            if (this.session.user) return 'AUTHORIZED'
            return 'AUTHORIZED_NO_USER'
        }
        if (this.session.user) return 'UNAUTHORIZED'
        return 'UNAUTHENTICATED'
    }
}

export type AuthStatus = AuthResult<'MAYBE_USER'>['status']