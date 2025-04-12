import { CabinPricePeriodAuthers } from './authers'
import { CabinPricePeriodSchemas } from './schemas'
import { ServiceMethod } from '@/services/ServiceMethod'
import 'server-only'
import { CabinReleasePeriodMethods } from '@/services/cabin/releasePeriod/methods'
import { ServerError } from '@/services/error'
import { z } from 'zod'

export namespace CabinPricePeriodMethods {

    export const create = ServiceMethod({
        auther: () => CabinPricePeriodAuthers.create.dynamicFields({}),
        dataSchema: CabinPricePeriodSchemas.createPricePeriod,
        method: async ({ prisma, data, session }) => {
            const currentReleaseDate = await CabinReleasePeriodMethods.getCurrentReleasePeriod.client(prisma).execute({
                bypassAuth: true,
                session,
            })

            if (currentReleaseDate && currentReleaseDate.releaseUntil >= data.validFrom) {
                throw new ServerError(
                    'BAD DATA',
                    'Kan ikke sette en pris periode til å være gyldig når datoene allerede er sluppet.'
                )
            }

            return await prisma.pricePeriod.create({
                data,
            })
        }
    })

    export const destroy = ServiceMethod({
        auther: () => CabinPricePeriodAuthers.destroy.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        method: async ({ prisma, params }) => prisma.pricePeriod.delete({
            where: params,
        })
    })

    export const readMany = ServiceMethod({
        auther: () => CabinPricePeriodAuthers.read.dynamicFields({}),
        method: async ({ prisma }) => prisma.pricePeriod.findMany()
    })

    export const update = ServiceMethod({
        auther: () => CabinPricePeriodAuthers.update.dynamicFields({}),
        dataSchema: CabinPricePeriodSchemas.updatePricePeriod,
        paramsSchema: z.object({
            pricePeriodId: z.number(),
        }),
        method: async ({ prisma, data, params }) => prisma.pricePeriod.update({
            where: {
                id: params.pricePeriodId,
            },
            data,
        })
    })
}
