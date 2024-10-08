import { ValidationBase } from "@/services/Validation";
import { z } from "zod";

const baseEventTagValidation = new ValidationBase({
    type: {
        name: z.string(),
        description: z.string(),
    },
    details: {
        name: z.string().min(3, 'Navn må ha minst 3 tegn').max(30, 'Navn kan ha maks 30 tegn').trim(),
        description: z.string().max(200, 'Beskrivelse kan ha maks 200 tegn').trim(),
    }
})

export const createEventTagValidation = baseEventTagValidation.createValidation({
    keys: ['name', 'description'],
    transformer: data => data,
})