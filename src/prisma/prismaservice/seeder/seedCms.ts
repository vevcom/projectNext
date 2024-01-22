import standardCmsContents from './standardCmsContents'
import type { PrismaClient } from '@prisma/client'

export default async function seedCms(prisma: PrismaClient) {
    await Promise.all(standardCmsContents.cmsImages.map(async (cmsimage) => {
        const image = await prisma.image.findUnique({
            where: {
                name: cmsimage.imageName
            }
        })
        if (!image) {
            throw new Error(`Tried to cennect CmsImage ${cmsimage.name} to 
            ${cmsimage.imageName}, but not the image was not found`)
        }

        return prisma.cmsImage.upsert({
            where: {
                name: cmsimage.name
            },
            update: {
                name: cmsimage.name,
            },
            create: {
                name: cmsimage.name,
                imageSize: cmsimage.imageSize || 'MEDIUM',
                image: {
                    connect: {
                        id: image.id
                    }
                }
            }
        })
    }))
}
