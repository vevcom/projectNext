import 'server-only'
import { authOptions } from './authoptions'
import checkMatrix from '@/utils/checkMatrix'
import { readDefaultPermissions } from '@/server/permissionRoles/read'
import { getServerSession as getServerSessionNextAuth } from 'next-auth'
import { notFound, redirect } from 'next/navigation'
import type { Matrix } from '@/utils/checkMatrix'
import type { Permission } from '@prisma/client'
import type { MembershipFiltered } from '@/server/groups/memberships/Types'
import type { UserFiltered } from '@/server/users/Types'
import { checkVisibility } from './checkVisibility'
import { VisibilityCollapsed, VisibilityLevelType } from '@/server/visibility/Types'
import { getVisibilityFilter } from './getVisibilityFilter'
import { createActionError } from '@/actions/error'

type Session<UserGuarantee extends 'HAS_USER' | 'MAYBE_USER' | 'NO_USER'> = {
    user: UserGuarantee extends 'HAS_USER' ? UserFiltered : (
        UserGuarantee extends 'MAYBE_USER' ? UserFiltered | null : (
        UserGuarantee extends 'NO_USER' ? null : never
        )
    ),
    permissions: Permission[],
    memberships: MembershipFiltered[], 
}

type SessionWithAuth<UserRequiered extends boolean> =  ({
    authorized: false,
    status: 'UNAUTHORIZED',
} & Session<'HAS_USER'>) | ({
    authorized: false,
    status: 'UNAUTHENTICATED'
} & Session<'NO_USER'>) | ({
    authorized: true,
    status: 'AUTHORIZED'
} & Session<'HAS_USER'>) | (
UserRequiered extends true ? never : ({
    authorized: true,
    status: 'AUTHORIZED_NO_USER'
} & Session<'NO_USER'>)
)

export type AuthStatus = SessionWithAuth<false>['status']

class ServerSession {
    public session: Session<'MAYBE_USER'>

    /**
     * NOTE: This constructor should not be called directly, use `ServerSession.getSession()` instead.
     * @param session - The session object to wrap
     */
    private constructor(session: Session<'MAYBE_USER'>) {
        this.session = session
    }

    /**
     * The way to do authentication in the server. This function will run a
     * auther on the session in question and return both the session and
     * authorized (bool), and status.
     * @param auther - The auther object to use for authentication. It contains 
     * the pipeline for the authentication.
     * @returns 
     */
    public authenticate<UserRequieredOut extends boolean>(
        auther: Auther
    ): SessionWithAuth<UserRequieredOut>  {
        return auther.auth(this.session)
    }

    /**
     * async function to get the current session of the user making the request.
     * @returns A new ServerSession object with the current session of the user makink the request.
     */
    public static async get() {
        const {
            user = null,
            permissions = await readDefaultPermissions(),
            memberships = [],
        } = await getServerSessionNextAuth(authOptions) ?? {}
        return new ServerSession({user, permissions, memberships})
    }

    /**
     * Returns a visibilityfilter that is uful for quering databases for many entries
     * within a given visibility.
     * @returns The visibility filter of the current user.
     */
    public getVisibilityFilter() {
        return getVisibilityFilter(this.session.memberships, this.session.permissions)
    }
}

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

    public constructor() {
        this.redirectConfig = {
            shouldRedirect: false,
            redirectUrl: null,
            returnUrl: null
        }
        this.checkers = []
        return this
    }

    public auth(session: Session<'MAYBE_USER'>): SessionWithAuth<UserRequieredOut> {
        const sessionWithAuth = this.checkers.some(checker => checker.check(session).authorized)

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

export class AuthCheck {
    public check: (session: Session<'MAYBE_USER'>) => SessionWithAuth<false>

    protected extendCheck(newStage: (session: Session<'MAYBE_USER'>) => boolean)  {
        this.check = (session) => {
            const sessionWithAuth = this.check(session)
            if (!sessionWithAuth.authorized) return sessionWithAuth
            if (newStage(sessionWithAuth)) return sessionWithAuth
            if (session.user) return {
                ...session,
                authorized: false,
                status: 'UNAUTHORIZED',
                user: session.user,
            }
            return {
                ...session,
                authorized: false,
                status: 'UNAUTHENTICATED',
                user: session.user,
            }
        }
    }

    public constructor() {
        this.check = (session) => {
            if (session.user) return {
                ...session,
                authorized: true,
                status: 'AUTHORIZED',
                user: session.user,
            }
            return {
                ...session,
                authorized: true,
                status: 'AUTHORIZED_NO_USER',
                user: session.user,
            }
        }
    }

    public requirePermission(permissionMatix: Matrix<Permission>) {
        this.extendCheck(session => checkMatrix(session.permissions, permissionMatix))
        return this
    }

    public require

    public requireUser(session: Session<'MAYBE_USER'>) {
        return new AuthCheckUserRequiered(this.check)
    }
        
}

class AuthCheckUserRequiered extends AuthCheck {
    private checkUserRequiered: (session: Session<'HAS_USER'>) => SessionWithAuth<true>
    /**
     * This class extends the AuthCheck class. By constructing this class from the checker of
     * an Auth check you in the construction extend the check to require a user to be present.
     * This class also have some additional auth methodes that requre a user to be present.
     * like .hasUsername
     * @param check - The checker to start off with that does not neccesarraly require a user to
     * authorize true
     */
    public constructor(check: (session: Session<'MAYBE_USER'>) => SessionWithAuth<false>) {
        super()
        this.checkUserRequiered = (session) => {
            const sessionWithAuth = check({
                user: session.user,
                permissions: session.permissions,
                memberships: session.memberships
            })
            if (!sessionWithAuth.authorized) return sessionWithAuth
            if (session.user) return {
                ...session,
                authorized: true,
                status: 'AUTHORIZED',
                user: session.user,
            }
            return {
                ...session,
                authorized: false,
                status: 'UNAUTHORIZED',
                user: session.user,
            }
        }
    }
}


//EXAMPLE PERMISSION
async function readProfile(username: string) {
    const authReadProfile = new Auther().check(
        new AuthCheck().requireUser
    )
    const { 
        user, 
        permissions, 
        memberships, 
        authorized, 
        status 
    } = (await ServerSession.get()).authenticate()
    if (!authorized) return createActionError(status)
}

async function readImages(collectionId: number) {
    //SOME IMPLEMENTATION TO GET VISIBILITY (NOT DONE)
    const visibility = {} as VisibilityCollapsed

    const authReadImages = new AuthPipeline().requireVisibility(visibility, 'REGULAR')

    const { user, authorized, status } = (await getServerSession()).run(authReadImages)
    if (!authorized) return createActionError(status)
}