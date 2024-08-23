import { User } from '@prisma/client'
import { AuthCheck, AuthCheckUserRequiered } from './AuthCheck'
import { redirect } from 'next/navigation'
import { AuthResult } from './AuthResult'

type AutherRedirectConfig = { 
    shouldRedirect: boolean,
    redirectUrl: string | null,
    returnUrl: string | null,
}

export class Auther<UserRequieredOut extends boolean> {
    private redirectConfig: AutherRedirectConfig

    /**
     * A checker represent one possible way to be authorized. If one checker passes
     * the user is considered authorized.
     */
    private checkers: (UserRequieredOut extends true ? AuthCheckUserRequiered : AuthCheck)[]

    public constructor(checkers: (UserRequieredOut extends true ? AuthCheckUserRequiered : AuthCheck)[]) {
        this.redirectConfig = {
            shouldRedirect: false,
            redirectUrl: null,
            returnUrl: null
        }
        return this
    }

    public auth(session: Session<'MAYBE_USER'>) AuthResult<UserRequieredOut> {
        const success = this.checkers.some(checker => checker.check(session).authorized)

        if (success) {
            if (session.user) return { status: 'AUTHORIZED' , authorized: true }
            return { status: 'AUTHORIZED_NO_USER', authorized: true }
        }
        if (this.redirectConfig.shouldRedirect) {
            if (!session.user && this.config.returnUrl) {
                redirect(`/login?callbackUrl=${encodeURI(this.config.returnUrl)}`)
            }
    
            if (this.redirectConfig.redirectUrl) {
                redirect(this.config.redirectUrl)
            }
    
            notFound() //TODO: Should probably redirect to an unauthorized page when we have one.
        }

        if (session.user) return { status: 'UNAUTHORIZED', authorized: false }
        return { status: 'UNAUTHENTICATED', authorized: false }
    }

    public redirectOnFail({ 
        redirectUrl, 
        returnUrl
    } : Pick<AutherRedirectConfig, 'redirectUrl' | 'returnUrl'>) {
        this.redirectConfig = {
            shouldRedirect: true,
            redirectUrl, 
            returnUrl
        }
        return this
    }
}