import 'server-only'
import { Smorekopp } from './error'
import { prismaCall } from './prismaCall'
import { Session } from '@/auth/Session'
import type { ServiceMethodExecuteArgs, PrismaPossibleTransaction, ServiceMethodConfig, ServiceMethodReturn } from './ServiceMethodTypes'

/**
 * Wrapper for creating service methods. It handles validation, authorization, and errors for you.
 * @param config - The configuration for the service method.
 * @param config.auther - The auther that will be used to authorize the user.
 * @param config.dynamicAuthFields - A function that returns the dynamic auth fields that will be used to authorize the user.
 * @param config.method - The method that will be called when the service method is executed.
 * @param config.validation - The validation that will be used to validate the data that is passed to the service method.
 * @param [config.opensTransaction=false] - Whether or not the service method opens a transaction.
 */
export function ServiceMethod<
    DynamicFields extends object,
    Return,
    OpensTransaction extends boolean = false,
    TakesParams extends boolean = false,
    TakesData extends boolean = false,
    GeneralData = undefined,
    DetailedData = undefined,
    Params = undefined,
>(
    config: ServiceMethodConfig<Params, TakesParams, GeneralData, DetailedData, TakesData, OpensTransaction, Return, DynamicFields>
): ServiceMethodReturn<Params, TakesParams, GeneralData, DetailedData, TakesData, Return, OpensTransaction> {
    const client = (client: PrismaPossibleTransaction<OpensTransaction>) => ({
        execute: async (args: ServiceMethodExecuteArgs<Params, TakesParams, DetailedData, TakesData>) => {
            // First validate parameters (if any)

            if (config.takesParams) {
                if (!('paramsSchema' in config)) {
                    throw new Smorekopp('SERVER ERROR', 'Service method takes params, but has no params schema.')
                }

                if (!('params' in args)) {
                    throw new Smorekopp('SERVER ERROR', 'Serivce method expects params, but none were passed.')
                }

                // TODO: Decide if this should be a validation or a schema.
                // For now it's just a schema because it's simpler.
                const paramsParse = config.paramsSchema.safeParse(args.params)

                if (!paramsParse.success) {
                    throw new Smorekopp('BAD PARAMETERS', 'Invalid params passed to service method.')
                }

                args.params = paramsParse.data
            }
            

            // Then validate data (if any)

            if (config.takesData) {
                if (!('validation' in config)) {
                    throw new Smorekopp('SERVER ERROR', 'Service method takes data, but has no validation.')
                }

                if (!('data' in args)) {
                    throw new Smorekopp('SERVER ERROR', 'Serivce method expects data, but none were passed.')
                }

                args.data = config.validation.detailedValidate(args.data)
            }

            // Then authorize user

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
                prisma: client,
                session: args.session,
            }))
        }
    })

    return {
        takesParams: config.takesParams,
        takesData: config.takesData,
        typeValidate: ('validation' in config) ? config.validation.typeValidate : undefined,
        client,
        newClient: () => client(prisma),
    }
}
