import { Smorekopp } from './error'
import type { ServiceMethod, ServiceMethodConfig } from './ServiceTypes'

export function ServiceMethod<
    TypeType,
    DetailedType,
    Params,
    Return,
    DynamicFields,
    WantsToOpenTransaction extends boolean,
>(
    config: ServiceMethodConfig<true, TypeType, DetailedType, Params, Return, DynamicFields, WantsToOpenTransaction, true>
): ServiceMethod<true, TypeType, DetailedType, Params, Return, WantsToOpenTransaction, true>

export function ServiceMethod<
    Params,
    Return,
    DynamicFields,
    WantsToOpenTransaction extends boolean,
>(
    config: ServiceMethodConfig<
        false, void, void, Params, Return, DynamicFields, WantsToOpenTransaction, true
    >
): ServiceMethod<false, void, void, Params, Return, WantsToOpenTransaction, true>

export function ServiceMethod<
    TypeType,
    DetailedType,
    Params,
    Return,
    DynamicFields,
    WantsToOpenTransaction extends boolean,
>(
    config: ServiceMethodConfig<true, TypeType, DetailedType, Params, Return, DynamicFields, WantsToOpenTransaction, false>
): ServiceMethod<true, TypeType, DetailedType, Params, Return, WantsToOpenTransaction, false>

export function ServiceMethod<
    Params,
    Return,
    DynamicFields,
    WantsToOpenTransaction extends boolean,
>(
    config: ServiceMethodConfig<
        false, void, void, Params, Return, DynamicFields, WantsToOpenTransaction, false
    >
): ServiceMethod<false, void, void, Params, Return, WantsToOpenTransaction, false>

export function ServiceMethod<
    TypeType,
    DetailedType,
    Params,
    Return,
    DynamicFields,
    WantsToOpenTransaction extends boolean,
>(
    config:
        | ServiceMethodConfig<true, TypeType, DetailedType, Params, Return, DynamicFields, WantsToOpenTransaction, true>
        | ServiceMethodConfig<false, void, void, Params, Return, DynamicFields, WantsToOpenTransaction, true>
        | ServiceMethodConfig<true, TypeType, DetailedType, Params, Return, DynamicFields, WantsToOpenTransaction, false>
        | ServiceMethodConfig<false, void, void, Params, Return, DynamicFields, WantsToOpenTransaction, false>
): (
    | ServiceMethod<true, TypeType, DetailedType, Params, Return, WantsToOpenTransaction, true> 
    | ServiceMethod<false, void, void, Params, Return, WantsToOpenTransaction, true>
    | ServiceMethod<true, TypeType, DetailedType, Params, Return, WantsToOpenTransaction, false> 
    | ServiceMethod<false, void, void, Params, Return, WantsToOpenTransaction, false>
) {       
    if (!config.hasAuther) {
        return config.withData ? { 
            withData: true, client: config.serviceMethodHandler.client, typeValidate: config.serviceMethodHandler.typeValidate 
        } : { withData: false, client: config.serviceMethodHandler.client }
    }
    return config.withData ? {
        withData: true,
        client: (prisma) => ({
            execute: ({ data, params, session }, authRunConfig) => {
                if (authRunConfig.withAuth) {
                    const authRes = config.auther.auth({
                        session, dynamicFields: config.dynamicFields({ params, data })
                    })
                    if (!authRes.authorized) throw new Smorekopp(authRes.status)
                }
                return config.serviceMethodHandler.client(prisma).execute({ data, params, session })
            },
        }),
        typeValidate: config.serviceMethodHandler.typeValidate,
    } satisfies ServiceMethod<true, TypeType, DetailedType, Params, Return, WantsToOpenTransaction, false> : {
        withData: false,
        client: (prisma) => ({
            execute: ({ params, session }, authRunConfig) => {
                if (authRunConfig.withAuth) {
                    const authRes = config.auther.auth({
                        session, dynamicFields: config.dynamicFields({ params })
                    })
                    if (!authRes.authorized) throw new Smorekopp(authRes.status)
                }
                return config.serviceMethodHandler.client(prisma).execute({ params, session })
            },
        }),
    } satisfies ServiceMethod<false, void, void, Params, Return, WantsToOpenTransaction, false>
}
