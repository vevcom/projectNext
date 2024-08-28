import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import { ScreenOrientation } from '@prisma/client'
import { zfd } from 'zod-form-data'
import type { ValidationTypes } from '@/server/Validation'

const baseScreenValidation = new ValidationBase({
    type: {
        orientation: z.nativeEnum(ScreenOrientation),
        name: z.string(),
        connectToPages: zfd.repeatable(z.string().array())
    },
    details: {
        orientation: z.nativeEnum(ScreenOrientation),
        name: z.string(),
        connectToPages: z.array(z.number())
    }
})

const transformConnectToPages = (connectToPages: string[] | undefined) =>
    (connectToPages ? connectToPages.map(parseInt) : undefined)

export const createScreenValidation = baseScreenValidation.createValidation({
    keys: ['name'],
    transformer: data => data
})
export type CreateScreenTypes = ValidationTypes<typeof createScreenValidation>

export const updateScreenValidation = baseScreenValidation.createValidationPartial({
    keys: ['orientation', 'name', 'connectToPages'],
    transformer: data => ({ ...data, connectToPages: transformConnectToPages(data.connectToPages) })
})
export type UpdateScreenTypes = ValidationTypes<typeof updateScreenValidation>
