import 'server-only'
import type { z } from 'zod'
import type { TypeValidateReturn } from './ServiceTypes'
import type { AutherStaticFieldsBound } from '@/auth/auther/Auther'
import type { SessionMaybeUser } from '@/auth/Session'
import type { Prisma, PrismaClient } from '@prisma/client'

// TODO: These two types should really be defined in Validation.ts
export type Validation<GeneralData, DetailedData> = {
    detailedValidate: (data: DetailedData | unknown) => DetailedData,
    typeValidate: (data: unknown | FormData | GeneralData) => TypeValidateReturn<DetailedData>,
}

export type ExtractDetailedType<V extends Validation<unknown, unknown>> = ReturnType<V['detailedValidate']>

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
 * If both are undefined, the type will be object.
 * This is used to make the type of the arguments of a service method align with whether
 * or not the underlying method expects params/data or not.
 */
export type ServiceMethodParamsData<
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataValidation extends Validation<unknown, unknown> | undefined,
> = (
    ParamsSchema extends undefined ? object : { params: z.infer<NonNullable<ParamsSchema>> }
) & (
    DataValidation extends undefined ? object : { data: ExtractDetailedType<NonNullable<DataValidation>> }
)

// TODO: Refactor into maybe one type? Or maybe something more concise?
export type ServiceMethodParamsDataUnsafe = {
    params?: unknown,
    data?: unknown,
}

/**
 * This is the type for the arguments that are passed to the method implementation of a service method.
 */
export type ServiceMethodArguments<
    OpensTransaction extends boolean,
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataValidation extends Validation<unknown, unknown> | undefined,
> = {
    prisma: PrismaPossibleTransaction<OpensTransaction>,
    session: SessionMaybeUser,
} & ServiceMethodParamsData<ParamsSchema, DataValidation>

/**
 * This is the type for the argument that are passed to the execute method of a service method.
 */
export type ServiceMethodExecuteArgs<
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataValidation extends Validation<unknown, unknown> | undefined,
> = {
    session: SessionMaybeUser | null,
    bypassAuth?: boolean,
} & ServiceMethodParamsData<ParamsSchema, DataValidation>

/**
 * This is the type for the argument that are passed to the execute method of a service method.
 */
export type ServiceMethodExecuteArgsUnsafe = {
    session: SessionMaybeUser | null,
    bypassAuth?: boolean,
} & ServiceMethodParamsDataUnsafe

/**
 * This is the type for the configuration of a service method.
 * I.e. what is passed to the ServiceMethod function when creating a service method.
 */
export type ServiceMethodConfig<
    DynamicFields extends object,
    OpensTransaction extends boolean,
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataValidation extends Validation<unknown, unknown> | undefined,
> = ({
    paramsSchema?: ParamsSchema,
    dataValidation?: DataValidation,
    opensTransaction?: OpensTransaction,
    method: (
        args: ServiceMethodArguments<OpensTransaction, ParamsSchema, DataValidation>
    ) => Return | Promise<Return>,
} & (
    {
        auther: AutherStaticFieldsBound<DynamicFields>,
        dynamicAuthFields: (
            paramsData: ServiceMethodParamsData<ParamsSchema, DataValidation>
        ) => DynamicFields | Promise<DynamicFields>,
    } | {
        auther: 'NO_AUTH',
    }
))

/**
 * This is the return type of the ServiceMethod function. It contains a client function that can be used
 * to pass a specific prisma client to the service method, and a newClient function that can be used to
 * pass the global prisma client to the service method.
 *
 * TypeScript is smart enough to infer the behaviour of the return functons without the need to excplitly
 * type the return type of the ServiceMethod function, but it is done so for the sake of clarity.
 */
export type ServiceMethodReturn<
    OpensTransaction extends boolean,
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataValidation extends Validation<unknown, unknown> | undefined,
> = {
    /**
     * Pass a specific prisma client to the service method. Usefull when using the service method inside a transaction.
     * @note
     * @param client
     */
    client: (client: PrismaPossibleTransaction<OpensTransaction>) => {
        execute: (args: ServiceMethodExecuteArgs<ParamsSchema, DataValidation>) => Promise<Return>,
        executeUnsafe: (args: ServiceMethodExecuteArgsUnsafe) => Promise<Return>,
    },
    /**
     * Use the global prisma client for the service method.
     */
    newClient: () => (
        ReturnType<
            ServiceMethodReturn<OpensTransaction, Return, ParamsSchema, DataValidation>['client']
        >
    ),
    paramsSchema?: ParamsSchema,
    dataValidation?: DataValidation,
}

// export type ServiceMethodReturns<
//     OpensTransaction extends boolean,
//     Return,
//     ParamsSchema extends z.ZodTypeAny,
//     DataValidation extends Validation<unknown, unknown>,
// > =
//  | ServiceMethodReturn<OpensTransaction, Return, undefined,    undefined>
//  | ServiceMethodReturn<OpensTransaction, Return, undefined,    DataValidation>
//  | ServiceMethodReturn<OpensTransaction, Return, ParamsSchema, undefined>
//  | ServiceMethodReturn<OpensTransaction, Return, ParamsSchema, DataValidation>
