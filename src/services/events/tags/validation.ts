import { ValidationBase } from "@/services/Validation";
import { z } from "zod";

const baseEventTagValidation = new ValidationBase({
    type: {
        name: z.string(),
        description: z.string(),
        colorR: z.coerce.number(),
        colorG: z.coerce.number(),
        colorB: z.coerce.number().int()
    },
    details: {
        name: z.string().min(3, 'Navn må ha minst 3 tegn').max(30, 'Navn kan ha maks 30 tegn').trim(),
        description: z.string().max(200, 'Beskrivelse kan ha maks 200 tegn').trim(),
        colorR: z.number().int().min(0).max(255),
        colorG: z.number().int().min(0).max(255),
        colorB: z.number().int().min(0).max(255),
    }
})

export const createEventTagValidation = baseEventTagValidation.createValidation({
    keys: ['name', 'description', 'colorB', 'colorG', 'colorR'],
    transformer: data => data,
})

export const updateEventTagValidation = baseEventTagValidation.createValidationPartial({
    keys: ['name', 'description', 'colorB', 'colorG', 'colorR'],
    transformer: data => data,
})