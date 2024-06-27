import type { mailHandlerSingleton } from '@/server/notifications/email/mailHandler'
import type { Prisma, PrismaClient } from '@prisma/client'
import type { DefaultArgs } from '@prisma/client/runtime/library'

declare global {
   // eslint-disable-next-line no-var
   let prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
   let mailHandler: ReturnType<typeof mailHandlerSingleton>
}
