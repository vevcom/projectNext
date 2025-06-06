import type { PrismaClient } from '@prisma/client'

export default async function seedDevImages(prisma: PrismaClient) {
    for (let i = 0; i < 10; i++) {
        await prisma.imageCollection.upsert({
            where: {
                name: `test_collection_${i}`
            },
            update: {

            },
            create: {
                name: `test_collection_${i}`,
                description: 'just a test',
                visibility: {
                    create: {
                        purpose: 'IMAGE',
                        published: true,
                        regularLevel: { create: {} },
                        adminLevel: { create: {} },
                    }
                }
            }
        })
    }
}
