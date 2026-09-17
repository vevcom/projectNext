import type { mailHandlerSingleton } from '@/lib/email/mailHandler'

declare global {

   var mailHandler: ReturnType<typeof mailHandlerSingleton>
}
