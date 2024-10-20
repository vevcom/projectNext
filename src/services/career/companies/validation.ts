import { ValidationBase } from "@/services/Validation";
import { z } from "zod";

const baseCompanValidation = new ValidationBase({
    type: {
        name: z.string(),
        description: z.string(),
    },
    details: {
        name: z.string().min(
            2, 'Navnet må være minst 3 tegn langt'
        ).max(
            100, 'Navnet kan maks være 100 tegn langt'
        ).trim(),
        description: z.string().max(
            200, 'Beskrivelsen kan maks være 200 tegn langt'
        ).trim(),
    }
})

export const createCompanyValidation = baseCompanValidation.createValidation({
    keys: ['name', 'description'],
    transformer: data => data,
})

export const updateCompanyValidation = baseCompanValidation.createValidationPartial({
    keys: ['name', 'description'],
    transformer: data => data,
})