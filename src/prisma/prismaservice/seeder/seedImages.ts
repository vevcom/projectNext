import { v4 as uuid } from 'uuid'
import { readdir, copyFile } from 'fs/promises'
import { join } from 'path'
import type { PrismaClient } from '@prisma/client'
import sharp from 'sharp'
import path from 'path'

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
        if (!['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
            console.log(`skipping image ${file}`)
            return
        }
        const name = file.split('.')[0]

        const fsLocation = `${uuid()}.${ext}`
        await copyFile(join(__dirname, 'standard_store', 'images', file), join(__dirname, '..', 'store', 'images', fsLocation))

        //create small size version of the image
        const fsLocationSmallSize = `${uuid()}.${ext}`
        const inputPath = path.join(join(__dirname, 'standard_store', 'images'), file);
        const outputPath = path.join(join(__dirname, 'standard_store', 'images'), fsLocationSmallSize);
        await sharp(inputPath).resize(200, 200).toFile(outputPath);

        const image = await prisma.image.upsert({
            where: {
                name
            },
            update: {},
            create: {
                name,
                alt: name.split('_').join(' '),
                fsLocation,
                fsLocationSmallSize,
                ext,
                collection: {
                    connect: {
                        id: standardCollection.id
                    }
                }
            }
        })
        console.log(image)
    }))
}
