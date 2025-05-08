import { zpn } from '@/lib/fields/zpn'
import { z } from 'zod'
import { EventCanView } from '@prisma/client'

export namespace EventSchemas {
    const fields = z.object({
        name: z.string().min(5, 'Navnet må være minst 5 tegn').max(70, 'Navnet må være maks 70 tegn'),
        order: z.coerce.number().int().optional(),
        eventStart: zpn.date({ label: 'Starttid' }),
        eventEnd: zpn.date({ label: 'Sluttid' }),
        canBeViewdBy: z.nativeEnum(EventCanView),

        takesRegistration: zpn.checkboxOrBoolean({ label: 'Tar påmelding' }),
        places: z.coerce.number().int().optional(),
        registrationStart: zpn.date({ label: 'Påmelding start' }).optional(),
        registrationEnd: zpn.date({ label: 'Påmelding slutt' }).optional(),

        waitingList: zpn.checkboxOrBoolean({ label: 'Venteliste' }),

        tagIds: zpn.numberListCheckboxFriendly({ label: 'tags' })
    })

    const waitingListRefiner = (data: {
        waitingList?: boolean,
        takesRegistration?: boolean
    }) => (data.takesRegistration || !data.waitingList)
    const waitingListMessage = 'Kan ikke ha venteliste uten påmelding'

    export const create = fields.pick({
        name: true,
        order: true,
        eventStart: true,
        eventEnd: true,
        canBeViewdBy: true,
        takesRegistration: true,
        places: true,
        registrationStart: true,
        registrationEnd: true,
        tagIds: true,
        waitingList: true,
    }).refine(waitingListRefiner, waitingListMessage)

    export const update = fields.partial().pick({
        name: true,
        order: true,
        eventStart: true,
        eventEnd: true,
        canBeViewdBy: true,
        takesRegistration: true,
        places: true,
        registrationStart: true,
        registrationEnd: true,
        tagIds: true,
        waitingList: true,
    }).refine(waitingListRefiner, waitingListMessage)
}
