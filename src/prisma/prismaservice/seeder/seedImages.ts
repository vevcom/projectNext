import { v4 as uuid } from 'uuid'
import fs from 'fs'
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
    fs.readdir(join(__dirname, 'standard_images'), (err, files) => {
        if (err) throw err
        files.forEach(async (file) => {
            const ext = file.split('.')[1]
            if (!['jpg', 'jpeg', 'png', 'gif', 'heic'].includes(ext)) return console.log(`skipping image ${file}`)
            const name = file.split('.')[0]
            const image = await prisma.image.upsert({
                where: {
                    name
                },
                update: {

                },
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
            console.log(image)
            return image
        })
    })
}
