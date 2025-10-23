import '@pn-server-only'
import { ParseError, Smorekopp } from './error'
import { prismaErrorWrapper } from './prismaCall'
import { prisma as globalPrisma } from '@/prisma/client'
import { RequireNothing } from '@/auth/auther/RequireNothing'
import { Session } from '@/auth/session/Session'
import { zfd } from 'zod-form-data'
import { AsyncLocalStorage } from 'async_hooks'
import type { AutherResult } from '@/auth/auther/Auther'
import type { z } from 'zod'
import type { SessionMaybeUser } from '@/auth/session/Session'
import type { Prisma, PrismaClient } from '@prisma/client'

export type InferedOrInput<Schema extends z.ZodTypeAny | undefined, InferedOfInput extends 'INFERED' | 'INPUT'> =
    Schema extends undefined
        ? object
        : InferedOfInput extends 'INFERED' ? z.infer<NonNullable<Schema>> : z.input<NonNullable<Schema>>

export type ParamsObject<ParamsSchema extends z.ZodTypeAny | undefined, InferedOfInput extends 'INFERED' | 'INPUT'> =
    ParamsSchema extends undefined
        ? object
        : { params: InferedOrInput<ParamsSchema, InferedOfInput> }

export type ImplementationParamsObject<
    ImplementationParamsSchema extends z.ZodTypeAny | undefined,
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
 * This is the type for the argument that are passed to the execute operation of a service operation.
 */
export type ServiceOperationExecuteArgs<
    Unsafe extends 'UNSAFE' | 'SAFE',
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataSchema extends z.ZodTypeAny | undefined,
    ImplementationParamsSchema extends z.ZodTypeAny | undefined
> = (
    Unsafe extends 'UNSAFE' ? {
        params?: unknown,
        implementationParams?: unknown,
        data?: unknown,
    } : (
        & ParamsObject<ParamsSchema, 'INPUT'>
        & ImplementationParamsObject<ImplementationParamsSchema, 'INPUT'>
        & DataObject<DataSchema, 'INPUT'>
    )
)

export type ServiceOperationOperation<
    OpensTransaction extends boolean,
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataSchema extends z.ZodTypeAny | undefined,
    Return,
> = (
    args:
        & ParamsObject<ParamsSchema, 'INFERED'>
        & DataObject<DataSchema, 'INFERED'>
        & ServiceOperationContext<OpensTransaction>
) => Promise<Return> | Return

export type SubServiceOperationConfig<
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataSchema extends z.ZodTypeAny | undefined,
    ParamsSchemaImplementationFields extends object | undefined,
    DataSchemaImplementationFields extends object | undefined,
    OperationImplementationFields extends object | undefined,
    Return,
    OpensTransaction extends boolean = false,
> = {
    paramsSchema?: ((implementationFields: ParamsSchemaImplementationFields) => ParamsSchema) | undefined,
    dataSchema?: ((implementationFields: DataSchemaImplementationFields) => DataSchema) | undefined,
    opensTransaction?: OpensTransaction,
    operation: (implementationFields: OperationImplementationFields) =>
        ServiceOperationOperation<OpensTransaction, ParamsSchema, DataSchema, Return>
}

export type ArgsAuthGetterAndOwnershipCheck<
    OpensTransaction extends boolean,
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataSchema extends z.ZodTypeAny | undefined,
    ImplementationParamsSchema extends z.ZodTypeAny | undefined
> =
    & ParamsObject<ParamsSchema, 'INFERED'>
    & ImplementationParamsObject<ImplementationParamsSchema, 'INFERED'>
    & DataObject<DataSchema, 'INFERED'>
    & Pick<ServiceOperationContext<OpensTransaction>, 'prisma'>

export type AutherGetter<
    OpensTransaction extends boolean,
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataSchema extends z.ZodTypeAny | undefined,
    ImplementationParamsSchema extends z.ZodTypeAny | undefined
> = (
    args: ArgsAuthGetterAndOwnershipCheck<OpensTransaction, ParamsSchema, DataSchema, ImplementationParamsSchema>
) => AutherResult | Promise<AutherResult>

export type OwnershipCheck<
    OpensTransaction extends boolean,
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataSchema extends z.ZodTypeAny | undefined,
    ImplementationParamsSchema extends z.ZodTypeAny | undefined
> = (
    args: ArgsAuthGetterAndOwnershipCheck<OpensTransaction, ParamsSchema, DataSchema, ImplementationParamsSchema>
) => boolean | Promise<boolean>

