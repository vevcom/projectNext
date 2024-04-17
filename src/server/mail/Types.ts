
import { Group, MailAddressExternal, MailAlias, MailingList } from '@prisma/client'
import { UserFiltered } from '@/server/users/Types';


export type MailListTypes = "alias" | "mailingList" | "group" | "user" | "mailaddressExternal";

export type MailFlowObject = {
    alias: MailAlias[],
    mailingList: MailingList[],
    group: Group[],
    user: UserFiltered[],
    mailaddressExternal: MailAddressExternal[],
}