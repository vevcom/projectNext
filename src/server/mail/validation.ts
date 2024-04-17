import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'

const typeIdTemplate = z.string().or(z.number())
const detailsIdTemplate = z.number().min(1)

export const baseMailRelationValidation = new ValidationBase({
    type: {
        aliasId: typeIdTemplate,
        mailingListId: typeIdTemplate,
        mailAddressExternalId: typeIdTemplate,
    },
    details: {
        aliasId: detailsIdTemplate,
        mailingListId: detailsIdTemplate,
        mailAddressExternalId: detailsIdTemplate,
    }
})

export const createAliasMailingListValidation = baseMailRelationValidation.createValidation({
    keys: [
        'aliasId',
        'mailingListId',
    ],
    transformer: data => ({
        aliasId: Number(data.aliasId),
        mailingListId: Number(data.mailingListId),
    }),
})
export type CreateAliasMailingListType = ValidationTypes<typeof createAliasMailingListValidation>

export const createMailingListExternalValidation = baseMailRelationValidation.createValidation({
    keys: [
        'mailAddressExternalId',
        'mailingListId',
    ],
    transformer: data => ({
        mailAddressExternalId: Number(data.mailAddressExternalId),
        mailingListId: Number(data.mailingListId),
    }),
})
export type CreateMailingListExternalType = ValidationTypes<typeof createMailingListExternalValidation>

