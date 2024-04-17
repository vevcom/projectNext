
import { Group, MailAddressExternal, MailAlias, MailingList } from "@prisma/client";
import { UserFiltered } from "@/server/users/Types";

export type PropType = {
    type: 'alias',
    item: MailAlias,
} | {
    type: 'mailingList',
    item: MailingList,
} | {
    type: 'group',
    item: Group,
} | {
    type: 'user',
    item: UserFiltered,
} | {
    type: 'mailaddressExternal',
    item: MailAddressExternal,
};

export default function MailListItem({
    type,
    item,
}: PropType) {

    let displayText = ""

    if (type == "alias" || type == "mailaddressExternal") {
        displayText = item.address;
    }

    if (type == "mailingList") {
        displayText = item.name;
    }
    
    return <li>{displayText}</li>
}