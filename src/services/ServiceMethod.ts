import 'server-only'
import { z } from 'zod'
import { prismaTransactionWithErrorConvertion, type PrismaTransaction } from './prismaCall'

type TypeValidateReturn<
    DetailedType
> = {
    success: true,
    data: DetailedType,
} | {
    success: false,
    error: z.ZodError,
}

export type ServiceMethod<
    TypeType,
    DetailedType,
    Params extends object,
    Return extends object | void = void,
> = {
    transaction: (prisma: PrismaTransaction | 'NEW_TRANSACTION') => {
        execute: (config: {params: Params, data: DetailedType}) => Promise<Return>
    }
    typeValidate: (data: unknown | FormData | TypeType) => TypeValidateReturn<DetailedType>
}

export function ServiceMethod<
    TypeType,
    DetailedType,
    Params extends object,
    Return extends object | void = void,
>({
    validation,
    handler,
}: {
    validation: {
        detailedValidate: (data: DetailedType) => DetailedType,
        typeValidate: (data: unknown | FormData | TypeType) => TypeValidateReturn<DetailedType>,
    },
    handler: (
        prisma: PrismaTransaction, 
        params: Params, 
        data: DetailedType
    ) => Promise<Return>,
}) : ServiceMethod<TypeType, DetailedType, Params, Return> {
    return {
        transaction: (prisma) => ({
            execute: ({
                params,
                data: rawdata,
            }) => {
                const data = validation.detailedValidate(rawdata);
                if (prisma === 'NEW_TRANSACTION') {
                    return prismaTransactionWithErrorConvertion(
                        newprisma => handler(newprisma, params, data)
                    );
                }
                return handler(prisma, params, data);
            },
        }),
        typeValidate: validation.typeValidate,
    };
}
