import { redirectToErrorPage } from '@/app/redirectToErrorPage'
import { redirect } from 'next/navigation'
import type { SessionType, UserGuaranteeOption } from '@/auth/session/Session'

export type AuthStatus = 'AUTHORIZED' | 'UNAUTHORIZED' | 'AUTHORIZED_NO_USER' | 'UNAUTHENTICATED'

export class AuthResult<const UserGuatantee extends UserGuaranteeOption, const Authorized extends boolean> {
    public session: SessionType<UserGuatantee>
    private errorMessage?: string
    private authorized_: Authorized
    public get authorized() {
        return this.authorized_
    }

    public constructor(session: SessionType<UserGuatantee>, authorized: Authorized, errorMessage?: string) {
        this.session = session
        this.authorized_ = authorized
        this.errorMessage = errorMessage
    }

    public get status(): AuthStatus {
        if (this.session.user) {
            if (this.authorized) return 'AUTHORIZED'
            return 'UNAUTHORIZED'
        }
        if (this.authorized) return 'AUTHORIZED_NO_USER'

        if (typeof this.session.apiKeyId === 'number') return 'UNAUTHORIZED'
        return 'UNAUTHENTICATED'
    }

    public get getErrorMessage(): string | undefined {
        return this.errorMessage
    }

    public redirectOnUnauthorized({ returnUrl }: { returnUrl?: string }) : AuthResult<UserGuatantee, true> {
        if (!this.authorized) {
            if (this.session.user) {
                if (!this.session.user.acceptedTerms) {
                    if (returnUrl) {
                        redirect(`/register?callbackUrl=${encodeURI(returnUrl)}`)
                    }
                    redirect('/register')
                }
                redirectToErrorPage('UNAUTHORIZED', this.errorMessage)
            }
            if (returnUrl) {
                redirect(`/login?callbackUrl=${encodeURI(returnUrl)}`)
            }
            redirect('/login')
        }
        return new AuthResult(this.session, true)
    }
}

