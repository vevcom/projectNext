import { allMethodsOff, allMethodsOn, notificationMethods } from './Types'
import type { NotificationMethod } from './Types'

export function newAllMethodsOff() {
    return {...allMethodsOff}
}

export function newAllMethodsOn() {
    return {...allMethodsOn}
}

export function booleanOperationOnMethods(
    lhs: NotificationMethod,
    rhs: NotificationMethod,
    operation: 'AND' | 'OR' | 'XOR'
): NotificationMethod {
    const ret = Object.assign({}, lhs)

    for (const key of notificationMethods) {
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