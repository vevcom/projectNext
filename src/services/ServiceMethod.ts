import '@pn-server-only'
import { ParseError, Smorekopp } from './error'
import { prismaErrorWrapper } from './prismaCall'
import { default as globalPrisma } from '@/prisma'
import { Session } from '@/auth/Session'
import { zfd } from 'zod-form-data'
import type { z } from 'zod'
import type { SessionMaybeUser } from '@/auth/Session'
import type { Prisma, PrismaClient } from '@prisma/client'
import type { AutherStaticFieldsBound } from '@/auth/auther/Auther'

export type InferedOrInput<Schema extends z.ZodTypeAny | undefined, InferedOfInput extends 'INFERED' | 'INPUT'> =
    Schema extends undefined
        ? object
        : InferedOfInput extends 'INFERED' ? z.infer<NonNullable<Schema>> : z.input<NonNullable<Schema>>

export type ParamsObject<ParamsSchema extends z.ZodTypeAny | undefined, InferedOfInput extends 'INFERED' | 'INPUT'> =
    ParamsSchema extends undefined
        ? object
        : { params: InferedOrInput<ParamsSchema, InferedOfInput> }
export type ImplementationParamsObject<
    ImplementationParamsSchema extends z.AnyZodObject | undefined,
    InferedOfInput extends 'INFERED' | 'INPUT'
> =
    ImplementationParamsSchema extends undefined
        ? object
        : { implementationParams: InferedOrInput<ImplementationParamsSchema, InferedOfInput> }
export type DataObject<DataSchema extends z.ZodTypeAny | undefined, InferedOfInput extends 'INFERED' | 'INPUT'> =
    DataSchema extends undefined
        ? object
        : { data: InferedOrInput<DataSchema, InferedOfInput> }

/**
 * This is the type for the argument that are passed to the execute method of a service method.
 */
export type ServiceMethodExecuteArgs<
    Unsafe extends 'UNSAFE' | 'SAFE',
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataSchema extends z.ZodTypeAny | undefined,
    ImplementationParamsSchema extends z.AnyZodObject | undefined
> = {
    session: SessionMaybeUser | null,
    bypassAuth?: boolean,
} & (
    Unsafe extends 'UNSAFE'
        ? {
            params?: unknown,
            implementationParams?: unknown,
            data?: unknown,
        }
        :
            & ParamsObject<ParamsSchema, 'INPUT'>
            & ImplementationParamsObject<ImplementationParamsSchema, 'INPUT'>
            & DataObject<DataSchema, 'INPUT'>
)

export type ServiceMethodMethod<
    OpensTransaction extends boolean,
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataSchema extends z.ZodTypeAny | undefined,
    Return,
> = (
    args: {
        prisma: PrismaPossibleTransaction<OpensTransaction>,
        session: SessionMaybeUser,
    } & ParamsObject<ParamsSchema, 'INFERED'> & DataObject<DataSchema, 'INFERED'>
) => Promise<Return> | Return

export type SubServiceMethodConfig<
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataSchema extends z.ZodTypeAny | undefined,
    ParamsSchemaImplementationFields extends object | undefined,
    DataSchemaImplementationFields extends object | undefined,
    MethodImplementationParams extends object | undefined,
    Return,
    OpensTransaction extends boolean = false,
> = {
    paramsSchema?: ((implementationFields: ParamsSchemaImplementationFields) => ParamsSchema) | undefined,
    dataSchema?: (implementationFields: DataSchemaImplementationFields) => DataSchema | undefined,
    opensTransaction?: OpensTransaction,
    method: (implementationParams: MethodImplementationParams) =>
        ServiceMethodMethod<OpensTransaction, ParamsSchema, DataSchema, Return>
}

export type AutherGetter<
    AutherDynamicFields extends object,
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataSchema extends z.ZodTypeAny | undefined,
    ImplementationParamsSchema extends z.AnyZodObject | undefined
> = (
    paramsData: ParamsObject<ParamsSchema, 'INFERED'> &
        ImplementationParamsObject<ImplementationParamsSchema, 'INFERED'> &
        DataObject<DataSchema, 'INFERED'>
) => // Todo: Make prettier type for returntype of dynamic fields
    | ReturnType<AutherStaticFieldsBound<AutherDynamicFields>['dynamicFields']>
    | Promise<ReturnType<AutherStaticFieldsBound<AutherDynamicFields>['dynamicFields']>>

export type ServiceMethodImplementationConfig<
    ImplementationParamsSchema extends z.AnyZodObject | undefined,
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataSchema extends z.ZodTypeAny | undefined,
    ParamsSchemaImplementationFields extends object | undefined,
    DataSchemaImplementationFields extends object | undefined,
    MethodImplementationFields extends object | undefined,
    AutherDynamicFields extends object
