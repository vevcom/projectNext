import { UserFiltered } from "@/server/users/Types";
import { Group, MailAddressExternal, MailAlias, MailingList } from "@prisma/client";


export type TypeConversion = {
    alias: MailAlias,
    mailingList: MailingList,
    group: Group,
    user: UserFiltered,
    mailaddressExternal: MailAddressExternal,
}