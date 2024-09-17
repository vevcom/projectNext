import { z } from "zod";
import { ValidationBase } from "../Validation";
import { zfd } from "zod-form-data";
import { EventCanView } from "@prisma/client";


export const baseEventValidation = new ValidationBase({
    type: {
        name: z.string(),
        order: z.number().int().optional(),
        eventStart: z.date(),
        eventEnd: z.date(),
        canBeViewdBy: z.nativeEnum(EventCanView),

        takesRegistration: z.boolean(),
        places: z.number().optional(),
        registrationStart: z.date().optional(),
        registrationEnd: z.date().optional(),

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
    transformer: data => data
})