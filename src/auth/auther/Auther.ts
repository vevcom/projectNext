import { AuthResult } from './AuthResult'
import { notFound, redirect } from 'next/navigation'
import type { SessionMaybeUser, SessionUser } from '@/auth/Session'

type AutherRedirectConfig = {
    shouldRedirect: boolean,
    redirectUrl: string | null,
    returnUrl: string | null,
}

export type UserRequieredOutOpt = 'USER_NOT_REQUIERED_FOR_AUTHORIZED' | 'USER_REQUIERED_FOR_AUTHORIZED'

export type CheckReturn<
    UserRequieredOut extends UserRequieredOutOpt
> = UserRequieredOut extends 'USER_REQUIERED_FOR_AUTHORIZED' ? ({
    success: true,
    session: SessionUser
} | {
    success: false,
    session: SessionMaybeUser
}) : ({
    success: boolean,
    session: SessionMaybeUser
})

export abstract class Auther<
    const UserRequieredOut
    extends UserRequieredOutOpt,
    const DynamicFields extends object | undefined
> {
    private redirectConfig: AutherRedirectConfig

    public constructor() {
        this.redirectConfig = {
            shouldRedirect: false,
            redirectUrl: null,
            returnUrl: null
        }
        return this
    }

    protected abstract check(
        session: SessionMaybeUser,
        dynamicFields: DynamicFields
    ): CheckReturn<UserRequieredOut>

    public auth({
        session: sessionIn,
        dynamicFields
    }: {
        session: SessionMaybeUser,
        dynamicFields: DynamicFields
    }): (UserRequieredOut extends 'USER_REQUIERED_FOR_AUTHORIZED' ?
        (AuthResult<'HAS_USER', true> | AuthResult<'HAS_USER' | 'NO_USER', false>) :
        (AuthResult<'HAS_USER' | 'NO_USER', true> | AuthResult<'HAS_USER' | 'NO_USER', false>)
    ) {
        const { session, success } = this.check(sessionIn, dynamicFields)

        if (success) {
            return new AuthResult(session, true)
        }
        if (this.redirectConfig.shouldRedirect) {
            if (!session.user && this.redirectConfig.returnUrl) {
                redirect(`/login?callbackUrl=${encodeURI(this.redirectConfig.returnUrl)}`)
            }

            if (this.redirectConfig.redirectUrl) {
                redirect(this.redirectConfig.redirectUrl)
            }

            // This function throws an error, which is next.js's way of redirecting.
            notFound() //TODO: Should probably redirect to an unauthorized page when we have one.
        }

        return new AuthResult(session, false)
    }

    public redirectOnFail({
        redirectUrl,
        returnUrl
    }: Pick<AutherRedirectConfig, 'redirectUrl' | 'returnUrl'>) {
        this.redirectConfig = {
            shouldRedirect: true,
            redirectUrl,
            returnUrl
        }
        return this
    }
}
