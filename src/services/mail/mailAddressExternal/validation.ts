import { NTNUEmailDomain } from './ConfigVars'
import { validMailAdressDomains } from '@/services/mail/ConfigVars'
import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/services/Validation'


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
                'E-post adressen inneholder et forbudt domene navn.',
            )
            .refine(
                address => !address.trim().endsWith(`@${NTNUEmailDomain}`),
                `E-post addressen kan ikke ha ${NTNUEmailDomain} domene.
                 I slike tilfeller må personen være en bruker på nettsiden.`,
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
