import { dateLessThan } from '@/lib/dates/comparison'
import { z } from 'zod'

const baseSchema = z.object({
    id: z.coerce.number(),
    releaseTime: z.coerce.date(),
    releaseUntil: z.coerce.date(),
})

const releasePeriodRefiner = {
    fcn: (data: { releaseTime: Date, releaseUntil: Date }) => dateLessThan(data.releaseTime, data.releaseUntil),
    message: 'Slipp tiden må være før slutten av perioden som slippes.'
}

export const cabinReleasePeriodSchemas = {
    createReleasePeriod: baseSchema.pick({
        releaseTime: true,
        releaseUntil: true,
    }).refine(releasePeriodRefiner.fcn, releasePeriodRefiner.message),

    updateReleasePeriod: baseSchema.pick({
        id: true,
        releaseTime: true,
        releaseUntil: true,
    }).refine(releasePeriodRefiner.fcn, releasePeriodRefiner.message),
}
