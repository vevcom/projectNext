import { v4 as uuid } from 'uuid'
import { readdir, copyFile } from 'fs/promises'
import { join } from 'path'
import type { PrismaClient } from '@prisma/client'

export default async function seedImages(prisma: PrismaClient) {
    const standardCollection = await prisma.imageCollection.upsert({
        where: {
            name: 'standard_images'
        },
        update: {

        },
        create: {
            name: 'standard_images',
            description: 'standard images for the website',
        }
    })

    const files = await readdir(join(__dirname, 'standard_store', 'images'))
    await Promise.all(files.map(async (file) => {
        const ext = file.split('.')[1]
        if (!['jpg', 'jpeg', 'png', 'gif', 'heic'].includes(ext)) {
            console.log(`skipping image ${file}`)
            return
        }
        const name = file.split('.')[0]
        const image = await prisma.image.upsert({
            where: {
                name
            },
            update: {},
            create: {
                name,
                alt: name.split('_').join(' '),
                fsLocation: `${uuid()}.${ext}`,
                ext,
                collection: {
                    connect: {
                        id: standardCollection.id
                    }
                }
            }
        })

        //copy the file from standard_store images to the image store/images with new name to add it to store volume.
        await copyFile(join(__dirname, 'standard_store', 'images', file), join(__dirname, '..', 'store', 'images', image.fsLocation))

        console.log(image)
        return image
    }))
}
