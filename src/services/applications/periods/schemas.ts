import { zpn } from '@/lib/fields/zpn'
import { z } from 'zod'

export namespace ApplicationPeriodSchemas {
    const fields = z.object({
        name: z.string().trim().min(2, { message: 'Navnet må være minst 2 tegn.' }),
        startDate: zpn.date({ label: 'Start' }),
        endDate: zpn.date({ label: 'Siste frist for søknader' }),
        endPriorityDate: zpn.date({ label: 'Siste frist for prioritering' }),
        participatingCommitteeIds: zpn.numberListCheckboxFriendly({ label: 'Deltakende komiteer' })
    })

    const refineDates = {
        fcn: (data: { startDate?: Date, endDate?: Date, endPriorityDate?: Date }) => {
            if (!data.startDate && !data.endDate && !data.endPriorityDate) return true
            if (!data.startDate || !data.endDate || !data.endPriorityDate) return false
            return data.startDate < data.endDate && data.endDate <= data.endPriorityDate
        },
        message: 'Starttidspunktet må være før sluttidspunktet.'
    }

    export const create = fields.pick({
        name: true,
        startDate: true,
        endDate: true,
        endPriorityDate: true,
        participatingCommitteeIds: true
    }).refine(refineDates.fcn, refineDates.message)

    export const update = fields.pick({
        name: true,
        startDate: true,
        endDate: true,
        endPriorityDate: true,
        participatingCommitteeIds: true
    }).partial().refine(refineDates.fcn, refineDates.message)
}