> = {
    implementationParamsSchema: ImplementationParamsSchema,
    auther: AutherGetter<AutherDynamicFields, ParamsSchema, DataSchema, ImplementationParamsSchema>,
    paramsSchemaImplementationFields: ParamsSchemaImplementationFields
    dataSchemaImplementationFields: DataSchemaImplementationFields
    methodImplementationFields: MethodImplementationFields
}


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
 * This is the return type of the ServiceMethod function. It contains a client function that can be used
 * to pass a specific prisma client to the service method, and a newClient function that can be used to
 * pass the global prisma client to the service method.
 *
 * TypeScript is smart enough to infer the behaviour of the return functons without the need to excplitly
 * type the return type of the ServiceMethod function, but it is done so for the sake of clarity.
 */
export type ServiceMethodType<
    OpensTransaction extends boolean,
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataSchema extends z.ZodTypeAny | undefined = undefined,
    ImplementationParamsSchema extends z.AnyZodObject | undefined = undefined
> = {
    /**
     * Pass a specific prisma client to the service method. Usefull when using the service method inside a transaction.
     * @note
     * @param client
     */
    client: (client: PrismaPossibleTransaction<OpensTransaction>) => {
        execute: (
            args: ServiceMethodExecuteArgs<'SAFE', ParamsSchema, DataSchema, ImplementationParamsSchema>
        ) => Promise<Return>,
        executeUnsafe: (
            args: ServiceMethodExecuteArgs<'UNSAFE', ParamsSchema, DataSchema, ImplementationParamsSchema>
        ) => Promise<Return>,
    },
    /**
     * Use the global prisma client for the service method.
     */
    newClient: () => (
        ReturnType<
            ServiceMethodType<OpensTransaction, Return, ParamsSchema, DataSchema, ImplementationParamsSchema>['client']
        >
    ),
    paramsSchema?: ParamsSchema,
    dataSchema?: DataSchema,
    implementationParamsSchema?: ImplementationParamsSchema,
}

export function SubServiceMethod<
    Return,
    OpensTransaction extends boolean = false,
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataSchema extends z.ZodTypeAny | undefined = undefined,
    ParamsSchemaImplementationFields extends object | undefined = undefined,
    DataSchemaImplementationFields extends object | undefined = undefined,
    MethodImplementationParams extends object | undefined = undefined,
