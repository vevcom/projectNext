import type { PrismaClient } from '@/generated/pn'

export default async function seedDevSchools(prisma: PrismaClient) {
    await Promise.all([0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(async i => {
        await prisma.school.create({
            data: {
                name: `Skole ${i}`,
                shortname: `sk${i}`,
                cmsImage: {
                    create: {
                        name: `Skole ${i} bilde`
                    }
                },
                cmsParagraph: {
                    create: {
                        name: `Skole ${i} paragraf`
                    }
                },
                cmsLink: {
                    create: {
                        name: `Skole ${i} link`
                    }
                },
            }
        })
    }))
}