import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'
import { NotificationMethodType } from './Types';
import { NotificationMethods } from './ConfigVars';

function createMethodFields(type : boolean, prefix: NotificationMethodType) : Record<string, z.ZodType> {
    const ret : Record<string, z.ZodType> = {};

    NotificationMethods.forEach(field => {
        ret[`${prefix}_${field}`] = type ? z.string().optional() : z.boolean().optional()
    })
    
    return ret
}

function createMethodFieldString(prefix: NotificationMethodType) {
    return NotificationMethods.map(field => `${prefix}_${field}`)
}

const baseNotificationValidation = new ValidationBase({
    type: {
        id: z.string(),
        name: z.string(),
        description: z.string(),
        parentId: z.string(),
        ...createMethodFields(true, 'availableMethods'),
        ...createMethodFields(true, 'defaultMethods'),
    } as Record<string, z.ZodType>, // TODO: Ask for better methods
    details: {
        id: z.number().min(1),
        name: z.string().max(50).min(2),
        description: z.string().max(50).min(2),
        parentId: z.number().min(1),
        ...createMethodFields(false, 'availableMethods'),
        ...createMethodFields(false, 'defaultMethods'),
    } as Record<string, z.ZodType>, // TODO: Ask for better methods
})

export function transformer(data: Record<string, z.ZodType>) : Record<string, any> {
    const ret : Record<string, any> = {...data}
    if (ret.id) ret.id = Number(ret.id)
    if (ret.parentId) ret.parentId = Number(ret.parentId)

    NotificationMethods.forEach(field => {
        ret[`availableMethods_${field}`] = ret[`availableMethods_${field}`] === 'on'
        ret[`defaultMethods_${field}`] = ret[`defaultMethods_${field}`] === 'on'
    })

    return ret;
}

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
    transformer: transformer,
})

export type UpdateNotificationTypes = ValidationTypes<typeof updateNotificationValidation>

