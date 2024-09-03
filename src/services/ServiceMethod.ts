import 'server-only'
import { prismaTransactionWithErrorConvertion, type PrismaTransaction } from './prismaCall'
import type { z } from 'zod'

type TypeValidateReturn<
    DetailedType
> = {
    success: true,
    data: DetailedType,
} | {
    success: false,
    error: z.ZodError,
}

type Transaction<WithValidation extends boolean, DetailedType, Params extends object, Return extends object | void> = {
    transaction: (prisma: PrismaTransaction | 'NEW_TRANSACTION') => {
        execute: (config: {params: Params} & (WithValidation extends true ? {data: DetailedType} : never)) => Promise<Return>
    }
}

type typeValidate<TypeType, DetailedType> = {
    typeValidate: (data: unknown | FormData | TypeType) => TypeValidateReturn<DetailedType>
}

export type ServiceMethod<
    WithValidation extends boolean,
    TypeType,
    DetailedType,
    Params extends object,
    Return extends object | void = void,
> = Transaction<WithValidation, DetailedType, Params, Return> & (WithValidation extends true ? typeValidate<TypeType, DetailedType> : {})


export function ServiceMethod<
    TypeType,
    DetailedType,
    Params extends object,
    Return extends object | void,
>(config: {
    validation: {
        detailedValidate: (data: DetailedType) => DetailedType,
        typeValidate: (data: unknown | FormData | TypeType) => TypeValidateReturn<DetailedType>,
    },
    handler: (
        prisma: PrismaTransaction,
        params: Params,
        data: DetailedType
    ) => Promise<Return>,
}): ServiceMethod<true, TypeType, DetailedType, Params, Return> {
    return {
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
    }
}


export function ServiceMethodNoData<
    Params extends object,
    Return extends object | void,
>({
    handler,
}: {
    handler: (prisma: PrismaTransaction, params: Params) => Promise<Return>
}): ServiceMethod<false, void, void, Params, Return> {
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
    }
}
