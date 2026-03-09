import '@pn-server-only'
import { ParseError, Smorekopp } from './error'
import { prismaErrorWrapper } from './prismaCall'
import { prisma as globalPrisma } from '@/prisma-pn-client-instance'
import { RequireNothing } from '@/auth/authorizer/RequireNothing'
import { Session } from '@/auth/session/Session'
import { zfd } from 'zod-form-data'
import { AsyncLocalStorage } from 'async_hooks'
import type { AuthorizerDynamicFieldsBound } from '@/auth/authorizer/Authorizer'
import { z } from 'zod'
import type { SessionMaybeUser } from '@/auth/session/Session'
import type { Prisma, PrismaClient } from '@/prisma-generated-pn-client'

type IsNever<T> = [T] extends [never] ? true : false;

type RequiredIfDefined<T> = T & {
  [K in keyof T as undefined extends Required<T>[K] ? never : IsNever<Required<T>[K]> extends true ? never : K]-?: T[K];
};

type SchemaOutput<Key extends string, Schema extends z.ZodTypeAny | undefined> = Schema extends undefined
    ? object
    : { [K in Key]: z.infer<NonNullable<Schema>> }

type SchemaInput<Key extends string, Schema extends z.ZodTypeAny | undefined> = Schema extends undefined
    ? object
    : { [K in Key]: z.input<NonNullable<Schema>> }

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
        & SchemaInput<'params', ParamsSchema>
        & SchemaInput<'implementationParams', ImplementationParamsSchema>
        & SchemaInput<'data', DataSchema>
    )
)

export type ServiceOperationOperation<
    OpensTransaction extends boolean,
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataSchema extends z.ZodTypeAny | undefined,
    Return,
> = (
    args: (
        & SchemaOutput<'params', ParamsSchema>
        & SchemaOutput<'data', DataSchema>
        & ServiceOperationContext<OpensTransaction>
    )
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
    paramsSchema?: ((implementationFields: ParamsSchemaImplementationFields) => ParamsSchema) | ParamsSchema,
    dataSchema?: ((implementationFields: DataSchemaImplementationFields) => DataSchema) | DataSchema,
    opensTransaction?: OpensTransaction,
    operation: (implementationFields: OperationImplementationFields) =>
        ServiceOperationOperation<OpensTransaction, ParamsSchema, DataSchema, Return>
}

export type ServiceOperationGuardArgs<
    OpensTransaction extends boolean,
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataSchema extends z.ZodTypeAny | undefined,
    ImplementationParamsSchema extends z.ZodTypeAny | undefined
> = (
    & SchemaOutput<'params', ParamsSchema>
    & SchemaOutput<'implementationParams', ImplementationParamsSchema>
    & SchemaOutput<'data', DataSchema>
    & Pick<ServiceOperationContext<OpensTransaction>, 'prisma'>
)

export type ServiceOperationGuard<
    Return,
    OpensTransaction extends boolean,
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataSchema extends z.ZodTypeAny | undefined,
    ImplementationParamsSchema extends z.ZodTypeAny | undefined
> = (
    args: ServiceOperationGuardArgs<OpensTransaction, ParamsSchema, DataSchema, ImplementationParamsSchema>
) => Return | Promise<Return>

export type ServiceOperationImplementationConfigInternalCall<
    ImplementationParamsSchema extends z.ZodTypeAny | undefined,
    ParamsSchemaImplementationFields extends object | undefined,
    DataSchemaImplementationFields extends object | undefined,
    OperationImplementationFields extends object | undefined,
> = {
    implementationParamsSchema?: ImplementationParamsSchema,
} & RequiredIfDefined<{
    paramsSchemaImplementationFields?: ParamsSchemaImplementationFields,
    dataSchemaImplementationFields?: DataSchemaImplementationFields,
    operationImplementationFields?: OperationImplementationFields,
}>

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
    authorizer: ServiceOperationGuard<AuthorizerDynamicFieldsBound, OpensTransaction, ParamsSchema, DataSchema, ImplementationParamsSchema>,
    ownershipCheck: ServiceOperationGuard<Boolean, OpensTransaction, ParamsSchema, DataSchema, ImplementationParamsSchema>,
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

