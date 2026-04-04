import { z } from 'zod'
import { MailListTypeArray } from './types'

export const mailSchemas = {
    createAliasMailingListRelation: z.object({
        mailAliasId: z.coerce.number().min(1),
        mailingListId: z.coerce.number().min(1),
    }),

    createMailingListExternalRelation: z.object({
        mailAddressExternalId: z.coerce.number().min(1),
        mailingListId: z.coerce.number().min(1),
    }),

    createMailingListUserRelation: z.object({
        userId: z.coerce.number().min(1),
        mailingListId: z.coerce.number().min(1),
    }),

    createMailingListGroupRelation: z.object({
        groupId: z.coerce.number().min(1),
        mailingListId: z.coerce.number().min(1),
    }),

    destroyAliasMailingListRelation: z.object({
        mailAliasId: z.coerce.number().min(1),
        mailingListId: z.coerce.number().min(1),
    }),

    destroyMailingListExternalRelation: z.object({
        mailAddressExternalId: z.coerce.number().min(1),
        mailingListId: z.coerce.number().min(1),
    }),

    destroyMailingListUserRelation: z.object({
        userId: z.coerce.number().min(1),
        mailingListId: z.coerce.number().min(1),
    }),

    destroyMailingListGroupRelation: z.object({
        groupId: z.coerce.number().min(1),
        mailingListId: z.coerce.number().min(1),
    }),

    readMailFlow: z.object({
        filter: z.enum(MailListTypeArray),
        id: z.coerce.number().min(1),
    }),
}
