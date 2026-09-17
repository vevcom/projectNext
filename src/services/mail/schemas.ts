import { MailListTypeArray } from './types'
import { z } from 'zod'

const aliasMailingListRelation = z.object({
    mailAliasId: z.coerce.number().min(1),
    mailingListId: z.coerce.number().min(1),
})

const mailingListExternalRelation = z.object({
    mailAddressExternalId: z.coerce.number().min(1),
    mailingListId: z.coerce.number().min(1),
})

const mailingListUserRelation = z.object({
    userId: z.coerce.number().min(1),
    mailingListId: z.coerce.number().min(1),
})

const mailingListGroupRelation = z.object({
    groupId: z.coerce.number().min(1),
    mailingListId: z.coerce.number().min(1),
})

export const mailSchemas = {
    createAliasMailingListRelation: aliasMailingListRelation,
    createMailingListExternalRelation: mailingListExternalRelation,
    createMailingListUserRelation: mailingListUserRelation,
    createMailingListGroupRelation: mailingListGroupRelation,

    destroyAliasMailingListRelation: aliasMailingListRelation,
    destroyMailingListExternalRelation: mailingListExternalRelation,
    destroyMailingListUserRelation: mailingListUserRelation,
    destroyMailingListGroupRelation: mailingListGroupRelation,

    readMailFlow: z.object({
        filter: z.enum(MailListTypeArray),
        id: z.coerce.number().min(1),
    }),
}
