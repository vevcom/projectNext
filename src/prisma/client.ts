import { PrismaClient } from '@/prisma-generated-pn-client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
    connectionString: process.env.DB_URI
})

// To prevent hot reloading from creating new instances of PrismaClient it is stored in the global object.
// Read more about it in the section "Prevent hot reloading from creating new instances of PrismaClient" here:
// https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections

// This is how the Prisma docs recommend doing it
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
