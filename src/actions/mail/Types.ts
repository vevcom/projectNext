import { UserFiltered } from "@/server/users/Types";
import { MailAddressExternal, MailAlias, MailingList } from "@prisma/client";


export type MailOptionsType = {
    alias: MailAlias[],
    mailingList: MailingList[],
    mailaddressExternal: MailAddressExternal[],
    users: UserFiltered[],
}
