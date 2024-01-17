import standardCmsContents from "./standardCmsContents"
import prisma from '..'

export default async function seedCms() {
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