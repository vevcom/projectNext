import { notificationMethods } from './Types'
import { ServerError } from '@/server/error'
import type { NotificationMethod } from './Types'


export function booleanOperationOnMethods(
    lhs: NotificationMethod,
    rhs: NotificationMethod,
    operation: 'AND' | 'OR'
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
            default:
                throw new ServerError('BAD PARAMETERS', 'The operation is not supported to do at NotificationMethods')
        }
    }

    return ret
}
