import { Auther } from './Auther'
import type { CheckReturn, UserRequieredOutOpt } from './Auther'
import type { SessionMaybeUser } from '@/auth/Session'

export function AutherFactory<
    UserRequieredOut extends UserRequieredOutOpt,
    DynamicFields,
    StaticFields,
>(
    checker: (
        session: SessionMaybeUser,
        staticFields: StaticFields,
        dynamicFields: DynamicFields
    ) => CheckReturn<UserRequieredOut>
) {
    return (staticFields: StaticFields) => {
        class AutherMade extends Auther<UserRequieredOut, DynamicFields> {
            protected check(session: SessionMaybeUser, dynamicFields: DynamicFields): CheckReturn<UserRequieredOut> {
                return checker(session, staticFields, dynamicFields)
            }
        }
        return new AutherMade()
    }
}
