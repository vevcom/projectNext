import { Zpn } from '@/lib/fields/zpn'
import { z } from 'zod'
import { EventCanView } from '@prisma/client'

const baseSchema = z.object({
    name: z.string().min(5, 'Navnet må være minst 5 tegn').max(70, 'Navnet må være maks 70 tegn'),
    location: z.string().min(2, 'Stedet må være minst 2 tegn'),
    order: z.coerce.number().int().optional(),
    eventStart: Zpn.date({ label: 'Starttid' }),
    eventEnd: Zpn.date({ label: 'Sluttid' }),
    canBeViewdBy: z.nativeEnum(EventCanView),

    takesRegistration: Zpn.checkboxOrBoolean({ label: 'Tar påmelding' }),
    places: z.coerce.number().int().optional(),
    registrationStart: Zpn.date({ label: 'Påmelding start' }).optional(),
    registrationEnd: Zpn.date({ label: 'Påmelding slutt' }).optional(),

    waitingList: Zpn.checkboxOrBoolean({ label: 'Venteliste' }),

    tagIds: Zpn.numberListCheckboxFriendly({ label: 'tags' })
})

const waitingListRefiner = (data: {
    waitingList?: boolean,
    takesRegistration?: boolean
}) => (data.takesRegistration || !data.waitingList)

const waitingListMessage = 'Kan ikke ha venteliste uten påmelding'

export const eventSchemas = {
    create: baseSchema.pick({
        name: true,
        location: true,
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
    }).refine(waitingListRefiner, waitingListMessage),

    update: baseSchema.partial().pick({
        name: true,
        location: true,
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
    }).refine(waitingListRefiner, waitingListMessage),
}
