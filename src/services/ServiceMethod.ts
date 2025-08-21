import '@pn-server-only'
import { ParseError, Smorekopp } from './error'
import { prismaErrorWrapper } from './prismaCall'
import { default as globalPrisma } from '@/prisma'
import { Session } from '@/auth/Session'
import { zfd } from 'zod-form-data'
import type { z } from 'zod'
import type { Prisma, PrismaClient } from '@prisma/client'
import type { SessionMaybeUser } from '@/auth/Session'
import type { AutherStaticFieldsBound } from '@/auth/auther/Auther'
import { AsyncLocalStorage } from 'async_hooks'

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
    DataSchema extends z.ZodTypeAny | undefined,
    SchemaType extends 'INFERRED' | 'INPUT'
> = (
    ParamsSchema extends undefined ? object : {
        params: SchemaType extends 'INFERRED' ? z.infer<NonNullable<ParamsSchema>> : z.input<NonNullable<ParamsSchema>>
    }
) & (
    DataSchema extends undefined ? object : {
        data: SchemaType extends 'INFERRED' ? z.infer<NonNullable<DataSchema>> : z.input<NonNullable<DataSchema>>
    }
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
    DataSchema extends z.ZodTypeAny | undefined,
> = {
    prisma: PrismaPossibleTransaction<OpensTransaction>,
    session: SessionMaybeUser,
} & ServiceMethodParamsData<ParamsSchema, DataSchema, 'INFERRED'>

/**
 * This is the type for the argument that are passed to the execute method of a service method.
 */
export type ServiceMethodExecuteArgs<
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataSchema extends z.ZodTypeAny | undefined,
    OpensTransaction extends boolean,
> = {
    session?: SessionMaybeUser | null,
    prisma?: PrismaPossibleTransaction<OpensTransaction>,
    bypassAuth?: boolean,
} & ServiceMethodParamsData<ParamsSchema, DataSchema, 'INPUT'>

/**
 * This is the type for the argument that are passed to the execute method of a service method.
 */
export type ServiceMethodExecuteArgsUnsafe<OpensTransaction extends boolean> = {
    session?: SessionMaybeUser | null,
    prisma?: PrismaPossibleTransaction<OpensTransaction>,
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
    DataSchema extends z.ZodTypeAny | undefined,
> = {
    paramsSchema?: ParamsSchema,
    dataSchema?: DataSchema,
    opensTransaction?: OpensTransaction,
    auther: (
        paramsData: ServiceMethodParamsData<ParamsSchema, DataSchema, 'INFERRED'>
    ) => // Todo: Make prettier type for returntype of dynamic fields
        | ReturnType<AutherStaticFieldsBound<DynamicFields>['dynamicFields']>
        | Promise<ReturnType<AutherStaticFieldsBound<DynamicFields>['dynamicFields']>>,
    method: (
        args: ServiceMethodArguments<OpensTransaction, ParamsSchema, DataSchema>
    ) => Return | Promise<Return>,
}

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
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataSchema extends z.ZodTypeAny | undefined,
> = {
    (args: ServiceMethodExecuteArgs<ParamsSchema, DataSchema, OpensTransaction>): Promise<Return>,
    /**
     * Pass a specific prisma client to the service method. Usefull when using the service method inside a transaction.
     * @note
     * @param client
     */
    client: (client: PrismaPossibleTransaction<OpensTransaction>) => {
        execute: (args: ServiceMethodExecuteArgs<ParamsSchema, DataSchema, OpensTransaction>) => Promise<Return>,
        executeUnsafe: (args: ServiceMethodExecuteArgsUnsafe<OpensTransaction>) => Promise<Return>,
    },
    /**
     * Use the global prisma client for the service method.
     */
    newClient: () => (
        ReturnType<
            ServiceMethodType<OpensTransaction, Return, ParamsSchema, DataSchema>['client']
        >
    ),
    paramsSchema?: ParamsSchema,
    dataSchema?: DataSchema,
}

export type Context = { prisma: PrismaClient | Prisma.TransactionClient, session: SessionMaybeUser | null }

const asyncLocalStorage = new AsyncLocalStorage<Context>()

function withContext<T>(defaultContext: Partial<Context>, callback: (context: Context) => T): T {
    const context = asyncLocalStorage.getStore() ?? { prisma: defaultContext.prisma ?? globalPrisma, session: defaultContext.session ?? null }
    return asyncLocalStorage.run(context, () => callback(context))
}

/**
 * Wrapper for creating service methods. It handles validation, authorization, and errors for you.
 *
 * Whether or not a service method expects params and/or data is inferred from the configuration.
 * If paramsSchema is defined, the service method expects params.
 * If dataValidation is defined, the service method expects data.
 *
 * @param config - The configuration for the service method.
 * @param config.auther - The auther that will be used to authorize the user.
 * @param config.dynamicAuthFields - A function that returns the dynamic auth fields that will be used to authorize the user.
 * @param config.method - The method that will be called when the service method is executed.
 * @param config.paramsSchema - The zod schema that will be used to validate the params that is passed to the service method.
 * @param config.dataSchema - The zod schema that will be used to validate the data that is passed to the service method.
 * @param [config.opensTransaction=false] - Whether or not the service method opens a transaction. (Just for correct typing)
 */
export function ServiceMethod<
    DynamicFields extends object,
    OpensTransaction extends boolean,
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataSchema extends z.ZodTypeAny | undefined = undefined,
>(
    config: ServiceMethodConfig<DynamicFields, OpensTransaction, Return, ParamsSchema, DataSchema>,
): ServiceMethodType<OpensTransaction, Return, ParamsSchema, DataSchema> {
    // Simple utility function to check if the expected arguments are present.
    // I.e. if the params/data are present when they should be and vice versa.
    // This is needed to help typescript infer the correct types for the arguments.
    const expectedArgsArePresent = (
        args: ServiceMethodExecuteArgsUnsafe<OpensTransaction>
    ): args is ServiceMethodExecuteArgs<ParamsSchema, DataSchema, OpensTransaction> => {
        const paramsMatch = Boolean(args.params) === Boolean(config.paramsSchema)
        const dataMatches = Boolean(args.data) === Boolean(config.dataSchema)
        return paramsMatch && dataMatches
    }

    async function executeUnsafe(args: ServiceMethodExecuteArgsUnsafe<OpensTransaction>) {
        // First, validate parameters (if any).
        if (args.params) {
            if (!config.paramsSchema) {
                throw new Smorekopp('BAD PARAMETERS', 'Service method recieved params, but has no params schema.')
            }

            // TODO: Decide if this should be a validation or a schema.
            // For now it's just a schema because it's simpler.
            const paramsParse = config.paramsSchema.safeParse(args.params)

            if (!paramsParse.success) {
                // TODO: This needs to be returned to give good error message.
                throw new Smorekopp('BAD PARAMETERS', 'Invalid params passed to service method.')
            }

            args.params = paramsParse.data
        }

        // Then, validate data (if any).
        if (args.data) {
            if (!config.dataSchema) {
                throw new Smorekopp(
                    'BAD DATA', 'Service method recieved data, but has no dataValidation or dataSchema.'
                )
            }
            const parse = zfd.formData(config.dataSchema).safeParse(args.data)
            if (!parse.success) {
                throw new ParseError(parse)
            }
            args.data = parse.data
        }

        // Then, determine if the correct properties are present.
        // This gives the correct type for "args" if the check succeeds.
        if (!expectedArgsArePresent(args)) {
            throw new Smorekopp('SERVER ERROR', 'Service method recieved invalid arguments.')
        }

        return withContext({ prisma: args.prisma, session: args.session }, async ({ prisma, session }) => {
            session ??= Session.empty()

            // Then, authorize user.
            // This has to be done after the validation because the auther might use the data to authorize the user.
            if (!args.bypassAuth) {
                const authRes = (await config.auther(args)).auth(session)

                if (!authRes.authorized) {
                    throw new Smorekopp(authRes.status, authRes.getErrorMessage)
                }
            }

            const isAppropriateClient = (prisma: PrismaClient | Prisma.TransactionClient): prisma is PrismaPossibleTransaction<OpensTransaction> =>
                !config.opensTransaction || "$transaction" in prisma

            if (!isAppropriateClient(prisma)) {
                throw new Smorekopp(
                    'SERVER ERROR',
                    'Service method that opens a transaction cannot be called from within a transaction..'
                )
            }

            // Finally, call the method.
            return prismaErrorWrapper(() => config.method({
                ...args,
                prisma,
                session,
            }))
        })
    }

    executeUnsafe.client = (prisma: PrismaPossibleTransaction<OpensTransaction>) => {
        return {
            executeUnsafe: (args: ServiceMethodExecuteArgsUnsafe<OpensTransaction>) => executeUnsafe({ prisma, ...args }),
            execute: (args: ServiceMethodExecuteArgs<ParamsSchema, DataSchema, OpensTransaction>) => executeUnsafe({ prisma, ...args }),
        }
    }
    executeUnsafe.newClient = () => executeUnsafe.client(globalPrisma)
    executeUnsafe.dataSchema = config.dataSchema
    executeUnsafe.paramsSchema = config.paramsSchema

    return executeUnsafe
}
