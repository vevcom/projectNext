import type { mailHandlerSingleton } from '@/services/notifications/email/mailHandler'

declare global {

   var mailHandler: ReturnType<typeof mailHandlerSingleton>
}