export type ServiceOperationImplementationConfigInternalCall<
    ImplementationParamsSchema extends z.ZodTypeAny | undefined,
    ParamsSchemaImplementationFields extends object | undefined,
    DataSchemaImplementationFields extends object | undefined,
    OperationImplementationFields extends object | undefined,
    > = {
    implementationParamsSchema?: ImplementationParamsSchema,
    paramsSchemaImplementationFields?: ParamsSchemaImplementationFields
    dataSchemaImplementationFields?: DataSchemaImplementationFields
    operationImplementationFields?: OperationImplementationFields
} & (ParamsSchemaImplementationFields extends undefined ?
    object
 : {
    paramsSchemaImplementationFields: ParamsSchemaImplementationFields
}) & (DataSchemaImplementationFields extends undefined ?
    object
 : {
    dataSchemaImplementationFields: DataSchemaImplementationFields
}) & (OperationImplementationFields extends undefined ?
    object
 : {
    operationImplementationFields: OperationImplementationFields
}) & (OperationImplementationFields extends undefined ?
    object
 : {
    operationImplementationFields: OperationImplementationFields
})

export type ServiceOperationImplementationConfig<
    OpensTransaction extends boolean,
    ImplementationParamsSchema extends z.ZodTypeAny | undefined,
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataSchema extends z.ZodTypeAny | undefined,
    ParamsSchemaImplementationFields extends object | undefined,
    DataSchemaImplementationFields extends object | undefined,
    OperationImplementationFields extends object | undefined,
    > = ServiceOperationImplementationConfigInternalCall<
    ImplementationParamsSchema,
    ParamsSchemaImplementationFields,
    DataSchemaImplementationFields,
    OperationImplementationFields
    > & {
    authorizer: AutherGetter<OpensTransaction, ParamsSchema, DataSchema, ImplementationParamsSchema>,
    ownershipCheck: OwnershipCheck<OpensTransaction, ParamsSchema, DataSchema, ImplementationParamsSchema>,
}

/**
 * This is the type for the prisma client that is passed to the service operation.
 * It can't simply be PrismaClient because it can be usefull to use a service operation
 * inside a transaction. In that case, the prisma client is a Prisma.TransactionClient.
 * The caveat is that a Prisma.TransactionClient can't be used to open a new transaction
 * so if the service operation opens a transaction, the prisma client can only be a PrismaClient.
 */
export type PrismaPossibleTransaction<
    OpensTransaction extends boolean
> = OpensTransaction extends true ? PrismaClient : Prisma.TransactionClient

/**
 * In addition to custom data arguments, every service operation receives a context object.
 */
export type ServiceOperationContext<OpensTransaction extends boolean = boolean> = {
    prisma: PrismaPossibleTransaction<OpensTransaction>,
    session: SessionMaybeUser,
    bypassAuth: boolean,
}

/**
 * Async local storage is used to store the context of the current service operation call.
 * All service operations called within the context of another service operation will
 * inherit the context of the parent service operation, unless explicitly overridden.
 *
 * Read more about async local storage here: https://nodejs.org/api/async_context.html
 */
const asyncLocalStorage = new AsyncLocalStorage<ServiceOperationContext>()

/**
 * Runs a callback with a specific service operation context.
 *
 * @param contextOverride Partial context to override the current context with.
 * @param callback The callback to run with the context.
 * @returns The return value of the callback.
 */
function withContext<T>(
    contextOverride: Partial<ServiceOperationContext>,
    callback: (context: ServiceOperationContext) => T,
): T {
    const localContext = asyncLocalStorage.getStore()

    const context: ServiceOperationContext = {
        prisma: contextOverride.prisma ?? localContext?.prisma ?? globalPrisma,
        session: contextOverride.session ?? localContext?.session ?? Session.empty(),
        bypassAuth: contextOverride.bypassAuth ?? localContext?.bypassAuth ?? false,
    }

    return asyncLocalStorage.run(context, () => callback(context))
}


/**
 * This is the return type of the ServiceOperation function. It contains a client function that can be used
 * to pass a specific prisma client to the service operation, and a newClient function that can be used to
 * pass the global prisma client to the service operation.
 *
 * TypeScript is smart enough to infer the behaviour of the return functons without the need to excplitly
 * type the return type of the ServiceOperation function, but it is done so for the sake of clarity.
 */
export type ServiceOperation<
    OpensTransaction extends boolean,
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataSchema extends z.ZodTypeAny | undefined = undefined,
    ImplementationParamsSchema extends z.ZodTypeAny | undefined = undefined
> = {
    /**
     * Pass a specific prisma client to the service operation. Usefull when using the service operation inside a transaction.
     * @note
     * @param client
     */
    <Unsafe extends 'UNSAFE' | 'SAFE' = 'SAFE'>(
        args:
            & ServiceOperationExecuteArgs<Unsafe, ParamsSchema, DataSchema, ImplementationParamsSchema>
            & Partial<ServiceOperationContext<OpensTransaction>>
    ): Promise<Return>,
    paramsSchema?: ParamsSchema,
    dataSchema?: DataSchema,
    implementationParamsSchema?: ImplementationParamsSchema,
}

