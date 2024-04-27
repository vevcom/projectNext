
import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'


export const baseNotificaionChannelValidation = new ValidationBase({
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