import { Smorekopp } from './error'
import { ReadUserAuther } from './users/Authers'
import { prismaCall } from './prismaCall'
import prisma from '@/prisma'
import { Session } from '@/auth/Session'
import { z } from 'zod'
import { Validation } from './Validation'
import { ServiceMethodExecuteArgs, PrismaPossibleTransaction, ServiceMethodConfig } from './ServiceMethodTypesRefactored'

export function ServiceMethod<
    DynamicFields extends object,
    GeneralData,
    DetailedData,
    Return,
    Params = undefined,
    OpensTransaction extends boolean = false,
>(
    config: ServiceMethodConfig<Params, GeneralData, DetailedData, OpensTransaction, Return, DynamicFields>
) {
    const client = (client: PrismaPossibleTransaction<OpensTransaction>) => ({
        execute: async (args: ServiceMethodExecuteArgs<Params, DetailedData>) => {
            if ('data' in args) {
                if (!config.validation) {
                    throw new Smorekopp('SERVER ERROR', 'Recieved data, but no validation was provided.')
                }

                args.data = config.validation?.detailedValidate(args.data)
            }

            if (!args.bypassAuth) {
                const authRes = config.auther
                    .dynamicFields(await config.dynamicAuthFields())
                    .auth(args.session ?? Session.empty())

                if (!authRes.authorized) {
                    throw new Smorekopp(authRes.status)
                }
            }

            return prismaCall(() => config.method({
                ...args,
                prisma: client,
                session: args.session,
            }))
        }
    })

    return {
        client,
        new_client: () => client(prisma),
    }
}

const createSomethingValidation = new Validation({
    type: {
        username: z.string(),
        email: z.string(),
    },
    details: {
        username: z.string(),
        email: z.string().email(),
    },
    transformer: (data) => data,
})

const createSomething = ServiceMethod({
    auther: ReadUserAuther,
    validation: createSomethingValidation,
    method: ({ prisma, data }) => {
        prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
            }
        })
    },
    dynamicAuthFields: () => ({
        username: 'test',
    }),
})

prisma.$transaction(async (prisma) => {
    const x = createSomething.client(prisma).execute({
        session: Session.empty(),
        data: {
            email: 'test@example.com',
            username: 'test',
        },
    })
})

