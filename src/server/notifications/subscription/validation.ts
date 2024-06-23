

import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'
import { NotificationMethod, notificationMethods } from '../Types'
import { newAllMethodsOff } from '../notificationMethodOperations'
import { MinimizedSubscription } from './Types'
import { validateMethods as ValidateMethods } from '../channel/validation'

export const validateMethods = ValidateMethods

export function parseMethods(raw: unknown):
{success: false, error: z.ZodError } |
{success: true, data: NotificationMethod }
{
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        return {
            success: false,
            error: new z.ZodError([{
                code: 'custom',
                path: [],
                message: 'The given data is not an object'
            }]),
        }
    }

    const objectRaw = raw as {[key: string]: boolean}
    const ret: NotificationMethod = newAllMethodsOff()

    for (let method of notificationMethods) {
        if (
            !objectRaw.hasOwnProperty(method) ||
            !(typeof objectRaw[method] === 'boolean')
        ) {
            return {
                success: false,
                error: new z.ZodError([{
                    code: 'custom',
                    path: [],
                    message: 'The object contains values that are not boolean'
                }]),
            }
        }

        ret[method] = objectRaw[method]
    }

    return {
        success: true,
        data: ret
    }
}

export function parseSubscriptionMatrix(raw: unknown):
{success: false, error: z.ZodError } |
{success: true, data: MinimizedSubscription[] }
{
    if (!Array.isArray(raw)) {
        return {
            success: false,
            error: new z.ZodError([{
                code: 'custom',
                path: [],
                message: 'The given data is not an Array'
            }]),
        }
    }

    function validateRow(row: unknown):
    {success: false, error: z.ZodError } |
    {success: true, data: MinimizedSubscription }
    {
        if (!row || typeof row !== 'object' || Array.isArray(row)) {
            return {
                success: false,
                error: new z.ZodError([{
                    code: 'custom',
                    path: [],
                    message: 'The given data is not an object'
                }]),
            }
        }

        const objectRow = row as {[key: string]: boolean}

        if (!objectRow.hasOwnProperty('channelId') ||
            typeof objectRow['channelId'] !== 'number'
        ) {
            return {
                success: false,
                error: new z.ZodError([{
                    code: 'custom',
                    path: [],
                    message: 'A row does not contain a valid channelId'
                }])
            }
        }

        const methods = parseMethods(objectRow.methods)

        if (!methods.success) {
            return methods
        }

        return {
            success: true,
            data: {
                channelId: objectRow.channelId,
                methods: methods.data,
            },
        }
    }

    const parsed = raw.map(validateRow)

    const errors = new z.ZodError([])

    const ret: MinimizedSubscription[] = []
    
    for (let row of parsed) {
        if (row.success) {
            ret.push(row.data)
        } else {
            errors.addIssue(row.error.errors[0])
        }
    }

    if (errors.errors.length) {
        return {
            success: false,
            error: errors,
        }
    }

    return {
        success: true,
        data: ret,
    }
} 

export const baseSubscriptionValidation = new ValidationBase({
    type: {
        userId: z.string().or(z.number()),
    },
    details: {
        userId: z.number(),
    }
})

export const updateSubscriptionValidation = baseSubscriptionValidation.createValidation({
    keys: [
        'userId',
    ],
    transformer: data => ({
        userId: Number(data.userId),
    }),
})
export type UpdateSubscriptionType = ValidationTypes<typeof updateSubscriptionValidation>