export function defineSubOperation<
    Return,
    OpensTransaction extends boolean = false,
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataSchema extends z.ZodTypeAny | undefined = undefined,
    ParamsSchemaImplementationFields extends object | undefined = undefined,
    DataSchemaImplementationFields extends object | undefined = undefined,
    OperationImplementationFields extends object | undefined = undefined,
>(
    serviceOperationConfig: SubServiceOperationConfig<
        ParamsSchema,
        DataSchema,
        ParamsSchemaImplementationFields,
        DataSchemaImplementationFields,
        OperationImplementationFields,
        Return,
        OpensTransaction
    >
) {
    const implement = <ImplementationParamsSchema extends z.ZodTypeAny | undefined = undefined>(
        implementationArgs: ServiceOperationImplementationConfig<
            OpensTransaction,
            ImplementationParamsSchema,
            ParamsSchema,
            DataSchema,
            ParamsSchemaImplementationFields,
            DataSchemaImplementationFields,
            OperationImplementationFields
        >
    ): ServiceOperation<OpensTransaction, Return, ParamsSchema, DataSchema, ImplementationParamsSchema> => {
        const expectedArgsArePresent = (
            args: ServiceOperationExecuteArgs<'UNSAFE', ParamsSchema, DataSchema, ImplementationParamsSchema>
        ): args is ServiceOperationExecuteArgs<'SAFE', ParamsSchema, DataSchema, ImplementationParamsSchema> => {
            const paramsMatch = Boolean(args.params) === Boolean(serviceOperationConfig.paramsSchema)
            const dataMatches = Boolean(args.data) === Boolean(serviceOperationConfig.dataSchema)
            const implementationParamsMatch =
            Boolean(args.implementationParams) === Boolean(implementationArgs.implementationParamsSchema)
            return paramsMatch && dataMatches && implementationParamsMatch
        }

        // Guard to check if the prisma client can be used for this service operation.
        const isAppropriateClient = (
            prisma: PrismaClient | Prisma.TransactionClient
        ): prisma is PrismaPossibleTransaction<OpensTransaction> =>
            !serviceOperationConfig.opensTransaction || '$transaction' in prisma

        const executeOperation = async ({
            implementationParams, params, data, ...context
        }:
            & ServiceOperationExecuteArgs<'UNSAFE', ParamsSchema, DataSchema, ImplementationParamsSchema>
            & Partial<ServiceOperationContext<OpensTransaction>>
        ): Promise<Return> => {
            const args = {
                implementationParams,
                params,
                data,
            }

            if (args.params) {
                if (!serviceOperationConfig.paramsSchema) {
                    throw new Smorekopp(
                        'BAD PARAMETERS', 'Service operation recieved params, but has no params schema.'
                    )
                }
                const paramsSchema = serviceOperationConfig.paramsSchema(
                    implementationArgs.paramsSchemaImplementationFields!
                )
                if (!paramsSchema) {
                    throw new Smorekopp(
                        'BAD PARAMETERS', 'Service operation recieved params, but has no params schema.'
                    )
                }
                const paramsParse = paramsSchema.safeParse(args.params)

                if (!paramsParse.success) {
                    console.log(paramsParse) // TODO: This needs to be returned to give good error message.
                    throw new Smorekopp('BAD PARAMETERS', 'Invalid params passed to service operation.')
                }

                args.params = paramsParse.data
            }
            if (args.data) {
                if (!serviceOperationConfig.dataSchema) {
                    throw new Smorekopp(
                        'BAD PARAMETERS', 'Service operation recieved data, but has no data schema. 1'
                    )
                }
                const dataSchema = serviceOperationConfig.dataSchema(
                    implementationArgs.dataSchemaImplementationFields!
                )
                if (!dataSchema) {
                    throw new Smorekopp(
                        'BAD PARAMETERS', 'Service operation recieved data, but has no data schema. 2'
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
                        'Service operation recieved implementation params, but has no implementation params schema.'
                    )
                }
                const implementationParamsSchema = implementationArgs.implementationParamsSchema
                const implementationParamsParse = implementationParamsSchema.safeParse(
                    args.implementationParams
                )
                if (!implementationParamsParse.success) {
                    // TODO: This needs to be returned to give good error message.
                    console.log(implementationParamsParse)
                    throw new Smorekopp('BAD PARAMETERS', 'Invalid implementation params passed to service operation.')
                }
                args.implementationParams = implementationParamsParse.data
            }

            if (!expectedArgsArePresent(args)) {
                throw new Smorekopp(
                    'SERVER ERROR',
                    'Service operation recieved invalid arguments.'
                )
            }

            // Then, get the context (which includes the prisma client, the session and the bypassAuth flag).
            // If a context override is provided, use it. Otherwise, use the context from the async local storage.
            // If there is no context in the async local storage, use global defaults.
            return withContext(context, async ({ prisma, bypassAuth, session }) => {
                if (!isAppropriateClient(prisma)) {
                    throw new Smorekopp(
                        'SERVER ERROR',
                        'Service operation that opens a transaction cannot be called from within a transaction.',
                    )
                }

                // Then, authorize user.
                // This has to be done after the validation because the authorizer might use the data to authorize the user.
                if (!bypassAuth) {
                    if (!implementationArgs.authorizer) {
                        throw new Smorekopp(
                            'UNAUTHENTICATED',
                            'This service operation is not externally callable.'
                        )
                    }

                    const authorizer = await prismaErrorWrapper(
                        () => implementationArgs.authorizer({ ...args, prisma })
                    )
                    const authResult = authorizer.auth(session)

                    if (!authResult.authorized) {
                        throw new Smorekopp(authResult.status, authResult.getErrorMessage)
                    }
                }

                const ownershipCheckResult = await prismaErrorWrapper(
                    () => implementationArgs.ownershipCheck({
                        ...args,
                        prisma,
                    })
                )
                if (!ownershipCheckResult) {
                    throw new Smorekopp('DISSALLOWED', `
                        This resource cannot be accessed through this implementation
                        as the resource implementing this resource does not own it.
                    `)
                }

                // Finally, call the operation.
                return prismaErrorWrapper(() =>
                    serviceOperationConfig.operation(
                        implementationArgs.operationImplementationFields!
                    )({ ...args, prisma, bypassAuth, session })
                )
            })
        }

        executeOperation.paramsSchema = serviceOperationConfig.paramsSchema
            ? serviceOperationConfig.paramsSchema(implementationArgs.paramsSchemaImplementationFields!)
            : undefined
        executeOperation.dataSchema = serviceOperationConfig.dataSchema
            ? serviceOperationConfig.dataSchema(implementationArgs.dataSchemaImplementationFields!)
            : undefined
        executeOperation.implementationParamsSchema = implementationArgs.implementationParamsSchema

        return executeOperation
    }
    return {
        implement,
        /**
         * Implements the sub-operation right away with require-nothing authorizer and "no" ownership check.
         */
        internalCall: (
            args:
            & ServiceOperationImplementationConfigInternalCall<
                undefined,
                ParamsSchemaImplementationFields,
                DataSchemaImplementationFields,
                OperationImplementationFields
            >
            & ServiceOperationExecuteArgs<'SAFE', ParamsSchema, DataSchema, undefined>
            & Partial<ServiceOperationContext<OpensTransaction>>
        ) => implement({
            ...args,
            authorizer: () => RequireNothing.staticFields({}).dynamicFields({}),
            ownershipCheck: () => true,
        })(args)
    }
}

