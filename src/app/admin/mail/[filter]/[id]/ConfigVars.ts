import { MailListTypes } from "@/server/mail/Types";



export const MailDisplayLabels: Record<MailListTypes, String> = {
    mailingList: "Mail liste",
    group: "Gruppe",
    user: "Bruker",
    alias: "Alias",
    mailaddressExternal: "Ekstern adresse"
}

export const typeDisplayName: Record<MailListTypes, string> = {
    alias: 'Alias',
    mailingList: 'Mail lister',
    group: 'Grupper',
    user: 'Brukere',
    mailaddressExternal: 'Eksterne adresser',
}