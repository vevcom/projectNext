import { useSession } from '@/auth/session/useSession'
import { AuthResult } from '@/auth/auther/AuthResult'
import { Session, type UserGuaranteeOption } from '@/auth/session/Session'
import type { AutherDynamicFieldsBound } from '@/auth/auther/Auther'

/**
 * This function applies an auther to the current client side session stored. While
 * this session is still loading, it will return an AuthResult with authorized set to false.
 * @param param0
 */
function useAuther({
    auther
}: {
    auther: AutherDynamicFieldsBound<'USER_NOT_REQUIERED_FOR_AUTHORIZED'>
}): AuthResult<UserGuaranteeOption, boolean>
function useAuther({
    auther
}: {
    auther: AutherDynamicFieldsBound<'USER_REQUIERED_FOR_AUTHORIZED'>
}): AuthResult<UserGuaranteeOption, false> | AuthResult<'HAS_USER', true>
function useAuther({
    auther
}: {
    auther: AutherDynamicFieldsBound
}): AuthResult<UserGuaranteeOption, boolean> {
    const session = useSession()
    if (session.loading) {
        return new AuthResult(Session.empty(), false)
    }
    return auther.auth(session.session)
}

export default useAuther
