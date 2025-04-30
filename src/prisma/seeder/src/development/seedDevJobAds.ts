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

    JobadMethods.create.client(prisma).execute({
        data: {
            type: 'PART_TIME',
            applicationDeadline: tomorrow,
            articleName: 'Medlem i Hovedstyret',
            description: 'Er du flink til å gå? Da er du perfetk i rollen i HS',
            companyId: 1,
        },
        bypassAuth: true,
        session: null,
    })

    JobadMethods.create.client(prisma).execute({
        data: {
            type: 'INTERNSHIP',
            applicationDeadline: tomorrow,
            articleName: 'Locmeister',
            description: 'Elsker du lokomotiv? Da er Locmeiser din drømme sommerjobb!',
            companyId: 1,
        },
        bypassAuth: true,
        session: null,
    })

    JobadMethods.create.client(prisma).execute({
        data: {
            type: 'CONTRACT',
            applicationDeadline: tomorrow,
            articleName: 'Konsulent',
            description: 'Elsker du penger? Da er dette drømmen jobben for deg, her tjener du massevis av penger.',
            companyId: 1,
        },
        bypassAuth: true,
        session: null,
    })

    JobadMethods.create.client(prisma).execute({
        data: {
            type: 'OTHER',
            applicationDeadline: tomorrow,
            articleName: 'Spåmann',
            description: 'Føler du at du kan se inn i fremtiden? Da vet du allerede om du får jobben eller ikke.',
            companyId: 1,
        },
        bypassAuth: true,
        session: null,
    })
}
