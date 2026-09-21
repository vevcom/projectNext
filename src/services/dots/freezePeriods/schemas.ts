import { Zpn } from '@/lib/fields/zpn'
import { z } from 'zod'

const baseSchema = z.object({
    start: Zpn.date({ label: 'Start' }),
    end: Zpn.date({ label: 'Slutt' }),
    reason: z.string().max(200, 'Begrunnelse kan ha maks 200 tegn').trim(),
})

const freezePeriodRefiner = {
    fcn: (data: { start: Date, end: Date }) => data.start < data.end,
    message: 'Frysperioden må slutte etter at den starter.'
}

export const dotFreezePeriodSchemas = {
    create: baseSchema.pick({
        start: true,
        end: true,
        reason: true,
    }).refine(freezePeriodRefiner.fcn, freezePeriodRefiner.message),
    update: baseSchema.pick({
        start: true,
        end: true,
        reason: true,
    }).refine(freezePeriodRefiner.fcn, freezePeriodRefiner.message),
}
