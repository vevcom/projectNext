import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'


export const basemailAddressExternalValidation = new ValidationBase({
    type: {
        id: z.string().or(z.number()),
        address: z.string(),
        description: z.string(),
    },
    details: {
        id: z.number().min(1),
        address: z.string().min(2).max(50)
            .refine(
                address => (!process.env.DOMAIN || !address.trim().endsWith(`@${process.env.DOMAIN}`)),
                `The address cannot contain the domain: ${process.env.DOMAIN}`,
            )
            .refine(
                address => !address.trim().endsWith(`@stud.ntnu.no`),
                "The address cannot be a stud.ntnu.no address. The person must a regsitered user to recieve mail",
            ),
        description: z.string().max(200).optional(),
    }
})

export const createMailAddressExternalValidation = basemailAddressExternalValidation.createValidation({
    keys: [
        'address',
        'description',
    ],
    transformer: data => data
})
export type CreateMailAddressExternalTypes = ValidationTypes<typeof createMailAddressExternalValidation>

export const updateMailAddressExternalValidation = basemailAddressExternalValidation.createValidation({
    keys: [
        'id',
        'address',
        'description',
    ],
    transformer: data => ({...data, id: Number(data.id)})
})
export type UpdatemailAddressExternalTypes = ValidationTypes<typeof updateMailAddressExternalValidation>

export const readMailAddressExternalValidation = basemailAddressExternalValidation.createValidation({
    keys: [
        'id',
    ],
    transformer: data => ({
        id: Number(data.id),
    }),
})
export type ReadMailAddressExternalTypes = ValidationTypes<typeof readMailAddressExternalValidation>
