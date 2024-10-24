import { Smorekopp } from './error'
import { Session } from '@/auth/Session'
import type { Execute, PrismaTransactionOrNew, ServiceMethod, ServiceMethodConfig } from './ServiceTypes'

export function ServiceMethod<
    TypeType,
    DetailedType,
    Params,
    Return,
    DynamicFields extends object,
    WantsToOpenTransaction extends boolean,
>(
    config: ServiceMethodConfig<true, TypeType, DetailedType, Params, Return, DynamicFields, WantsToOpenTransaction, true>
): ServiceMethod<true, TypeType, DetailedType, Params, Return, WantsToOpenTransaction, true>

export function ServiceMethod<
    Params,
    Return,
    DynamicFields extends object,
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
    DynamicFields extends object,
    WantsToOpenTransaction extends boolean,
>(
    config: ServiceMethodConfig<true, TypeType, DetailedType, Params, Return, DynamicFields, WantsToOpenTransaction, false>
): ServiceMethod<true, TypeType, DetailedType, Params, Return, WantsToOpenTransaction, false>

export function ServiceMethod<
    Params,
    Return,
    DynamicFields extends object,
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
    DynamicFields extends object,
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
            withData: true,
            client: config.serviceMethodHandler.client,
            typeValidate: config.serviceMethodHandler.typeValidate,
            detailedValidate: config.serviceMethodHandler.detailedValidate,
        } : {
            withData: false,
            client: config.serviceMethodHandler.client
        }
    }

    if (config.withData) {
        const executeWithData: (prisma: PrismaTransactionOrNew<WantsToOpenTransaction>) => Execute<
            true,
            DetailedType,
            Params,
            Return,
            boolean
        >['executeRaw'] = (prisma) => ({ data, params, session }, authRunConfig) => {
            if (authRunConfig.withAuth) {
                const authRes = config.auther.dynamicFields(
                    config.dynamicFields({
                        params,
                        data: config.serviceMethodHandler.detailedValidate(data)
                    })
                ).auth(
                    session ?? Session.empty()
                )
                if (!authRes.authorized) throw new Smorekopp(authRes.status)
            }
            return config.serviceMethodHandler.client(prisma).executeRaw({ data, params, session })
        }
        return {
            withData: true,
            client: (prisma) => ({
                execute: executeWithData(prisma),
                executeRaw: executeWithData(prisma)
            }),
            typeValidate: config.serviceMethodHandler.typeValidate,
            detailedValidate: config.serviceMethodHandler.detailedValidate
        }
    }

    const executeWithoutData: (prisma: PrismaTransactionOrNew<WantsToOpenTransaction>) => Execute<
        false,
        void,
        Params,
        Return,
        boolean
    >['executeRaw'] = (prisma) => ({ params, session }, authRunConfig) => {
        if (authRunConfig.withAuth) {
            const authRes = config.auther.dynamicFields(
                config.dynamicFields({
                    params
                })
            ).auth(
                session ?? Session.empty()
            )
            if (!authRes.authorized) throw new Smorekopp(authRes.status)
        }
        return config.serviceMethodHandler.client(prisma).execute({ params, session })
    }


    return {
        withData: false,
        client: (prisma) => ({
            execute: executeWithoutData(prisma),
            executeRaw: executeWithoutData(prisma)
        }),
    }
}
