import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { EventCanView } from '@prisma/client'


export const baseEventValidation = new ValidationBase({
    type: {
        name: z.string(),
        order: z.number().int().optional(),
        eventStart: z.string(),
        eventEnd: z.string(),
        canBeViewdBy: z.nativeEnum(EventCanView),

        takesRegistration: z.string().optional(),
        places: z.coerce.number().optional(),
        registrationStart: z.string().optional(),
        registrationEnd: z.string().optional(),

        tags: zfd.repeatable(z.string().array())
    },
    details: {
        name: z.string().min(5, 'Navnet må være minst 5 tegn').max(70, 'Navnet må være maks 70 tegn'),
        order: z.number().int().optional(),
        eventStart: z.date(),
        eventEnd: z.date(),
        canBeViewdBy: z.nativeEnum(EventCanView),

        takesRegistration: z.boolean(),
        places: z.number().int().optional(),
        registrationStart: z.date().optional(),
        registrationEnd: z.date().optional(),

        tags: zfd.repeatable(z.string().array())
    }
})


const dateTransformer = (date: string | undefined) => (date ? new Date(date) : undefined)

export const createEventValidation = baseEventValidation.createValidation({
    keys: [
        'name',
        'order',
        'eventStart',
        'eventEnd',
        'takesRegistration',
        'places',
        'registrationStart',
        'registrationEnd',
        'tags',
        'canBeViewdBy',
    ],
    transformer: data => ({
        ...data,
        takesRegistration: data.takesRegistration ? data.takesRegistration === 'on' : false,
        eventStart: new Date(data.eventStart),
        eventEnd: new Date(data.eventEnd),
        registrationStart: dateTransformer(data.registrationStart),
        registrationEnd: dateTransformer(data.registrationEnd),
    })
})

export const updateEventValidation = baseEventValidation.createValidationPartial({
    keys: [
        'name',
        'order',
        'eventStart',
        'eventEnd',
        'takesRegistration',
        'places',
        'registrationStart',
        'registrationEnd',
        'tags',
        'canBeViewdBy',
    ],
    transformer: data => ({
        ...data,
        takesRegistration: data.takesRegistration ? data.takesRegistration === 'on' : false,
        eventStart: dateTransformer(data.eventStart),
        eventEnd: dateTransformer(data.eventEnd),
        registrationStart: dateTransformer(data.registrationStart),
        registrationEnd: dateTransformer(data.registrationEnd),
    })
})
