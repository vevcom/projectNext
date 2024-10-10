import { ValidationBase } from "@/services/Validation";
import { z } from "zod";


const baseEventRegistrationValidation = new ValidationBase({
    type: {
        comments: z.string().optional(),
    },
    details: {
        comments: z.string().optional(),
    },
})

export const createEventRegistrationValidation = baseEventRegistrationValidation.createValidation({
    keys: ['comments'],
    transformer: data => data
})

export const updateEventRegistrationValidation = baseEventRegistrationValidation.createValidationPartial({
    keys: ['comments'],
    transformer: data => data
})