import { redirectToErrorPage } from '@/app/redirectToErrorPage'
import { redirect } from 'next/navigation'
import type { SessionType, UserGuaranteeOption } from '@/auth/session/Session'

export type AuthStatus = 'AUTHORIZED' | 'UNAUTHORIZED' | 'AUTHORIZED_NO_USER' | 'UNAUTHENTICATED'

export type AuthResultType = {
    session: SessionType<UserGuaranteeOption>,
    errorMessage?: string,
    authorized: boolean,
    status: AuthStatus,
}

export class AuthResult<const UserGuatantee extends UserGuaranteeOption, const Authorized extends boolean> {
    private authResult: Omit<AuthResultType, 'status'>
    public get authorized() {
        return this.authResult.authorized
    }

    public get session(): SessionType<UserGuatantee> {
        return this.authResult.session
    }

    public constructor(session: SessionType<UserGuatantee>, authorized: Authorized, errorMessage?: string) {
        this.authResult = {
            session,
            authorized,
            errorMessage,
        }
    }

    public get status(): AuthStatus {
        if (this.authResult.session.user) {
            if (this.authorized) return 'AUTHORIZED'
            return 'UNAUTHORIZED'
        }
        if (this.authorized) return 'AUTHORIZED_NO_USER'

        if (typeof this.authResult.session.apiKeyId === 'number') return 'UNAUTHORIZED'
        return 'UNAUTHENTICATED'
    }

    public get getErrorMessage(): string | undefined {
        return this.authResult.errorMessage
    }

    /**
     * The encoding in a JS object is useful for sending the AuthResult to the client
     * as you cannot send class instances to a client component from a server component.
     * @returns A javascript object representation of the AuthResult
     */
    public toJsObject(): AuthResultType {
        return {
            session: this.session,
            authorized: this.authorized,
            errorMessage: this.getErrorMessage,
            status: this.status,
        }
    }

    public static fromJsObject<const UserGuatantee_ extends UserGuaranteeOption, const Authorized_ extends boolean>(
        authResult: AuthResultType
    ): AuthResult<UserGuatantee_, Authorized_> {
        return new AuthResult(authResult.session, authResult.authorized, authResult.errorMessage)
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
                redirectToErrorPage('UNAUTHORIZED', this.getErrorMessage)
            }
            if (returnUrl) {
                redirect(`/login?callbackUrl=${encodeURI(returnUrl)}`)
            }
            redirect('/login')
        }
        return new AuthResult(this.session, true)
    }
}
