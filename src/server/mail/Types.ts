
import type { Group, MailAddressExternal, MailAlias, MailingList } from '@prisma/client'
import type { UserFiltered } from '@/server/users/Types'


export const MailListTypeArray = ['alias', 'mailingList', 'group', 'user', 'mailaddressExternal'] as const
export type MailListTypes = typeof MailListTypeArray[number];

export type ViaType = {
    via?: {
        type: MailListTypes,
        id: number,
        label: string,
    }[],
}

export type MailFlowObject = {
    alias: MailAlias[] & ViaType,
    mailingList: MailingList[] & ViaType,
    group: Group[] & ViaType,
    user: UserFiltered[] & ViaType,
    mailaddressExternal: MailAddressExternal[] & ViaType,
}
