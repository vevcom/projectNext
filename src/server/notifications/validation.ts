import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'
import { NotificationMethodType } from './Types';
import { NotificationMethods } from './ConfigVars';

function createMethodFields(prefix: NotificationMethodType) : Record<string, z.ZodType> {
    const ret : Record<string, z.ZodType> = {};

    NotificationMethods.forEach(field => {
        ret[`${prefix}_${field}`] = z.boolean().optional()
    })
    
    return ret
}

function createMethodFieldString(prefix: NotificationMethodType) {
    return NotificationMethods.map(field => `${prefix}_${field}`)
}

const baseNotificationValidation = new ValidationBase({
    type: {
        id: z.number(),
        name: z.string(),
        description: z.string(),
        parentId: z.string(),
        ...createMethodFields('availableMethods'),
        ...createMethodFields('defaultMethods'),
    } as Record<string, z.ZodType>, // TODO: Ask for better methods
    details: {
        id: z.number().min(1),
        name: z.string().max(50).min(2),
        description: z.string().max(50).min(2),
        parentId: z.number().min(1),
        ...createMethodFields('availableMethods'),
        ...createMethodFields('defaultMethods'),
    } as Record<string, z.ZodType>, // TODO: Ask for better methods
})

export const createNotificationValidation = baseNotificationValidation.createValidation({
    keys: [
        "name",
        "description",
        "parentId",
    ]
    .concat(createMethodFieldString('availableMethods'))
    .concat(createMethodFieldString('defaultMethods')),
    transformer: data => data,
})

export const updateNotificationValidation = baseNotificationValidation.createValidation({
    keys: [
        "id",
        "name",
        "description",
        "parentId",
    ]
    .concat(createMethodFieldString('availableMethods'))
    .concat(createMethodFieldString('defaultMethods')),
    transformer: data => data,
})

export type UpdateNotificationTypes = ValidationTypes<typeof updateNotificationValidation>

