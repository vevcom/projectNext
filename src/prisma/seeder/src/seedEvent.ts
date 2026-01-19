import type { PrismaClient } from '@/prisma-generated-pn-client'


export default async function seedEvents(prisma: PrismaClient) {
    await prisma.eventTag.create({
        data: {
            special: 'COMPANY_PRESENTATION',
            name: 'BedPres',
            description: 'Bedrifts presentasjon',
            colorR: 255,
            colorG: 0,
            colorB: 0,
        }
    })
}
