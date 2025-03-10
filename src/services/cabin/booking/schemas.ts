import { dateLessThan, dateLessThanOrEqualTo } from '@/lib/dates/comparison'
import { BookingType } from '@prisma/client'
import { z } from 'zod'


export namespace CabinBookingSchemas {
    const fields = z.object({
        start: z.coerce.date(),
        end: z.coerce.date(),
        type: z.nativeEnum(BookingType),
        tenantNotes: z.string().optional(),
        acceptedTerms: z.literal('on', {
            errorMap: () => ({ message: 'Du må godta vilkårene for å bruk siden.' }),
        })
    })

    const startEndDateRefiner = {
        fcn: (data: { start: Date, end: Date }) =>
            dateLessThan(data.start, data.end) && dateLessThanOrEqualTo(new Date(), data.start),
        message: 'Start dato må være før sluttdato. Start daten må være i ramtiden'
    }

    export const createBookingUserAttached = fields.pick({
        start: true,
        end: true,
        type: true,
        tenantNotes: true,
        acceptedTerms: true,
    }).refine(startEndDateRefiner.fcn, startEndDateRefiner.message)
}

