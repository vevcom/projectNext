import { allNotificationMethodsOff, allNotificationMethodsOn, notificationMethodsArray } from './constants'
import type { NotificationMethodGeneral } from './Types'

export function newAllMethodsOff() {
    return { ...allNotificationMethodsOff }
}

export function newAllMethodsOn() {
    return { ...allNotificationMethodsOn }
}

export function booleanOperationOnMethods(
    lhs: NotificationMethodGeneral,
    rhs: NotificationMethodGeneral,
    operation: 'AND' | 'OR' | 'XOR'
): NotificationMethodGeneral {
    const ret = Object.assign({}, lhs)

    for (const key of notificationMethodsArray) {
        switch (operation) {
            case 'AND':
                ret[key] &&= rhs[key]
                break
            case 'OR':
                ret[key] ||= rhs[key]
                break
            case 'XOR':
                ret[key] = ret[key] !== rhs[key]
                break
            default:
                throw new Error('The operation is not supported to do at NotificationMethods')
        }
    }

    return ret
}
