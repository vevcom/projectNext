import '@pn-server-only'
import { z } from 'zod'
import { ParseError, Smorekopp } from './error'
import { prismaErrorWrapper } from './prismaCall'
import { default as globalPrisma } from '@/prisma'
import { Session } from '@/auth/Session'
import { AsyncLocalStorage } from 'async_hooks'
import type { Prisma, PrismaClient } from '@prisma/client'
import type { SessionMaybeUser } from '@/auth/Session'
import type { AutherStaticFieldsBound } from '@/auth/auther/Auther'

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
 * The type used internally by Zod to represent a tuple of schemas.
 */
export type SchemaTuple = [z.ZodTypeAny, ...z.ZodTypeAny[]] | []

/**
 * Helper type to infer the input types of a tuple of schemas.
 */
export type InputSchemaTuple<S extends SchemaTuple> = z.input<z.ZodTuple<S>>

/**
 * Helper type to infer the output types of a tuple of schemas.
 */
export type OutputSchemaTuple<S extends SchemaTuple> = z.infer<z.ZodTuple<S>>

/**
 * The input arguments for a service method function.
 * These are the arguments passed by the caller of the service method.
 */
export type ServiceMethodInputArgs<
    OpensTransaction extends boolean,
    Schemas extends SchemaTuple,
> = [...InputSchemaTuple<Schemas>, Partial<ServiceMethodContext<OpensTransaction>>?]

/**
 * The output arguments for a service method function.
 * These are the arguments passed to the author and the method internally.
 */
export type ServiceMethodOutputArgs<
    OpensTransaction extends boolean,
    Schemas extends SchemaTuple,
> = [...OutputSchemaTuple<Schemas>, ServiceMethodContext<OpensTransaction>]

/**
 * This is the type for the configuration of a service method.
 * I.e. what is passed to the ServiceMethod function when creating a service method.
 */
export type ServiceMethodConfig<
    DynamicFields extends object,
    OpensTransaction extends boolean,
    Return,
    Schemas extends SchemaTuple,
> = {
    schemas?: Schemas,
    opensTransaction?: OpensTransaction,
    auther?: (
        ...args: ServiceMethodOutputArgs<OpensTransaction, Schemas>
    ) => // Todo: Make prettier type for returntype of dynamic fields
        | ReturnType<AutherStaticFieldsBound<DynamicFields>['dynamicFields']>
        | Promise<ReturnType<AutherStaticFieldsBound<DynamicFields>['dynamicFields']>>,
    method: (
        ...args: ServiceMethodOutputArgs<OpensTransaction, Schemas>
    ) => Return | Promise<Return>,
}

/**
 * The return type of the ServiceMethod function.
 * It is a function that takes the data arguments and an optional context argument.
 */
export type ServiceMethodType<
    OpensTransaction extends boolean,
    Return,
    Schemas extends SchemaTuple,
> = {
    (...args: ServiceMethodInputArgs<OpensTransaction, Schemas>): Promise<Return>,
    schemas?: Schemas,
}

/**
 * In addition to custom data arguments, every service method receives a context object.
 */
export type ServiceMethodContext<OpensTransaction extends boolean = boolean> = {
    prisma: PrismaPossibleTransaction<OpensTransaction>,
    session: SessionMaybeUser,
    bypassAuth: boolean,
}

/**
 * Async local storage is used to store the context of the current service method call.
 * All service methods called within the context of another service method will 
 * inherit the context of the parent service method, unless explicitly overridden.
 * 
 * Read more about async local storage here: https://nodejs.org/api/async_context.html
 */
const asyncLocalStorage = new AsyncLocalStorage<ServiceMethodContext>()

/**
 * Runs a callback with a specific service method context.
 * 
 * @param contextOverride Partial context to override the current context with.
 * @param callback The callback to run with the context.
 * @returns The return value of the callback.
 */
