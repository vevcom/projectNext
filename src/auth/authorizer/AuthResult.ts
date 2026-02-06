import { redirectToErrorPage } from '@/app/redirectToErrorPage'
import { redirect } from 'next/navigation'
import type { SessionType, UserGuaranteeOption } from '@/auth/session/Session'

export type AuthStatus = 'AUTHORIZED' | 'UNAUTHORIZED' | 'AUTHORIZED_NO_USER' | 'UNAUTHENTICATED'

export type AuthResultTypeWithoutStatus<
    UserGuatantee extends UserGuaranteeOption,
    Authorized extends boolean,
    PrismaWhereFilter extends object | undefined = undefined
> = {
    session: SessionType<UserGuatantee>,
    errorMessage?: string,
    authorized: Authorized,
    prismaWhereFilter: PrismaWhereFilter,
}

export type AuthResultType<
    UserGuatantee extends UserGuaranteeOption,
    Authorized extends boolean,
    PrismaWhereFilter extends object | undefined = undefined
> = AuthResultTypeWithoutStatus<UserGuatantee, Authorized, PrismaWhereFilter> & {
    status: AuthStatus
}

export type AuthResultTypeAny = AuthResultType<UserGuaranteeOption, boolean, object | undefined>

export class AuthResult<
    const UserGuatantee extends UserGuaranteeOption,
    const Authorized extends boolean,
    const PrismaWhereFilter extends object | undefined = undefined
> {
    private authResult: AuthResultTypeWithoutStatus<UserGuatantee, Authorized, PrismaWhereFilter>
    public get authorized() {
        return this.authResult.authorized
    }

    public get session(): SessionType<UserGuatantee> {
        return this.authResult.session
    }

    public get prismaWhereFilter(): PrismaWhereFilter {
        return this.authResult.prismaWhereFilter
    }

    public constructor(
        session: SessionType<UserGuatantee>,
        authorized: Authorized,
        prismaWhereFilter: PrismaWhereFilter,
        errorMessage?: string
    ) {
        this.authResult = {
            session,
            authorized,
            prismaWhereFilter,
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
    public toJsObject(): AuthResultType<UserGuatantee, Authorized, PrismaWhereFilter> {
        return {
            session: {
                // Note: spread is neccessary if the session stored on the AuthResult is the Session class and
                // not the session object of Session type
                ...this.session,
            },
            authorized: this.authorized,
            errorMessage: this.getErrorMessage,
            status: this.status,
            prismaWhereFilter: this.authResult.prismaWhereFilter,
        }
    }

    public static fromJsObject<
        const UserGuatantee_ extends UserGuaranteeOption,
        const Authorized_ extends boolean,
        const PrismaWhereFilter_ extends object | undefined = undefined
    >(
        authResult: AuthResultType<UserGuatantee_, Authorized_, PrismaWhereFilter_>
    ): AuthResult<UserGuatantee_, Authorized_, PrismaWhereFilter_> {
        return new AuthResult(
            authResult.session, authResult.authorized, authResult.prismaWhereFilter, authResult.errorMessage
        )
    }

    public redirectOnUnauthorized(
        { returnUrl }: { returnUrl?: string }
    ) : AuthResult<UserGuatantee, true, PrismaWhereFilter> {
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
        return new AuthResult(this.session, true, this.authResult.prismaWhereFilter)
    }
}
