import 'server-only'
import { dispatchEmailNotifications } from './email'
import { DispatchMethodFunction } from './Types'
import { NotificationMethod } from '@prisma/client'

export const dispatchMethods: Record<keyof(Omit<NotificationMethod, 'id'>), DispatchMethodFunction> = {
    email: dispatchEmailNotifications,
    push: async () => {},
    emailWeekly: async () => {},
}