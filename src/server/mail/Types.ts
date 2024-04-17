
import { Group, MailAddressExternal, MailAlias, MailingList } from '@prisma/client'
import { UserFiltered } from '@/server/users/Types';


export const MailListTypeArray = ["alias", "mailingList", "group", "user", "mailaddressExternal"] as const
export type MailListTypes = typeof MailListTypeArray[number];

export type MailFlowObject = {
    alias: MailAlias[],
    mailingList: MailingList[],
    group: Group[],
    user: UserFiltered[],
    mailaddressExternal: MailAddressExternal[],
}