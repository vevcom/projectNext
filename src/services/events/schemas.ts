import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { EventCanView } from '@prisma/client'

export namespace EventSchemas {
    const schemaFields = z.object({
        name: z.string().min(5, 'Navnet må være minst 5 tegn').max(70, 'Navnet må være maks 70 tegn'),
        order: z.number().int().optional(),
        eventStart: z.string().transform((val) => new Date(val)),
        eventEnd: z.string().transform((val) => new Date(val)),
        canBeViewdBy: z.nativeEnum(EventCanView),

        takesRegistration: z.boolean(),
        places: z.number().int().optional(),
        registrationStart: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
        registrationEnd: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),

        tagIds: zfd.repeatable(z.coerce.number().array())
    })

    export const create = schemaFields.pick({
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
    export const update = schemaFields.partial().pick({
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
