import standardCmsContents from './standardCmsContents'
import type { PrismaClient } from '@prisma/client'

export default async function seedCms(prisma: PrismaClient) {
    standardCmsContents.cmsImages.forEach(async (image) => {
        prisma.cmsImage.upsert({
            where: {
                name: image.name
            },
            update: {

            },
            create: {
                name: image.name,
                image: {
                    connect: {
                        name: image.image.connect.name
                    }
                }
            }
        })
    })
}
