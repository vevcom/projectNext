import '@pn-server-only'
import { ParseError, Smorekopp } from './error'
import { prismaErrorWrapper } from './prismaCall'
import { prisma as globalPrisma } from '@/prisma/client'
import { Session } from '@/auth/session/Session'
import { zfd } from 'zod-form-data'
import { AsyncLocalStorage } from 'async_hooks'
import type { z } from 'zod'
import type { Prisma, PrismaClient } from '@prisma/client'
import type { SessionMaybeUser } from '@/auth/session/Session'
import type { AutherResult } from '@/auth/auther/Auther'

/**
 * This is the type for the prisma client that is passed to the service operation.
 * It can't simply be PrismaClient because it can be usefull to use a service operation
 * inside a transaction. In that case, the prisma client is a Prisma.TransactionClient.
 * The caveat is that a Prisma.TransactionClient can't be used to open a new transaction
 * so if the service operation opens a transaction, the prisma client can only be a PrismaClient.
 */
type PrismaPossibleTransaction<
    OpensTransaction extends boolean
> = OpensTransaction extends true ? PrismaClient : Prisma.TransactionClient

/**
 * Utility type that remove all properties of type `never`.
 */
type HideNever<T> = {
    [K in keyof T as T[K] extends never ? never : K]: T[K]
}

/**
 * The input type which should will be passed to the service operation.
 * This is what the zod schemas will parse.
 */
export type ServiceOperationInputUnparsed<
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataSchema extends z.ZodTypeAny | undefined,
> = HideNever<{
    params: z.input<NonNullable<ParamsSchema>>,
    data: z.input<NonNullable<DataSchema>>,
}>

/**
 * The input that is provided to the a service operation implementation.
 * This is the the input after is has been parsed with zod.
 */
export type ServiceOperationInputParsed<
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataSchema extends z.ZodTypeAny | undefined,
> = HideNever<{
    params: z.infer<NonNullable<ParamsSchema>>,
    data: z.infer<NonNullable<DataSchema>>,
}>

/**
 * This is the actual input type for the service operation function used under the hood
 * since the input can be from the client we can't guarantee type safety.
 */
export type ServiceOperationInputUnchecked = {
    params?: unknown,
    data?: unknown,
}

/**
 * This is the type for the configuration of a service operation.
 * I.e. what is passed to the ServiceOperation function when creating a service operation.
 */
type ServiceOperationConfig<
    OpensTransaction extends boolean,
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataSchema extends z.ZodTypeAny | undefined,
> = {
    paramsSchema?: ParamsSchema,
    dataSchema?: DataSchema,
    opensTransaction?: OpensTransaction,
    authorizer?: (args: ServiceOperationInputParsed<ParamsSchema, DataSchema> & ServiceOperationContext<OpensTransaction>) =>
        AutherResult| Promise<AutherResult>,
    operation: (args: ServiceOperationInputParsed<ParamsSchema, DataSchema> & ServiceOperationContext<OpensTransaction>) =>
        Return | Promise<Return>,
}

/**
 * The function signature for a service operation.
 *
 * The generic `Checked` determines whether to use compile time type checking or not for the argument.
 *
 * The default is `CHECKED` which means that the arguments will have to match what the
 * zod schemas expect to parse.
 *
 * Alternatively, `UNCHECKED` can be selected to forgo the TypeScript type checking.
 * Importantly, this will not skip the runtime validation with zod.
 * `UNCHECKED` is used when handling untyped input, e.g. from an HTTP request.
 */
export type ServiceOperation<
    OpensTransaction extends boolean,
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataSchema extends z.ZodTypeAny | undefined,
> = {
    <Checked extends 'CHECKED' | 'UNCHECKED' = 'CHECKED'>(
    args: (
            Checked extends 'CHECKED'
                ? ServiceOperationInputUnparsed<ParamsSchema, DataSchema>
                : ServiceOperationInputUnchecked
        ) & Partial<ServiceOperationContext<OpensTransaction>>
    ): Promise<Return>
    paramsSchema?: ParamsSchema,
    dataSchema?: DataSchema,
}
/**
 * In addition to custom data arguments, every service operation receives a context object.
 */
