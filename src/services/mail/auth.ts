import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequireEveryPermission } from '@/auth/auther/RequireEveryPermission'

export const mailAuth = {
    createAliasMailingListRelation: RequirePermission.staticFields({ permission: 'MAILINGLIST_ALIAS_CREATE' }),
    createMailingListExternalRelation: RequirePermission.staticFields({ permission: 'MAILINGLIST_EXTERNAL_ADDRESS_CREATE' }),
    createMailingListUserRelation: RequirePermission.staticFields({ permission: 'MAILINGLIST_USER_CREATE' }),
    createMailingListGroupRelation: RequirePermission.staticFields({ permission: 'MAILINGLIST_GROUP_CREATE' }),
    destroyAliasMailingListRelation: RequirePermission.staticFields({ permission: 'MAILINGLIST_ALIAS_DESTROY' }),
    destroyMailingListExternalRelation: RequirePermission.staticFields({
        permission: 'MAILINGLIST_EXTERNAL_ADDRESS_DESTROY'
    }),
    destroyMailingListUserRelation: RequirePermission.staticFields({ permission: 'MAILINGLIST_USER_DESTROY' }),
    destroyMailingListGroupRelation: RequirePermission.staticFields({ permission: 'MAILINGLIST_GROUP_DESTROY' }),
    readMailFlow: RequireEveryPermission.staticFields({
        permissions: ['MAILINGLIST_READ', 'MAILALIAS_READ', 'MAILADDRESS_EXTERNAL_READ', 'GROUP_READ']
    }),
    readMailOptions: RequireEveryPermission.staticFields({
        permissions: ['MAILINGLIST_READ', 'MAILALIAS_READ', 'MAILADDRESS_EXTERNAL_READ']
    })
} as const
