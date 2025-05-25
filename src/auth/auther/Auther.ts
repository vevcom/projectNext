import { AuthResult } from './AuthResult'
import type { SessionMaybeUser, SessionUser } from '@/auth/Session'

export type UserRequieredOutOpt = 'USER_NOT_REQUIERED_FOR_AUTHORIZED' | 'USER_REQUIERED_FOR_AUTHORIZED'

export type AutherStaticFieldsBound<
    DynamicFields extends object,
    UserRequieredOut extends UserRequieredOutOpt = 'USER_NOT_REQUIERED_FOR_AUTHORIZED' | 'USER_REQUIERED_FOR_AUTHORIZED',
> = {
    dynamicFields: (dynamicFields: DynamicFields) => {
        auth: (session: SessionMaybeUser) => UserRequieredOut extends 'USER_REQUIERED_FOR_AUTHORIZED'
        ? (AuthResult<'HAS_USER', true> | AuthResult<'HAS_USER' | 'NO_USER', false>)
        : (AuthResult<'HAS_USER' | 'NO_USER', true> | AuthResult<'HAS_USER' | 'NO_USER', false>)
    }
}

export type Auther<
    StaticFields extends object,
    DynamicFields extends object,
    UserRequieredOut extends UserRequieredOutOpt,
> = {
    staticFields: (staticFields: StaticFields) => AutherStaticFieldsBound<DynamicFields, UserRequieredOut>
}


export function AutherFactory<
    StaticFields extends object,
    DynamicFields extends object,
    const UserRequieredOut extends UserRequieredOutOpt,
>(
    authCheck: ((f: {
        session: SessionMaybeUser,
        staticFields: StaticFields,
        dynamicFields: DynamicFields
    }) => UserRequieredOut extends 'USER_REQUIERED_FOR_AUTHORIZED' ? ({
        success: true,
        session: SessionUser,
        errorMessage?: string,
    } | {
        success: false,
        session: SessionMaybeUser
        errorMessage?: string,
    }) : ({
        success: boolean,
        session: SessionMaybeUser
        errorMessage?: string,
    }))
): Auther<StaticFields, DynamicFields, UserRequieredOut> {
    return {
        staticFields: (staticFields) => (
            {
                dynamicFields: (dynamicFields) => (
                    {
                        auth: (session) => {
                            const { session: sessionOut, success, errorMessage } = authCheck({
                                session, staticFields, dynamicFields
                            })
                            if (success) {
                                return new AuthResult(sessionOut, true)
                            }

                            return new AuthResult(sessionOut, false, errorMessage)
                        }
                    }
                )
            }
        )
    }
}
