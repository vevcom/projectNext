import { MailFlowObject, MailListTypes } from "@/server/mail/Types"
import { TypeConversion } from "./Types"


export function getDisplayText<T extends MailListTypes>(type: T, item: TypeConversion[T]): string {
    if ((type === 'alias' || type === 'mailaddressExternal') && 'address' in item) {
        return item.address
    }

    if (type === 'mailingList' && 'name' in item) {
        return item.name
    }

    if (type === 'user' && 'firstname' in item && 'lastname' in item) {
        return `${item.firstname} ${item.lastname}`
    }

    if (type === 'group') {
        return String(item.id)
    }

    console.warn('This code should never run. This mens that the argument passed to MailList is invalid.')

    return ''
}

export function getDisplayTextFromFlowOject<T extends MailListTypes>(type: T, mailFlow: MailFlowObject): string {

    const itemList = mailFlow[type]

    if (itemList.length == 0) {
        return ""; // This should never happen
    }

    return getDisplayText(type, itemList[0] as TypeConversion[T])
}