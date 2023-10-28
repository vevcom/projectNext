import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs     } from "@prisma/client/runtime/library";

declare global {
   var prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}