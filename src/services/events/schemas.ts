import { zpn } from '@/lib/fields/zpn'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
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

        tagIds: zfd.repeatable(z.coerce.number().array())
    })

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
    })
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
    })
}
