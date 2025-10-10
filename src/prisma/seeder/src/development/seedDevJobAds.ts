import { jobAdMethods } from '@/services/career/jobAds/methods'
import type { JobType, PrismaClient } from '@prisma/client'


export default async function seedDevJobAds(prisma: PrismaClient) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const image = await prisma.image.findUniqueOrThrow({
        where: {
            special: 'FAIR',
        }
    })

    const jobAdData: {
        type: JobType,
        applicationDeadline: Date,
        articleName: string,
        description: string,
    }[] = [
        {
            type: 'FULL_TIME',
            applicationDeadline: tomorrow,
            articleName: 'Vever',
            description: 'Vevcom søker nye vevere for å febrisk kode ferdig projectNext',
        },
        {
            type: 'PART_TIME',
            applicationDeadline: tomorrow,
            articleName: 'Medlem i Hovedstyret',
            description: 'Er du flink til å gå? Da er du perfetk i rollen i HS',
        },
        {
            type: 'INTERNSHIP',
            applicationDeadline: tomorrow,
            articleName: 'Locmeister',
            description: 'Elsker du lokomotiv? Da er Locmeiser din drømme sommerjobb!',
        },
        {
            type: 'CONTRACT',
            applicationDeadline: tomorrow,
            articleName: 'Konsulent',
            description: 'Elsker du penger? Da er dette drømmen jobben for deg, her tjener du massevis av penger.',
        },
        {
            type: 'OTHER',
            applicationDeadline: tomorrow,
            articleName: 'Spåmann',
            description: 'Føler du at du kan se inn i fremtiden? Da vet du allerede om du får jobben eller ikke.',
        },
    ]

    for (const jobAd of jobAdData) {
        const restult = await jobAdMethods.create({
            prisma,
            data: {
                ...jobAd,
                companyId: 1,
            },
            bypassAuth: true,
        })

        await prisma.article.update({
            where: {
                id: restult.articleId
            },
            data: {
                coverImage: {
                    update: {
                        image: {
                            connect: {
                                id: image.id
                            }
                        }
                    }
                }
            }
        })
    }
}
