import { Zpn } from '@/lib/fields/zpn'
import { z } from 'zod'

const fields = z.object({
    name: z.string().trim().min(2, { message: 'Navnet må være minst 2 tegn.' }),
    startDate: Zpn.date({ label: 'Start' }),
    endDate: Zpn.date({ label: 'Siste frist for søknader' }),
    endPriorityDate: Zpn.date({ label: 'Siste frist for prioritering' }),
    participatingCommitteeIds: Zpn.numberListCheckboxFriendly({ label: 'Deltakende komiteer' })
})

const refineDates = {
    fcn: (data: { startDate?: Date, endDate?: Date, endPriorityDate?: Date }) => {
        if (!data.startDate && !data.endDate && !data.endPriorityDate) return true
        if (!data.startDate || !data.endDate || !data.endPriorityDate) return false
        return data.startDate < data.endDate && data.endDate <= data.endPriorityDate
    },
    message: 'Starttidspunktet må være før sluttidspunktet.'
}

export const applicationPeriodSchemas = {
    create: fields.pick({
        name: true,
        startDate: true,
        endDate: true,
        endPriorityDate: true,
        participatingCommitteeIds: true
    }).refine(refineDates.fcn, refineDates.message),

    update: fields.pick({
        name: true,
        startDate: true,
        endDate: true,
        endPriorityDate: true,
        participatingCommitteeIds: true
    }).partial().refine(refineDates.fcn, refineDates.message),
}
