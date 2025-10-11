import type { mailHandlerSingleton } from '@/services/notifications/email/mailHandler'

declare global {
   // eslint-disable-next-line no-var
   var mailHandler: ReturnType<typeof mailHandlerSingleton>
}
