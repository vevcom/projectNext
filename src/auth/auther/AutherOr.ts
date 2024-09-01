import { Auther } from './Auther'
import type { SessionMaybeUser } from '@/auth/Session'

export function AutherOr<
    DynamicFields extends object | undefined = undefined
>(
    authers: Auther<'USER_NOT_REQUIERED_FOR_AUTHORIZED', Partial<DynamicFields> | undefined>[]
) {
    class AutherMade extends Auther<'USER_NOT_REQUIERED_FOR_AUTHORIZED', DynamicFields> {
        protected check(session: SessionMaybeUser, dynamicFields: DynamicFields) {
            if (authers.length === 0) return { success: false as const, session }
            for (const auther of authers) {
                const authResult = auther.auth({ session, dynamicFields })
                if (authResult.authorized) return { success: true as const, session: authResult.session }
            }
            return { success: false as const, session }
        }
    }
    return new AutherMade()
}