function withContext<T>(contextOverride: Partial<ServiceMethodContext>, callback: (context: ServiceMethodContext) => T): T {
    const localContext = asyncLocalStorage.getStore();

    const context: ServiceMethodContext = {
        prisma:     contextOverride.prisma     ?? localContext?.prisma     ?? globalPrisma,
        session:    contextOverride.session    ?? localContext?.session    ?? Session.empty(),
        bypassAuth: contextOverride.bypassAuth ?? localContext?.bypassAuth ?? false,
    };
    
    return asyncLocalStorage.run(context, () => callback(context))
}

/**
 * Wrapper for creating service methods. It handles validation, authorization, and errors for you.
 *
 * @param config - The configuration for the service method.
 * @param config.auther - A function which returns the auther that will be used to authorize the user.
 * @param config.method - The method that will be called when the service method is executed.
 * @param config.schemas - An array of zod schemas that will be used to validate the arguments that are passed to the service method.
 * @param [config.opensTransaction=false] - Whether or not the service method opens a transaction. Determines the type of prisma client that is passed to the service method.
 */
export function ServiceMethod<
    DynamicFields extends object,
    OpensTransaction extends boolean,
    Return,
    Schemas extends SchemaTuple = [],
>(
    config: ServiceMethodConfig<DynamicFields, OpensTransaction, Return, Schemas>,
): ServiceMethodType<OpensTransaction, Return, Schemas> {
    // Create a tuple schema from the array of schemas.
    // This allows us to parse all the data arguments at once.
    const schema = z.tuple(config.schemas ?? [] as Schemas)
    const expectedDataArgCount = config.schemas?.length ?? 0
    
    // Parses the data arguments using the provided schemas.
    const parseData = (data: unknown[]) => {
        // We expect as many data arguments as there are schemas.
        if (data.length !== expectedDataArgCount) {
            throw new Smorekopp(
                'BAD DATA',
                `Service method expected ${expectedDataArgCount} data arguments, but got ${data.length}.`,
            )
        }

        // Do the actual parsing.
        const parsedData = schema.safeParse(data)
        if (!parsedData.success) {
            throw new ParseError(parsedData)
        }
        return parsedData.data
    }
    
    // Guard to check if the prisma client can be used for this service method.
    const isAppropriateClient = (
        prisma: PrismaClient | Prisma.TransactionClient
    ): prisma is PrismaPossibleTransaction<OpensTransaction> =>
        !config.opensTransaction || '$transaction' in prisma

    // Wraps the execution of the method with parsing, authorization, and context handling.
    async function execute(...args: ServiceMethodInputArgs<OpensTransaction, Schemas>) {
        // First, split the arguments into data and context.
        // There should always be at as many arguments as there are schemas.
        const dataArgs = args.slice(0, expectedDataArgCount)
        // There may also be one additional argument for overriding the context.
        // NOTE: TypeScript thinks this is "{}" for some reason, but this works so it's fine I guess?
        const contextArg = args[expectedDataArgCount] ?? {}

        // Second, parse the data arguments.
        // This function will throw if the data is invalid.
        const parsedData = parseData(dataArgs)

        // Third, get the context (which includes the prisma client, the session and the bypassAuth flag).
        // If a context override is provided, use it. Otherwise, use the context from the async local storage.
        // If there is no context in the async local storage, use global defaults.
        return withContext(contextArg, async context => {
            if (!isAppropriateClient(prisma)) {
                throw new Smorekopp(
                    'SERVER ERROR',
                    'Service method that opens a transaction cannot be called from within a transaction.',
                )
            }

            // Then, authorize user.
            // This has to be done after the validation because the auther might use the data to authorize the user.
            if (!context.bypassAuth) {
                if (!config.auther) {
                    throw new Smorekopp(
                        'UNAUTHENTICATED',
                        'This service method is not externally by users.'
                    )
                }

                const auther = await config.auther(...parsedData, context)
                const authRes = auther.auth(context.session)

                if (!authRes.authorized) {
                    throw new Smorekopp(authRes.status, authRes.getErrorMessage)
                }
            }

            // Finally, call the method.
            return prismaErrorWrapper(() => config.method(...parsedData, context))
        })
    }

    // Attach the schemas to the execute function for introspection purposes
    execute.schemas = config.schemas

    return execute
}
