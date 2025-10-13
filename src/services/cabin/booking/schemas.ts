import { dateLessThan, dateLessThanOrEqualTo } from '@/lib/dates/comparison'
import { Zpn } from '@/lib/fields/zpn'
import { z } from 'zod'

const baseSchema = z.object({
    start: z.coerce.date(),
    end: z.coerce.date(),
    tenantNotes: z.string().optional(),
    numberOfMembers: z.coerce.number().min(0),
    numberOfNonMembers: z.coerce.number().min(0),
    firstname: z.string().min(2),
    lastname: z.string().min(2),
    email: z.string().email(),
    mobile: z.string().regex(/^\+?\d{4,20}$/, { message: 'Skriv kun tall, uten mellomrom.' }),
    acceptedTerms: Zpn.checkboxOrBoolean({
        label: '',
        message: 'Du må godta vilkårene for å bruk siden.'
    })
})

const startEndDateRefiner = {
    fcn: (data: { start: Date, end: Date }) =>
        dateLessThan(data.start, data.end) && dateLessThanOrEqualTo(new Date(), data.start),
    message: 'Start dato må være før sluttdato. Start daten må være i ramtiden'
}

export const cabinBookingSchemas = {
    createBookingUserAttached: baseSchema.pick({
        start: true,
        end: true,
        tenantNotes: true,
        acceptedTerms: true,
        numberOfMembers: true,
        numberOfNonMembers: true,
    }).refine(startEndDateRefiner.fcn, startEndDateRefiner.message),

    createBookingNoUser: baseSchema.pick({
        start: true,
        end: true,
        tenantNotes: true,
        acceptedTerms: true,
        firstname: true,
        lastname: true,
        email: true,
        mobile: true,
    }).refine(startEndDateRefiner.fcn, startEndDateRefiner.message),
}