function parseArgumentOrThrow<S extends z.ZodTypeAny | undefined, A = undefined>(
    data: unknown, 
    schema: S | ((arg: A) => S),
    arg: A, 
    name: 'params' | 'data' | 'implementation params',
) {
    if (!data) return data

    const resolvedSchema = typeof schema == "function"
        ? schema(arg)
        : schema

    if (!resolvedSchema) {
        throw new Smorekopp(
            'BAD PARAMETERS', `Service operation recieved ${name}, but has no data ${name}.`
        )
    }

    const parse = name == 'data'
        ? zfd.formData(resolvedSchema).safeParse(data)
        : resolvedSchema.safeParse(data)

    if (!parse.success) {
        if (name == 'data') {
            throw new ParseError(parse)
        }

        // TODO: This needs to be returned to give good error message.
        console.log(parse)
        throw new Smorekopp('BAD PARAMETERS', `Invalid ${name} passed to service operation.`)
    }
    
    return parse.data
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
        ): args is ServiceOperationExecuteArgs<'SAFE', ParamsSchema, DataSchema, ImplementationParamsSchema> =>
            Boolean(args.params) === Boolean(serviceOperationConfig.paramsSchema) &&
            Boolean(args.data) === Boolean(serviceOperationConfig.dataSchema) &&
            Boolean(args.implementationParams) === Boolean(implementationArgs.implementationParamsSchema)

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
            const parsedArgs = {
                params: parseArgumentOrThrow(
                    data,
                    serviceOperationConfig.paramsSchema,
                    implementationArgs.paramsSchemaImplementationFields!,
                    'params'
                ),
                data: parseArgumentOrThrow(
                    data,
                    serviceOperationConfig.dataSchema,
                    implementationArgs.dataSchemaImplementationFields!,
                    'data',
                ),
                implementationParams: parseArgumentOrThrow(
                    implementationParams,
                    implementationArgs.implementationParamsSchema,
                    undefined,
                    'implementation params',
                ),
            }

            if (!expectedArgsArePresent(parsedArgs)) {
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
                        () => implementationArgs.authorizer({ ...parsedArgs, prisma })
                    )
                    const authResult = authorizer.auth(session)

                    if (!authResult.authorized) {
                        throw new Smorekopp(authResult.status, authResult.getErrorMessage)
                    }
                }

                const ownershipCheckResult = await prismaErrorWrapper(
                    () => implementationArgs.ownershipCheck({
                        ...parsedArgs,
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
                    )({ ...parsedArgs, prisma, bypassAuth, session })
                )
            })
        }

        executeOperation.paramsSchema = typeof serviceOperationConfig.paramsSchema == "function" 
            ? serviceOperationConfig.paramsSchema(implementationArgs.paramsSchemaImplementationFields!)
            : serviceOperationConfig.paramsSchema
        executeOperation.dataSchema = typeof serviceOperationConfig.dataSchema == "function" 
            ? serviceOperationConfig.dataSchema(implementationArgs.dataSchemaImplementationFields!)
            : serviceOperationConfig.dataSchema
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
    authorizer: ServiceOperationGuard<AuthorizerDynamicFieldsBound, OpensTransaction, ParamsSchema, DataSchema, undefined>,
    operation: ServiceOperationOperation<OpensTransaction, ParamsSchema, DataSchema, Return>
}): ServiceOperation<OpensTransaction, Return, ParamsSchema, DataSchema, undefined> {
    return defineSubOperation({
        opensTransaction,
        operation: () => operation,
        paramsSchema: paramsSchema !== undefined ? () => paramsSchema : undefined,
        dataSchema: dataSchema !== undefined ? () => dataSchema : undefined,
    }).implement({
        authorizer,
        ownershipCheck: () => true,
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
