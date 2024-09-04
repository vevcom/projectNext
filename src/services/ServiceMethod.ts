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
    config: ServiceMethodConfig<true, TypeType, DetailedType, Params, Return, DynamicFields, WantsToOpenTransaction>
): ServiceMethod<true, TypeType, DetailedType, Params, Return, WantsToOpenTransaction>

export function ServiceMethod<
    Params,
    Return,
    DynamicFields,
    WantsToOpenTransaction extends boolean
>(
    config: ServiceMethodConfig<
        false, void, void, Params, Return, DynamicFields, WantsToOpenTransaction
    >
): ServiceMethod<false, void, void, Params, Return, WantsToOpenTransaction>

export function ServiceMethod<
    TypeType,
    DetailedType,
    Params,
    Return,
    DynamicFields,
    WantsToOpenTransaction extends boolean
>(
    config:
        | ServiceMethodConfig<true, TypeType, DetailedType, Params, Return, DynamicFields, WantsToOpenTransaction>
        | ServiceMethodConfig<false, void, void, Params, Return, DynamicFields, WantsToOpenTransaction>
): ServiceMethod<true, TypeType, DetailedType, Params, Return, WantsToOpenTransaction> |
    ServiceMethod<false, void, void, Params, Return, WantsToOpenTransaction> {
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
    } satisfies ServiceMethod<true, TypeType, DetailedType, Params, Return, WantsToOpenTransaction> : {
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
    } satisfies ServiceMethod<false, void, void, Params, Return, WantsToOpenTransaction>
}
