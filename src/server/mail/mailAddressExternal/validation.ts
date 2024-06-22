import { ntnuEmailDomain } from './ConfigVars'
import { validMailAdressDomains } from '@/server/mail/ConfigVars'
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
        address: z.string().email().min(2).max(50)
            .refine(
                address => !validMailAdressDomains.includes(address.split('@')[1].trim()),
                'The address includes an invalid domain.',
            )
            .refine(
                address => !address.trim().endsWith(`@${ntnuEmailDomain}`),
                `The address cannot be a ${ntnuEmailDomain} address. The person must a regsitered user to recieve mail`,
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
    transformer: data => ({ ...data, id: Number(data.id) })
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
