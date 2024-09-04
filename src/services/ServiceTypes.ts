import type { PrismaTransaction } from './prismaCall'
import type { SessionMaybeUser } from '@/auth/Session'
import { Auther } from "@/auth/auther/Auther";
import { z } from 'zod'

export type TypeValidateReturn<
    DetailedType
> = {
    success: true,
    data: DetailedType,
} | {
    success: false,
    error: z.ZodError,
}

export type PrismaTransactionOrNew = PrismaTransaction | 'NEW_TRANSACTION'

export type AuthRunConfig = {
    authConfig: {
        withAut: boolean,
    }
}

export type Execute<WithValidation extends boolean, DetailedType, Params extends object, Return extends object | void, WithAuthParam extends boolean> = WithAuthParam extends true ? {
    execute: (config: WithValidation extends true ? { data: DetailedType, params: Params, session: SessionMaybeUser } : { params: Params, session: SessionMaybeUser }, authRunConfig: AuthRunConfig) => Promise<Return>
} : {
    execute: (config: WithValidation extends true ? { data: DetailedType, params: Params, session: SessionMaybeUser } : { params: Params, session: SessionMaybeUser }) => Promise<Return>
}

export type Transaction<WithValidation extends boolean, DetailedType, Params extends object, Return extends object | void, WithAuthParam extends boolean> = {
    transaction: (prisma: PrismaTransactionOrNew) => Execute<WithValidation, DetailedType, Params, Return, WithAuthParam>
}


export type typeValidate<TypeType, DetailedType> = {
    typeValidate: (data: unknown | FormData | TypeType) => TypeValidateReturn<DetailedType>
}

type ServiceMethodOrHandler<
    WithValidation extends boolean,
    TypeType,
    DetailedType,
    Params extends object,
    WithAuthParam extends boolean,
    Return extends object | void,
> = Transaction<WithValidation, DetailedType, Params, Return, WithAuthParam> & (WithValidation extends true ? typeValidate<TypeType, DetailedType> : {}) & {
    withData: WithValidation,
}

export type ServiceMethodHandler<
    WithValidation extends boolean,
    TypeType,
    DetailedType,
    Params extends object,
    Return extends object | void = void,
> = ServiceMethodOrHandler<WithValidation, TypeType, DetailedType, Params, false, Return>

export type ServiceMethod<
    WithValidation extends boolean,
    TypeType,
    DetailedType,
    Params extends object,
    Return extends object | void = void,    
> = ServiceMethodOrHandler<WithValidation, TypeType, DetailedType, Params, true, Return>

export type ServiceMethodHandlerConfig<
    WithValidation extends boolean,
    TypeType,
    DetailedType,
    Params extends object,
    Return extends object | void = void,
> = WithValidation extends true ? {
    withData: true,
    validation: {
        detailedValidate: (data: DetailedType) => DetailedType,
        typeValidate: (data: unknown | FormData | TypeType) => TypeValidateReturn<DetailedType>,
    },
    handler: (
        prisma: PrismaTransaction,
        params: Params,
        data: DetailedType
    ) => Promise<Return>,
} : {
    withData: false,
    handler: (
        prisma: PrismaTransaction, 
        params: Params
    ) => Promise<Return>
}

type DynamicFieldsInput<
    WithValidation extends boolean,
    Params extends object,
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
    Params extends object,
    Return extends object | void,
    DynamicFields extends object | undefined,
    DynamicFieldsGetter extends DynamicFields
> =  { withData: WithValidation } & (WithValidation extends true ? {
    serviceMethodHandler: ServiceMethodHandler<true, TypeType, DetailedType, Params, Return>
    auther: Auther<'USER_NOT_REQUIERED_FOR_AUTHORIZED' | 'USER_REQUIERED_FOR_AUTHORIZED', DynamicFields>
    dynamicFields: (dataParams: DynamicFieldsInput<true, Params, DetailedType>) => DynamicFieldsGetter
} : {
    serviceMethodHandler: ServiceMethodHandler<false, void, void, Params, Return> & { withData: false }
    auther: Auther<'USER_NOT_REQUIERED_FOR_AUTHORIZED' | 'USER_REQUIERED_FOR_AUTHORIZED', object | undefined>
    dynamicFields: (dataParams: DynamicFieldsInput<false, Params, DetailedType>) => DynamicFieldsGetter
})