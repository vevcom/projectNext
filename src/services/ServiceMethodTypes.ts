import 'server-only'
import type { TypeValidateReturn } from './ServiceTypes'
import type { AutherStaticFieldsBound } from '@/auth/auther/Auther'
import type { SessionMaybeUser } from '@/auth/Session'
import type { Prisma, PrismaClient } from '@prisma/client'
import type { z } from 'zod'

/**
 * This is the type for the prisma client that is passed to the service method.
 * It can't simply be PrismaClient because it can be usefull to use a service method
 * inside a transaction. In that case, the prisma client is a Prisma.TransactionClient.
 * The caveat is that a Prisma.TransactionClient can't be used to open a new transaction
 * so if the service method opens a transaction, the prisma client can only be a PrismaClient.
 */
export type PrismaPossibleTransaction<
    OpensTransaction extends boolean
> = OpensTransaction extends true ? PrismaClient : Prisma.TransactionClient

/**
 * Type for an object that contains params and data fields as long as thery are not undefined.
 * For example, if Params is undefined and Data is not, the type will be { data: Data }.
 * Conversely, if Data is undefined and Params is not, the type will be { params: Params }.
 * If both are undefined, the type will be {}.
 * This is used to make the type of the arguments of a service method align with whether
 * or not the underlying method expects params/data or not.
 */
export type ServiceMethodParamsData<Params, TakesParams extends boolean, Data, TakesData extends boolean> = (
    TakesParams extends true ? { params: Params } : {}
) & (
    TakesData extends true ? { data: Data } : {}
)

/**
 * This is the type for the arguments that are passed to the method implementation of a service method.
 */
export type ServiceMethodArguments<OpensTransaction extends boolean, Params, TakesParams extends boolean, Data, TakesData extends boolean> = {
    prisma: PrismaPossibleTransaction<OpensTransaction>,
    session: SessionMaybeUser,
} & ServiceMethodParamsData<Params, TakesParams, Data, TakesData>

/**
 * This is the type for the argument that are passed to the execute method of a service method.
 */
export type ServiceMethodExecuteArgs<Params, TakesParams extends boolean, Data, TakesData extends boolean> = {
    session: SessionMaybeUser,
    bypassAuth?: boolean,
} & ServiceMethodParamsData<Params, TakesParams, Data, TakesData>

/**
 * This is the type for the configuration of a service method. I.e. what is passed to the ServiceMethod function when creating a service method.
 */
export type ServiceMethodConfig<Params, TakesParams extends boolean, GeneralData, DetailedData, TakesData extends boolean, OpensTransaction extends boolean, Return, DynamicFields extends object> = {
    opensTransaction?: OpensTransaction,
    takesParams: TakesParams,
    takesData: TakesData,
    method: (args: ServiceMethodArguments<OpensTransaction, Params, TakesParams, DetailedData, TakesData>) => Return,
} & (
    {
        auther: AutherStaticFieldsBound<DynamicFields, 'USER_NOT_REQUIERED_FOR_AUTHORIZED' | 'USER_REQUIERED_FOR_AUTHORIZED'>,
        dynamicAuthFields: (paramsData: ServiceMethodParamsData<Params, TakesParams, DetailedData, TakesData>) => DynamicFields | Promise<DynamicFields>,
    } | {
        auther: 'NO_AUTH',
    }
) & (
    TakesParams extends true ? {
        paramsSchema: z.ZodType<Params>,
    } : {}
) & (
    TakesData extends true ? {
        validation: {
            detailedValidate: (data: DetailedData | unknown) => DetailedData,
            typeValidate: (data: unknown | FormData | GeneralData) => TypeValidateReturn<DetailedData>,
        } 
    } : {}
)

/**
 * This is the return type of the ServiceMethod function. It contains a client function that can be used
 * to pass a specific prisma client to the service method, and a newClient function that can be used to
 * pass the global prisma client to the service method.
 *
 * TypeScript is smart enough to infer the behaviour of the return functons without the need to excplitly
 * type the return type of the ServiceMethod function, but it is done so for the sake of clarity.
 */
export type ServiceMethodReturn<Params, TakesParams extends boolean, GeneralData, DetailedData, TakesData extends boolean, Return, OpensTransaction extends boolean> = {
    takesParams: TakesParams,
    takesData: TakesData,
    /**
     * Pass a specific prisma client to the service method. Usefull when using the service method inside a transaction.
     * @note
     * @param client
     */
    client: (client: PrismaPossibleTransaction<OpensTransaction>) => {
        execute: (args: ServiceMethodExecuteArgs<Params, TakesParams, DetailedData, TakesData>) => Promise<Return>,
    },
    /**
     * Use the global prisma client for the service method.
     */
    newClient: () => ReturnType<ServiceMethodReturn<Params, TakesParams, GeneralData, DetailedData, TakesData, Return, OpensTransaction>['client']>,
    typeValidate?: (data: unknown | FormData | GeneralData) => TypeValidateReturn<DetailedData>,
}