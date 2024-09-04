import type { default as prismaGlobal } from '@/prisma'
import type { z } from 'zod'
import type { PrismaClient } from '@prisma/client'
import type { Auther } from '@/auth/auther/Auther'
import type { SessionMaybeUser } from '@/auth/Session'

export type PrismaTransaction = Parameters<Parameters<typeof prismaGlobal.$transaction>[0]>[0]

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
> = PrismaPossibleTransaction<WantsToOpenTransaction> | 'NEW'


export type AuthRunConfig = {
    withAuth: boolean,
}

type ConfigType<Params> = {
    params: Params,
    session: SessionMaybeUser
}

type ConfigTypeData<DetailedType, Params> = ConfigType<Params> & {
    data: DetailedType,
}

export type Execute<
    WithValidation extends boolean,
    DetailedType,
    Params,
    Return,
    WithAuthParam extends boolean
> = WithAuthParam extends true ? {
    execute: (config: WithValidation extends true
        ? ConfigTypeData<DetailedType, Params>
        : ConfigType<Params>,
        authRunConfig: AuthRunConfig) => Promise<Return>
} : {
    execute: (config: WithValidation extends true
        ? ConfigTypeData<DetailedType, Params>
        : ConfigType<Params>) => Promise<Return>
}

export type Client<
    WithValidation extends boolean,
    DetailedType,
    Params,
    Return,
    WithAuthParam extends boolean,
    WantsToOpenTransaction extends boolean
> = {
    client: (
        prisma: PrismaTransactionOrNew<WantsToOpenTransaction>
    ) => Execute<WithValidation, DetailedType, Params, Return, WithAuthParam>
}


export type typeValidate<TypeType, DetailedType> = {
    typeValidate: (
        data: unknown | FormData | TypeType
    ) => TypeValidateReturn<DetailedType>
}

type ServiceMethodOrHandler<
    WithValidation extends boolean,
    TypeType,
    DetailedType,
    Params,
    WithAuthParam extends boolean,
    Return,
    WantsToOpenTransaction extends boolean,
> = Client<
    WithValidation,
    DetailedType,
    Params,
    Return,
    WithAuthParam,
    WantsToOpenTransaction
> & (WithValidation extends true ? (typeValidate<TypeType, DetailedType> & {
    withData: WithValidation
}) : {
    withData: WithValidation,
})

export type ServiceMethodHandler<
    WithValidation extends boolean,
    TypeType,
    DetailedType,
    Params,
    Return,
    WantsToOpenTransaction extends boolean,
> = ServiceMethodOrHandler<
    WithValidation, TypeType, DetailedType, Params, false, Return, WantsToOpenTransaction
>

export type ServiceMethod<
    WithValidation extends boolean,
    TypeType,
    DetailedType,
    Params,
    Return,
    WantsToOpenTransaction extends boolean,
    NoAuther extends boolean
> = ServiceMethodOrHandler<
    WithValidation, TypeType, DetailedType, Params, NoAuther extends true ? false : true, Return, WantsToOpenTransaction
>

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
        typeValidate: (
            data: unknown | FormData | TypeType
        ) => TypeValidateReturn<DetailedType>,
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

type ServiceMethodHandlerAuthConfig<
    WithValidation extends boolean,
    DetailedType,
    Params,
    DynamicFields,
> = {
    auther: Auther<'USER_NOT_REQUIERED_FOR_AUTHORIZED' | 'USER_REQUIERED_FOR_AUTHORIZED', DynamicFields>
    dynamicFields: (dataParams: DynamicFieldsInput<WithValidation, Params, DetailedType>) => DynamicFields
}

export type ServiceMethodConfig<
    WithValidation extends boolean,
    TypeType,
    DetailedType,
    Params,
    Return,
    DynamicFields,
    WantsToOpenTransaction extends boolean,
    NoAuther extends boolean
> = { withData: WithValidation } & (NoAuther extends true ? ({
    hasAuther: false,
    serviceMethodHandler: WithValidation extends true ? (
        ServiceMethodHandler<
            true, TypeType, DetailedType, Params, Return, WantsToOpenTransaction
        >
    ) : (
        ServiceMethodHandler<
            false, void, void, Params, Return, WantsToOpenTransaction
        >
    )
}):({ hasAuther: true } & (
    WithValidation extends true ? (
        {
            serviceMethodHandler: ServiceMethodHandler<
                true, TypeType, DetailedType, Params, Return, WantsToOpenTransaction
            >
        } & ServiceMethodHandlerAuthConfig<
            true, DetailedType, Params, DynamicFields
        >
    ) : (
        {
            serviceMethodHandler: ServiceMethodHandler<
                false, void, void, Params, Return, WantsToOpenTransaction
            > & { withData: false }
        } & ServiceMethodHandlerAuthConfig<
            false, void, Params, DynamicFields
        >
    )
)))

