import { JobadMethods } from '@/services/career/jobAds/methods'
import type { PrismaClient } from '@prisma/client'


export default async function seedDevJobAds(prisma: PrismaClient) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    JobadMethods.create.client(prisma).execute({
        data: {
            type: 'FULL_TIME',
            applicationDeadline: tomorrow,
            articleName: 'Vever',
            description: 'Vevcom søker nye vevere for å febrisk kode ferdig projectNext',
            companyId: 1,
        },
        bypassAuth: true,
        session: null,
    })
}
