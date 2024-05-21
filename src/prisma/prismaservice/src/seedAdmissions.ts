import type { PrismaClient } from '@/generated/pn'

export default async function seedAdmissions(prisma: PrismaClient) {

    await prisma.admissions.createMany({
        data: [
            {
                name: "Plikttiaeneste",
            },
            {
                name: "Proevelsen"
            }
        ]
    })

}