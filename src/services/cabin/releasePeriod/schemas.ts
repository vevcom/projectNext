import { dateLessThan } from '@/lib/dates/comparison'
import { z } from 'zod'


export namespace CabinReleasePeriodSchemas {
    const fields = z.object({
        id: z.coerce.number(),
        releaseTime: z.date(),
        releaseUntil: z.date(),
    })

    const releasePeriodRefiner = {
        fcn: (data: { releaseTime: Date, releaseUntil: Date }) => dateLessThan(data.releaseTime, data.releaseUntil),
        message: 'Slipp tiden må være før slutten av perioden som slippes.'
    }

    export const createReleasePeriod = fields.pick({
        releaseTime: true,
        releaseUntil: true,
    }).refine(releasePeriodRefiner.fcn, releasePeriodRefiner.message)

    export const updateReleasePeriod = fields.pick({
        id: true,
        releaseTime: true,
        releaseUntil: true,
    }).refine(releasePeriodRefiner.fcn, releasePeriodRefiner.message)
}

