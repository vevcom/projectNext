import { zpn } from '@/lib/fields/zpn'
import { z } from 'zod'

export namespace ApplicationPeriodSchemas {
    const fields = z.object({
        name: z.string().trim().min(2, { message: 'Navnet må være minst 2 tegn.' }),
        startDate: zpn.date({ label: 'Starttid' }),
        endDate: zpn.date({ label: 'Sluttid' }),
        participatingCommitteeIds: zpn.numberListCheckboxFriendly({ label: 'Deltakende komiteer' })
    })

    const refineDates = {
        fcn: (data: { startDate?: Date, endDate?: Date }) => {
            if (!data.startDate && !data.endDate) return true
            if (!data.startDate || !data.endDate) return false
            return data.startDate < data.endDate
        },
        message: 'Starttidspunktet må være før sluttidspunktet.'
    }

    export const create = fields.pick({
        name: true,
        startDate: true,
        endDate: true,
        participatingCommitteeIds: true
    }).refine(refineDates.fcn, refineDates.message)

    export const update = fields.pick({
        name: true,
        startDate: true,
        endDate: true,
        participatingCommitteeIds: true
    }).partial().refine(refineDates.fcn, refineDates.message)
}
