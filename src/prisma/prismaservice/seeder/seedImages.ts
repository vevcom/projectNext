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

    const standardLocation = join(__dirname, 'standard_store', 'images')
    const storeLocation = join(__dirname, '..', 'store', 'images')

    const files = await readdir(standardLocation)
    await Promise.all(files.map(async (file) => {
        const ext = file.split('.')[1]
        if (!['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
            console.log(`skipping image ${file}`)
            return
        }
        const name = file.split('.')[0]

        const fsLocation = `${uuid()}.${ext}`
        await copyFile(
            join(standardLocation, file), 
            join(storeLocation, fsLocation)
        )

        //create small size version of the image
        const fsLocationSmallSize = `${uuid()}.${ext}`
        const bigPath = path.join(standardLocation, file);
        const smallPath = path.join(storeLocation, fsLocationSmallSize);
        await sharp(bigPath).resize(200, 200, {
            fit: sharp.fit.inside,
            withoutEnlargement: true
        }).toFile(smallPath);

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