type ServiceOperationContext<OpensTransaction extends boolean = boolean> = {
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
 * Wrapper for creating service operations. It handles validation, authorization, and errors for you.
 *
 * @param config - The configuration for the service operation.
 * @param config.authorizer - A function which returns the authorizer that will be used to authorize the user.
 * @param config.paramsSchema - The zod schemas that will be used to validate the parameters which are passed.
 * @param config.dataSchema - The zod schemas that will be used to validate the data which is passed.
 * @param config.operation - The operation that will be called when the service operation is executed.
 * @param [config.opensTransaction=false] - Determines the type of prisma client that is passed to the service operation.
 */
export function defineOperation<
    OpensTransaction extends boolean,
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataSchema extends z.ZodTypeAny | undefined = undefined,
>(
    config: ServiceOperationConfig<OpensTransaction, Return, ParamsSchema, DataSchema>,
): ServiceOperation<OpensTransaction, Return, ParamsSchema, DataSchema> {
    // Guard to check if params and data are only present if there are corresponding schemas.
    const expectedInputsIsPresent = (
        input: ServiceOperationInputUnchecked
    ): input is ServiceOperationInputParsed<ParamsSchema, DataSchema> => {
        const paramsMatch = (input.params !== undefined) === (config.paramsSchema !== undefined)
        const dataMatches = (input.data !== undefined) === (config.dataSchema !== undefined)
        return paramsMatch && dataMatches
    }

    // Guard to check if the prisma client can be used for this service operation.
    const isAppropriateClient = (
        prisma: PrismaClient | Prisma.TransactionClient
    ): prisma is PrismaPossibleTransaction<OpensTransaction> =>
        !config.opensTransaction || '$transaction' in prisma

    // Wraps the execution of the operation with parsing, authorization, and context handling.
    const execute = async (
        { params, data, ...context }: ServiceOperationInputUnchecked & Partial<ServiceOperationContext<OpensTransaction>>
    ) => {
        const input = { params, data }

        // First, parse the provided params and data.
        if (input.params) {
            if (!config.paramsSchema) {
                throw new Smorekopp(
                    'BAD PARAMETERS',
                    'Service operation received params, but has no params schema.',
                )
            }
            const paramsParse = config.paramsSchema.safeParse(input.params)
            if (!paramsParse.success) {
                throw new Smorekopp(
                    'BAD PARAMETERS',
                    'Invalid params passed to service operation.',
                )
            }
            input.params = paramsParse.data
        }

        // Then, validate data (if any).
        if (input.data) {
            if (!config.dataSchema) {
                throw new Smorekopp(
                    'BAD DATA',
                    'Service operation received data, but has no dataValidation or dataSchema.',
                )
            }
            const parse = zfd.formData(config.dataSchema).safeParse(input.data)
            if (!parse.success) {
                console.log(parse.error)
                throw new ParseError(parse)
            }
            input.data = parse.data
        }

        if (!expectedInputsIsPresent(input)) {
            throw new Smorekopp('SERVER ERROR', 'Service operation received invalid input.')
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
                if (!config.authorizer) {
                    throw new Smorekopp(
                        'UNAUTHENTICATED',
                        'This service operation is not externally callable.'
                    )
                }

                const authorizer = await config.authorizer({ ...input, prisma, bypassAuth, session })
                const authResult = authorizer.auth(session)

                if (!authResult.authorized) {
                    throw new Smorekopp(authResult.status, authResult.getErrorMessage)
                }
            }

            // Finally, call the operation.
            return prismaErrorWrapper(() => config.operation({ ...input, prisma, bypassAuth, session }))
        })
    }

    execute.paramsSchema = config.paramsSchema
    execute.dataSchema = config.dataSchema

    return execute
}
