import { createZodActionError } from './error'
import { safeServerCall } from './safeServerCall'
import { Session } from '@/auth/Session'
import type { SessionMaybeUser } from '@/auth/Session'
import type { ServiceMethod } from '@/services/ServiceTypes'

export function Action<
    TypeType,
    DetailedType,
    Params,
    Return,
    WantsToOpenTransaction extends boolean,
    NoAuther extends boolean
>(serviceMethod: ServiceMethod<
    true,
    TypeType,
    DetailedType,
    Params,
    Return,
    WantsToOpenTransaction,
    NoAuther
>) {
    return async (params: Params, rawData: FormData) => {
        const session = await Session.fromNextAuth()
        const parse = serviceMethod.typeValidate(rawData)
        if (!parse.success) return createZodActionError(parse)
        const data = parse.data
        const config: { session: SessionMaybeUser, params: Params, data: DetailedType } = { session, params, data }
        return {
            ...(await safeServerCall(() => serviceMethod.client('NEW').execute(config, { withAuth: true }))),
            session: session.toJsObject()
        }
    }
}

export function ActionNoData<
    Params,
    Return,
    WantsToOpenTransaction extends boolean,
    NoAuther extends boolean
>(serviceMethod: ServiceMethod<
    false,
    never,
    never,
    Params,
    Return,
    WantsToOpenTransaction,
    NoAuther
>) {
    return async (params: Params) => {
        const session = await Session.fromNextAuth()
        const config: { session: SessionMaybeUser, params: Params, data: unknown } = { session, params, data: {} }
        return {
            ...(await safeServerCall(() => serviceMethod.client('NEW').execute(config, { withAuth: true }))),
            session: session.toJsObject()
        }
    }
}
