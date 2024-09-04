import 'server-only'
import { prismaTransactionWithErrorConvertion, type PrismaTransaction } from './prismaCall'
import type { ServiceMethodHandlerConfig, ServiceMethodHandler } from './ServiceTypes'

export function ServiceMethodHandler<
    Params extends object,
    Return extends object | void,
>({
    handler,
}: ServiceMethodHandlerConfig<false, void, void, Params, Return>): ServiceMethodHandler<false, void, void, Params, Return>

export function ServiceMethodHandler<
    TypeType,
    DetailedType,
    Params extends object,
    Return extends object | void,
>(config: ServiceMethodHandlerConfig<true, TypeType, DetailedType, Params, Return>): ServiceMethodHandler<true, TypeType, DetailedType, Params, Return>

export function ServiceMethodHandler<
    TypeType,
    DetailedType,
    Params extends object,
    Return extends object | void,
>(
    config: 
    | ServiceMethodHandlerConfig<true, TypeType, DetailedType, Params, Return>
    | ServiceMethodHandlerConfig<false, void, void, Params, Return>
) : ServiceMethodHandler<true, TypeType, DetailedType, Params, Return> | 
    ServiceMethodHandler<false, void, void, Params, Return> 
{
    return config.withData ? {
        transaction: (prisma) => ({
            execute: ({
                params,
                data: rawdata,
            }) => {
                const data = config.validation.detailedValidate(rawdata)
                if (prisma === 'NEW_TRANSACTION') {
                    return prismaTransactionWithErrorConvertion(
                        newprisma => config.handler(newprisma, params, data)
                    )
                }
                return config.handler(prisma, params, data)
            },
        }),
        typeValidate: config.validation.typeValidate,
        withData: true,
    } : ServiceMethodHandlerNoData(config)
}

function ServiceMethodHandlerNoData<
    Params extends object,
    Return extends object | void,
>({
    handler,
}: {
    handler: (prisma: PrismaTransaction, params: Params) => Promise<Return>
}): ServiceMethodHandler<false, void, void, Params, Return> {
    return {
        transaction: (prisma) => ({
            execute: ({ params }) => {
                if (prisma === 'NEW_TRANSACTION') {
                    return prismaTransactionWithErrorConvertion(
                        newprisma => handler(newprisma, params)
                    )
                }
                return handler(prisma, params)
            },
        }),
        withData: false,
    }
}
