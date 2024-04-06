import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'

const idZodObjectType = z.string().or(z.number())
const idZodObjectDetails = z.number().min(1)

export const baseMailAliasValidation = new ValidationBase({
    type: {
        id: idZodObjectType,
        address: z.string(),
        description: z.string().or(z.literal('')),
        rawAddress: z.string(),
        sourceId: idZodObjectType,
        drainId: idZodObjectType,
    },
    details: {
        id: idZodObjectDetails,
        address: z.string().email(),
        description: z.string().max(200, 'max lengde 200').min(2, 'min lengde 2').or(z.literal('')),
        rawAddress: z.string().email(),
        sourceId: idZodObjectDetails,
        drainId: idZodObjectDetails,
    }
})

export const createMailAliasValidation = baseMailAliasValidation.createValidation({
    keys: [
        'address',
        'description',
    ],
    transformer: data => data
})
export type CreateMailAliasTypes = ValidationTypes<typeof createMailAliasValidation>

export const createMailAliasRawAddressValidation = baseMailAliasValidation.createValidation({
    keys: [
        'id',
        'rawAddress',
    ],
    transformer: data => ({
        id: Number(data.id),
        rawAddress: data.rawAddress ?? "",
    })
})
export type CreateMailAliasRawAddressTypes = ValidationTypes<typeof createMailAliasRawAddressValidation>

export const destoryMailAliasValidation = baseMailAliasValidation.createValidation({
    keys: [
        'id',
    ],
    transformer: data => ({
        id: Number(data.id),
    }),
})
export type DestoryMailAliasTypes = ValidationTypes<typeof destoryMailAliasValidation>

export const createMailAliasForwardRelationValidation = baseMailAliasValidation.createValidation({
    keys: [
        'sourceId',
        'drainId',
    ],
    transformer: data => ({
        sourceId: Number(data.sourceId),
        drainId: Number(data.drainId),
    }),
})
export type CreateMailAliasForwardRelationTypes = ValidationTypes<typeof createMailAliasForwardRelationValidation>
