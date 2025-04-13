import type { PrismaClient } from '@prisma/client'

export default async function seedDevCompanies(prisma: PrismaClient) {
    await Promise.all(Array.from({ length: 100 }, (_, i) => prisma.company.create({
        data: {
            name: `Company ${i + 1}`,
            description: `Company ${i + 1} description`,
            logo: {
                create: {
                    name: `Company ${i + 1} logo`,
                }
            }
        }
    })))
}
