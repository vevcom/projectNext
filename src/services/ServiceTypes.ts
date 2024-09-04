import type { SessionMaybeUser } from '@/auth/Session'
import { Auther } from "@/auth/auther/Auther";
import { PrismaClient } from '@prisma/client';
import { z } from 'zod'
import prisma from '@/prisma'

export type PrismaTransaction = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]

export type TypeValidateReturn<
    DetailedType
> = {
    success: true,
    data: DetailedType,
} | {
    success: false,
    error: z.ZodError,
}

export type PrismaPossibleTransaction<
    WantsToOpenTransaction extends boolean
> = WantsToOpenTransaction extends true ? PrismaClient : PrismaTransaction

export type PrismaTransactionOrNew<
    WantsToOpenTransaction extends boolean
> = PrismaPossibleTransaction<WantsToOpenTransaction> | 'GLOBAL'


export type AuthRunConfig = {
    authConfig: {
        withAut: boolean,
    }
}

export type Execute<WithValidation extends boolean, DetailedType, Params, Return, WithAuthParam extends boolean> = WithAuthParam extends true ? {
    execute: (config: WithValidation extends true ? { data: DetailedType, params: Params, session: SessionMaybeUser } : { params: Params, session: SessionMaybeUser }, authRunConfig: AuthRunConfig) => Promise<Return>
} : {
    execute: (config: WithValidation extends true ? { data: DetailedType, params: Params, session: SessionMaybeUser } : { params: Params, session: SessionMaybeUser }) => Promise<Return>
}

export type Client<WithValidation extends boolean, DetailedType, Params, Return, WithAuthParam extends boolean, WantsToOpenTransaction extends boolean> = {
    client: (prisma: PrismaTransactionOrNew<WantsToOpenTransaction>) => Execute<WithValidation, DetailedType, Params, Return, WithAuthParam>
}


export type typeValidate<TypeType, DetailedType> = {
    typeValidate: (data: unknown | FormData | TypeType) => TypeValidateReturn<DetailedType>
}

type ServiceMethodOrHandler<
    WithValidation extends boolean,
    TypeType,
    DetailedType,
    Params,
    WithAuthParam extends boolean,
    Return,
    WantsToOpenTransaction extends boolean,
> = Client<WithValidation, DetailedType, Params, Return, WithAuthParam, WantsToOpenTransaction> & (WithValidation extends true ? typeValidate<TypeType, DetailedType> : {}) & {
    withData: WithValidation,
}

export type ServiceMethodHandler<
    WithValidation extends boolean,
    TypeType,
    DetailedType,
    Params,
    Return,
    WantsToOpenTransaction extends boolean,
> = ServiceMethodOrHandler<WithValidation, TypeType, DetailedType, Params, false, Return, WantsToOpenTransaction>

export type ServiceMethod<
    WithValidation extends boolean,
    TypeType,
    DetailedType,
    Params,
    Return,    
    WantsToOpenTransaction extends boolean,
> = ServiceMethodOrHandler<WithValidation, TypeType, DetailedType, Params, true, Return, WantsToOpenTransaction>

export type ServiceMethodHandlerConfig<
    WithValidation extends boolean,
    TypeType,
    DetailedType,
    Params,
    Return,
    WantsToOpenTransaction extends boolean,
> = WithValidation extends true ? {
    withData: true,
    wantsToOpenTransaction?: WantsToOpenTransaction,
    validation: {
        detailedValidate: (data: DetailedType) => DetailedType,
        typeValidate: (data: unknown | FormData | TypeType) => TypeValidateReturn<DetailedType>,
    },
    handler: (
        prisma: PrismaPossibleTransaction<WantsToOpenTransaction>,
        params: Params,
        data: DetailedType
    ) => Promise<Return>,
} : {
    withData: false,
    handler: (
        prisma: PrismaPossibleTransaction<WantsToOpenTransaction>, 
        params: Params
    ) => Promise<Return>
}

type DynamicFieldsInput<
    WithValidation extends boolean,
    Params,
    DetailedType
> = WithValidation extends true ? {
    params: Params,
    data: DetailedType,
} : {
    params: Params,
}

export type ServiceMethodConfig<
    WithValidation extends boolean,
    TypeType,
    DetailedType,
    Params,
    Return,
    DynamicFields,
    WantsToOpenTransaction extends boolean,
> =  { withData: WithValidation } & (WithValidation extends true ? {
    serviceMethodHandler: ServiceMethodHandler<true, TypeType, DetailedType, Params, Return, WantsToOpenTransaction>
    auther: Auther<'USER_NOT_REQUIERED_FOR_AUTHORIZED' | 'USER_REQUIERED_FOR_AUTHORIZED', DynamicFields>
    dynamicFields: (dataParams: DynamicFieldsInput<true, Params, DetailedType>) => DynamicFields
} : {
    serviceMethodHandler: ServiceMethodHandler<false, void, void, Params, Return, WantsToOpenTransaction> & { withData: false }
    auther: Auther<'USER_NOT_REQUIERED_FOR_AUTHORIZED' | 'USER_REQUIERED_FOR_AUTHORIZED', DynamicFields>
    dynamicFields: (dataParams: DynamicFieldsInput<false, Params, DetailedType>) => DynamicFields
})
