import 'server-only'
import { Smorekopp } from './error'
import { prismaCall } from './prismaCall'
import { default as globalPrisma } from '@/prisma'
import { Session } from '@/auth/Session'
import type { z } from 'zod'
import type {
    PrismaPossibleTransaction,
    ServiceMethodConfig,
    ServiceMethodReturn,
    ServiceMethodExecuteArgs,
    Validation,
    ServiceMethodExecuteArgsUnsafe,
} from './ServiceMethodTypes'

/**
 * Wrapper for creating service methods. It handles validation, authorization, and errors for you.
 * @param config - The configuration for the service method.
 * @param config.auther - The auther that will be used to authorize the user.
 * @param config.dynamicAuthFields - A function that returns the dynamic auth fields that will be used to authorize the user.
 * @param config.method - The method that will be called when the service method is executed.
 * @param config.validation - The validation that will be used to validate the data that is passed to the service method.
 * @param [config.opensTransaction=false] - Whether or not the service method opens a transaction. (Just for correct typing)
 */
export function ServiceMethod<
    DynamicFields extends object,
    OpensTransaction extends boolean,
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataValidation extends Validation<unknown, unknown> | undefined = undefined,
>(
    config: ServiceMethodConfig<DynamicFields, OpensTransaction, Return, ParamsSchema, DataValidation>,
): ServiceMethodReturn<OpensTransaction, Return, ParamsSchema, DataValidation> {
    const argsAreValid = (
        args: ServiceMethodExecuteArgsUnsafe
    ): args is ServiceMethodExecuteArgs<ParamsSchema, DataValidation> => {
        const paramsMatch = (args.params === undefined) === (config.paramsSchema === undefined)
        const dataMatches = (args.data === undefined) === (config.dataValidation === undefined)
        return paramsMatch && dataMatches
    }

    const client = (prisma: PrismaPossibleTransaction<OpensTransaction>) => {
        const executeUnsafe = async (args: ServiceMethodExecuteArgsUnsafe) => {
            // First, validate parameters (if any)

            if (args.params) {
                if (!config.paramsSchema) {
                    throw new Smorekopp('SERVER ERROR', 'Service method recieved params, but has no params schema.')
                }

                // TODO: Decide if this should be a validation or a schema.
                // For now it's just a schema because it's simpler.
                const paramsParse = config.paramsSchema.safeParse(args.params)

                if (!paramsParse.success) {
                    throw new Smorekopp('BAD PARAMETERS', 'Invalid params passed to service method.')
                }

                args.params = paramsParse.data
            }

            // Then, validate data (if any)

            if (args.data) {
                if (!config.dataValidation) {
                    throw new Smorekopp('SERVER ERROR', 'Service method recieved validation, but has no validation.')
                }

                args.data = config.dataValidation.detailedValidate(args.data)
            }

            // Then, determine if the correct properties are present

            if (!argsAreValid(args)) {
                throw new Smorekopp('SERVER ERROR', 'Service method recieved invalid arguments.')
            }

            // Then, authorize user

            if (!args.bypassAuth && config.auther !== 'NO_AUTH') {
                const authRes = config.auther
                    .dynamicFields(await config.dynamicAuthFields(args))
                    .auth(args.session ?? Session.empty())

                if (!authRes.authorized) {
                    throw new Smorekopp(authRes.status)
                }
            }

            // Finally, call the method

            return prismaCall(() => config.method({
                ...args,
                prisma,
                session: args.session ?? Session.empty(),
            }))
        }

        return {
            executeUnsafe,
            execute: (args: ServiceMethodExecuteArgs<ParamsSchema, DataValidation>) => executeUnsafe(args),
        }
    }

    return {
        client,
        newClient: () => client(globalPrisma),
        paramsSchema: config.paramsSchema,
        dataValidation: config.dataValidation,
    }
}