>(
    serviceMethodConfig: SubServiceMethodConfig<
        ParamsSchema,
        DataSchema,
        ParamsSchemaImplementationFields,
        DataSchemaImplementationFields,
        MethodImplementationParams,
        Return,
        OpensTransaction
    >
) {
    return {
        implement: <
            ImplementationParamsSchema extends z.AnyZodObject | undefined,
            AutherDynamicFields extends object
        >(
            implementationArgs: ServiceMethodImplementationConfig<
                ImplementationParamsSchema,
                ParamsSchema,
                DataSchema,
                ParamsSchemaImplementationFields,
                DataSchemaImplementationFields,
                MethodImplementationParams,
                AutherDynamicFields
                >
        ) : ServiceMethodType<OpensTransaction, Return, ParamsSchema, DataSchema, ImplementationParamsSchema> => {
            const expectedArgsArePresent = (
                args: ServiceMethodExecuteArgs<'UNSAFE', ParamsSchema, DataSchema, ImplementationParamsSchema>
            ): args is ServiceMethodExecuteArgs<'SAFE', ParamsSchema, DataSchema, ImplementationParamsSchema> => {
                const paramsMatch =
                    Boolean(args.params) === Boolean(serviceMethodConfig.paramsSchema)
                const dataMatches =
                    Boolean(args.data) === Boolean(serviceMethodConfig.dataSchema)
                const implementationParamsMatch =
                    Boolean(args.implementationParams) === Boolean(implementationArgs.methodImplementationFields)
                return paramsMatch && dataMatches && implementationParamsMatch
            }

            const client = (prisma: PrismaPossibleTransaction<OpensTransaction>) => {
                const executeUnsafe = async (
                    args: ServiceMethodExecuteArgs<'UNSAFE', ParamsSchema, DataSchema, ImplementationParamsSchema>
                ) => {
                    if (args.params) {
                        if (!serviceMethodConfig.paramsSchema) {
                            throw new Smorekopp(
                                'BAD PARAMETERS', 'Service method recieved params, but has no params schema.'
                            )
                        }
                        const paramsSchema = serviceMethodConfig.paramsSchema(
                            implementationArgs.paramsSchemaImplementationFields!
                        )
                        if (!paramsSchema) {
                            throw new Smorekopp(
                                'BAD PARAMETERS', 'Service method recieved params, but has no params schema.'
                            )
                        }
                        const paramsParse = paramsSchema.safeParse(args.params)

                        if (!paramsParse.success) {
                            console.log(paramsParse) // TODO: This needs to be returned to give good error message.
                            throw new Smorekopp('BAD PARAMETERS', 'Invalid params passed to service method.')
                        }

                        args.params = paramsParse.data
                    }
                    if (args.data) {
                        if (!serviceMethodConfig.dataSchema) {
                            throw new Smorekopp(
                                'BAD PARAMETERS', 'Service method recieved data, but has no data schema. 1'
                            )
                        }
                        const dataSchema = serviceMethodConfig.dataSchema(
                            implementationArgs.dataSchemaImplementationFields
                        )
                        if (!dataSchema) {
                            throw new Smorekopp(
                                'BAD PARAMETERS', 'Service method recieved data, but has no data schema. 2'
                            )
                        }
                        const dataParse = zfd.formData(dataSchema).safeParse(args.data)
                        if (!dataParse.success) {
                            console.log(dataParse)
                            throw new ParseError(dataParse)
                        }
                        args.data = dataParse.data
                    }

                    if (args.implementationParams) {
                        if (!implementationArgs.implementationParamsSchema) {
                            throw new Smorekopp(
                                'BAD PARAMETERS',
                                'Service method recieved implementation params, but has no implementation params schema.'
                            )
                        }
                        const implementationParamsSchema = implementationArgs.implementationParamsSchema
                        const implementationParamsParse = implementationParamsSchema.safeParse(
                            args.implementationParams
                        )
                        if (!implementationParamsParse.success) {
                            // TODO: This needs to be returned to give good error message.
                            console.log(implementationParamsParse)
                            throw new Smorekopp('BAD PARAMETERS', 'Invalid implementation params passed to service method.')
                        }
                        args.implementationParams = implementationParamsParse.data
                    }

                    if (!expectedArgsArePresent(args)) {
                        throw new Smorekopp(
                            'SERVER ERROR',
                            'Service method recieved invalid arguments.'
                        )
                    }

                    if (!args.bypassAuth) {
                        const authRes = (await implementationArgs.auther(args)).auth(args.session ?? Session.empty())
                        if (!authRes.authorized) {
                            throw new Smorekopp(authRes.status, authRes.getErrorMessage)
                        }
                    }

                    return prismaErrorWrapper(() => serviceMethodConfig.method(
                        implementationArgs.methodImplementationFields
                    )({
                        ...args,
                        prisma,
                        session: args.session ?? Session.empty()
                    }))
                }

                return {
                    executeUnsafe,
                    execute: (
                        args: ServiceMethodExecuteArgs<'SAFE', ParamsSchema, DataSchema, ImplementationParamsSchema>
                    ) => executeUnsafe(args)
                }
            }

            return {
                client,
                newClient: () => client(globalPrisma),
                paramsSchema: serviceMethodConfig.paramsSchema && implementationArgs.paramsSchemaImplementationFields ?
                    serviceMethodConfig.paramsSchema(implementationArgs.paramsSchemaImplementationFields) :
                    undefined,
                dataSchema: serviceMethodConfig.dataSchema && implementationArgs.dataSchemaImplementationFields ?
                    serviceMethodConfig.dataSchema(implementationArgs.dataSchemaImplementationFields) :
                    undefined,
                implementationParamsSchema: implementationArgs.implementationParamsSchema
            }
        }
    }
}

export function ServiceMethod<
    AutherDynamicFields extends object,
    OpensTransaction extends boolean,
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataSchema extends z.ZodTypeAny | undefined = undefined,
>({ paramsSchema, dataSchema, opensTransaction, auther, method }: {
    paramsSchema?: ParamsSchema,
    dataSchema?: DataSchema,
    opensTransaction?: OpensTransaction,
    auther: AutherGetter<AutherDynamicFields, ParamsSchema, DataSchema, undefined>,
    method: ServiceMethodMethod<OpensTransaction, ParamsSchema, DataSchema, Return>
}) {
    return SubServiceMethod<
        Return,
        OpensTransaction,
        ParamsSchema,
        DataSchema,
        undefined,
        undefined,
        undefined
    >({
        opensTransaction,
        method: () => method,
        paramsSchema: paramsSchema !== undefined ? () => paramsSchema : undefined,
        dataSchema: dataSchema !== undefined ? () => dataSchema : undefined,
    }).implement({
        auther,
        implementationParamsSchema: undefined,
        dataSchemaImplementationFields: undefined,
        paramsSchemaImplementationFields: undefined,
        methodImplementationFields: undefined,
    })
}
