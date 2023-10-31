import { Prisma, PrismaClient } from '@prisma/client'
import { DefaultArgs     } from '@prisma/client/runtime/library'

declare global {
   // eslint-disable-next-line no-var
   var prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}
