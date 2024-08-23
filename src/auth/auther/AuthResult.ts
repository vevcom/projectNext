import { ServerSession } from "../ServerSession";

export class AuthResult {
    public session: ServerSession
    public authorized: boolean

    public constructor(session: ServerSession, authorized: boolean) {
        this.session = session
        this.authorized = authorized
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

export type AuthStatus = AuthResult['status']