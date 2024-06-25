import { mailHandlerSingleton } from '@/server/notifications/email/mailHandler';
import type { Prisma, PrismaClient } from '@prisma/client'
import type { DefaultArgs } from '@prisma/client/runtime/library'

declare global {
   // eslint-disable-next-line no-var
   var prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
   var mailHandler: ReturnType<typeof mailHandlerSingleton>
}