export function defineOperation<
    OpensTransaction extends boolean,
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataSchema extends z.ZodTypeAny | undefined = undefined,
>({ paramsSchema, dataSchema, opensTransaction, authorizer, operation }: {
    paramsSchema?: ParamsSchema,
    dataSchema?: DataSchema,
    opensTransaction?: OpensTransaction,
    authorizer: AutherGetter<OpensTransaction, ParamsSchema, DataSchema, undefined>,
    operation: ServiceOperationOperation<OpensTransaction, ParamsSchema, DataSchema, Return>
}): ServiceOperation<OpensTransaction, Return, ParamsSchema, DataSchema, undefined> {
    return defineSubOperation<
        Return,
        OpensTransaction,
        ParamsSchema,
        DataSchema,
        undefined,
        undefined,
        undefined
    >({
        opensTransaction,
        operation: () => operation,
        paramsSchema: paramsSchema !== undefined ? () => paramsSchema : undefined,
        dataSchema: dataSchema !== undefined ? () => dataSchema : undefined,
    }).implement({
        authorizer,
        ownershipCheck: () => true,
        implementationParamsSchema: undefined,
        dataSchemaImplementationFields: undefined,
        paramsSchemaImplementationFields: undefined,
        operationImplementationFields: undefined,
    })
}

export type SubServiceOperation<
    Return,
    OpensTransaction extends boolean = false,
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataSchema extends z.ZodTypeAny | undefined = undefined,
    ParamsSchemaImplementationFields extends object | undefined = undefined,
    DataSchemaImplementationFields extends object | undefined = undefined,
    OperationImplementationFields extends object | undefined = undefined,
> = ReturnType<typeof defineSubOperation<
    Return,
    OpensTransaction,
    ParamsSchema,
    DataSchema,
    ParamsSchemaImplementationFields,
    DataSchemaImplementationFields,
    OperationImplementationFields
>>

