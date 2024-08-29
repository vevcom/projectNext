import { ValidationBase } from "@/services/Validation"
import type { ValidationTypes } from "@/services/Validation"
import { z } from "zod"

const baseCourseValidation = new ValidationBase({
    type: {
        name: z.string(),
        code: z.string(),
        ectspoints: z.coerce.number(),
    },
    details: {
        name: z.string().max(40, 'Maks 40').min(3, 'min 3').trim(),
        code: z.string().max(12, 'Maks 12').min(3, 'min 3').trim(),
        ectspoints: z.coerce.number().min(1, 'min 1'),
    }
})

export const createCourseValidation = baseCourseValidation.createValidation({
    keys: ['name', 'code', 'ectspoints'],
    transformer: data => data
})
export type CreateCourseTypes = ValidationTypes<typeof createCourseValidation>

export const updateCourseValidation = baseCourseValidation.createValidationPartial({
    keys: ['name', 'code', 'ectspoints'],
    transformer: data => data
})
export type UpdateCourseTypes = ValidationTypes<typeof updateCourseValidation>