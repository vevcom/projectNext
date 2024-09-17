import 'server-only'
import { prismaErrorWrapper } from './prismaCall'
import { default as globalPrisma } from '@/prisma'
import type {
    ServiceMethodHandlerConfig,
    ServiceMethodHandler,
    PrismaPossibleTransaction
} from './ServiceTypes'

export function ServiceMethodHandler<
    Params,
    Return,
    WantsToOpenTransaction extends boolean,
>({
    handler,
}: ServiceMethodHandlerConfig<
    false, void, void, Params, Return, WantsToOpenTransaction>
): ServiceMethodHandler<false, void, void, Params, Return, WantsToOpenTransaction>

export function ServiceMethodHandler<
    TypeType,
    DetailedType,
    Params,
    Return,
    WantsToOpenTransaction extends boolean,
>(config: ServiceMethodHandlerConfig<
    true, TypeType, DetailedType, Params, Return, WantsToOpenTransaction
    >
): ServiceMethodHandler<
    true, TypeType, DetailedType, Params, Return, WantsToOpenTransaction
>

export function ServiceMethodHandler<
    TypeType,
    DetailedType,
    Params,
    Return,
    WantsToOpenTransaction extends boolean,
>(
    config:
    | ServiceMethodHandlerConfig<true, TypeType, DetailedType, Params, Return, WantsToOpenTransaction>
    | ServiceMethodHandlerConfig<false, void, void, Params, Return, WantsToOpenTransaction>
): | ServiceMethodHandler<true, TypeType, DetailedType, Params, Return, WantsToOpenTransaction>
    | ServiceMethodHandler<false, void, void, Params, Return, WantsToOpenTransaction> {
    return config.withData ? {
        client: (prisma) => ({
            execute: ({
                params,
                data: rawdata,
            }) => {
                const data = config.validation.detailedValidate(rawdata)
                if (prisma === 'NEW') {
                    return prismaErrorWrapper(() => config.handler(globalPrisma, params, data))
                }
                return prismaErrorWrapper(() => config.handler(prisma, params, data))
            },
        }),
        typeValidate: config.validation.typeValidate.bind(config.validation),
        withData: true,
    } : ServiceMethodHandlerNoData(config)
}

function ServiceMethodHandlerNoData<
    Params,
    Return,
    WantsToOpenTransaction extends boolean,
>({
    handler,
}: {
    handler: (prisma: PrismaPossibleTransaction<WantsToOpenTransaction>, params: Params) => Promise<Return>
}): ServiceMethodHandler<false, void, void, Params, Return, WantsToOpenTransaction> {
    return {
        client: (prisma) => ({
            execute: ({ params }) => {
                if (prisma === 'NEW') {
                    return prismaErrorWrapper(() => handler(globalPrisma, params))
                }
                return prismaErrorWrapper(() => handler(prisma, params))
            },
        }),
        withData: false,
    }
}
