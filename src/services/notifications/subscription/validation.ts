

import { notificationMethods, type NotificationMethodGeneral } from '@/server/notifications/Types'
import { newAllMethodsOff } from '@/server/notifications/notificationMethodOperations'
import { validateMethods as ValidateMethods } from '@/server/notifications/channel/validation'
import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'
import type { MinimizedSubscription } from './Types'

export const validateMethods = ValidateMethods

export function parseMethods(raw: unknown):
{success: false, error: z.ZodError } |
{success: true, data: NotificationMethodGeneral } {
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
    const ret: NotificationMethodGeneral = newAllMethodsOff()

    for (const method of notificationMethods) {
        if (typeof objectRaw[method] !== 'boolean') {
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
{success: true, data: MinimizedSubscription[] } {
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
    {success: true, data: MinimizedSubscription } {
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

        if (typeof objectRow.channelId !== 'number') {
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

    for (const row of parsed) {
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
