import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'

const typeIdTemplate = z.string().or(z.number())
const detailsIdTemplate = z.number().min(1)

export const baseMailRelationValidation = new ValidationBase({
    type: {
        mailAliasId: typeIdTemplate,
        mailingListId: typeIdTemplate,
        mailAddressExternalId: typeIdTemplate,
        userId: typeIdTemplate,
        groupId: typeIdTemplate,
    },
    details: {
        mailAliasId: detailsIdTemplate,
        mailingListId: detailsIdTemplate,
        mailAddressExternalId: detailsIdTemplate,
        userId: detailsIdTemplate,
        groupId: detailsIdTemplate,
    }
})

export const createAliasMailingListValidation = baseMailRelationValidation.createValidation({
    keys: [
        'mailAliasId',
        'mailingListId',
    ],
    transformer: data => ({
        mailAliasId: Number(data.mailAliasId),
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

export const createMailingListUserValidation = baseMailRelationValidation.createValidation({
    keys: [
        'userId',
        'mailingListId',
    ],
    transformer: data => ({
        userId: Number(data.userId),
        mailingListId: Number(data.mailingListId),
    }),
})
export type CreateMailingListUserType = ValidationTypes<typeof createMailingListUserValidation>

export const createMailingListGroupValidation = baseMailRelationValidation.createValidation({
    keys: [
        'groupId',
        'mailingListId',
    ],
    transformer: data => ({
        groupId: Number(data.groupId),
        mailingListId: Number(data.mailingListId),
    }),
})
export type CreateMailingListGroupType = ValidationTypes<typeof createMailingListGroupValidation>
