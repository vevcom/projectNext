import { dateLessThan, dateLessThanOrEqualTo } from '@/lib/dates/comparison'
import { zpn } from '@/lib/fields/zpn'
import { z } from 'zod'


export namespace CabinBookingSchemas {
    const fields = z.object({
        start: z.coerce.date(),
        end: z.coerce.date(),
        tenantNotes: z.string().optional(),
        numberOfMembers: z.coerce.number().min(0),
        numberOfNonMembers: z.coerce.number().min(0),
        acceptedTerms: zpn.checkboxOrBoolean({
            label: '',
            message: 'Du må godta vilkårene for å bruk siden.'
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
        tenantNotes: true,
        acceptedTerms: true,
        numberOfMembers: true,
        numberOfNonMembers: true,
    }).refine(startEndDateRefiner.fcn, startEndDateRefiner.message)
}

