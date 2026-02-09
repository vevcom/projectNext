import { AuthResult } from './AuthResult'
import type { SessionMaybeUser, SessionUser } from '@/auth/session/Session'

export type UserRequieredOutOpt = 'USER_NOT_REQUIERED_FOR_AUTHORIZED' | 'USER_REQUIERED_FOR_AUTHORIZED'

export type AuthorizerDynamicFieldsBound<
    UserRequieredOut extends UserRequieredOutOpt = 'USER_NOT_REQUIERED_FOR_AUTHORIZED' | 'USER_REQUIERED_FOR_AUTHORIZED',
    PrismaWhereFilter extends object | undefined = undefined
> = {
    auth: (session: SessionMaybeUser) => UserRequieredOut extends 'USER_REQUIERED_FOR_AUTHORIZED'
    ? (AuthResult<'HAS_USER', true, PrismaWhereFilter> | AuthResult<'HAS_USER' | 'NO_USER', false, undefined>)
    : (AuthResult<'HAS_USER' | 'NO_USER', true, PrismaWhereFilter> | AuthResult<'HAS_USER' | 'NO_USER', false, undefined>)
}

export type AuthorizerStaticFieldsBound<
    DynamicFields extends object,
    UserRequieredOut extends UserRequieredOutOpt = 'USER_NOT_REQUIERED_FOR_AUTHORIZED' | 'USER_REQUIERED_FOR_AUTHORIZED',
    PrismaWhereFilter extends object | undefined = undefined
> = {
    dynamicFields: (dynamicFields: DynamicFields) => AuthorizerDynamicFieldsBound<UserRequieredOut, PrismaWhereFilter>,
}

export type Authorizer<
    StaticFields extends object,
    DynamicFields extends object,
    UserRequieredOut extends UserRequieredOutOpt,
    PrismaWhereFilter extends object | undefined = undefined
> = {
    staticFields: (staticFields: StaticFields) =>
        AuthorizerStaticFieldsBound<DynamicFields, UserRequieredOut, PrismaWhereFilter>
}

export function AuthorizerFactory<
    StaticFields extends object,
    DynamicFields extends object,
    const UserRequieredOut extends UserRequieredOutOpt,
    const PrismaWhereFilter extends object | undefined = undefined
>(
    authCheck: ((_: {
        session: SessionMaybeUser,
        staticFields: StaticFields,
        dynamicFields: DynamicFields
    }) => UserRequieredOut extends 'USER_REQUIERED_FOR_AUTHORIZED' ? (
            ({
                success: true,
                session: SessionUser,
                errorMessage?: string,
                prismaWhereFilter?: PrismaWhereFilter,
            } & (PrismaWhereFilter extends undefined ? object : { prismaWhereFilter: PrismaWhereFilter })) | {
                success: false,
                session: SessionMaybeUser,
                errorMessage?: string,
            }
        ) : (
            ({
                success: true,
                session: SessionMaybeUser,
                errorMessage?: string,
                prismaWhereFilter?: PrismaWhereFilter,
            } & (PrismaWhereFilter extends undefined ? object : { prismaWhereFilter: PrismaWhereFilter })) | {
                success: false,
                session: SessionMaybeUser,
                errorMessage?: string,
            }
        )
    )
): Authorizer<StaticFields, DynamicFields, UserRequieredOut, PrismaWhereFilter> {
    return {
        staticFields: (staticFields) => (
            {
                dynamicFields: (dynamicFields) => (
                    {
                        auth: (session) => {
                            const results = authCheck({
                                session, staticFields, dynamicFields
                            })
                            if (results.success) {
                                return new AuthResult(
                                    results.session,
                                    true,
                                    results.prismaWhereFilter!
                                )
                            }

                            return new AuthResult(results.session, false, undefined, results.errorMessage)
                        }
                    }
                )
            }
        )
    }
}
