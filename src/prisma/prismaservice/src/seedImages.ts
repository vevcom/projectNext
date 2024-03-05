import { v4 as uuid } from 'uuid'
import sharp from 'sharp'
import { readdir, copyFile } from 'fs/promises'
import path, { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { PrismaClient } from '@/generated/pn'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default async function seedImages(prisma: PrismaClient) {
    const standardCollection = await prisma.imageCollection.findUnique({
        where: {
            special: 'STANDARDIMAGES',
        }
    })
    if (!standardCollection) {
        throw new Error('Standard collection not found')
    }
    const standardLocation = join(__dirname, '..', 'standard_store', 'images')
    const storeLocation = join(__dirname, '..', 'store', 'images')

    const files = await readdir(standardLocation)
    await Promise.all(files.map(async (file) => {
        const ext = file.split('.')[1]
        if (!['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
            console.log(`skipping image ${file}`)
            return
        }
        const name = file.split('.')[0]

        //full size version of the image
        const fsLocation = `${uuid()}.${ext}`
        await copyFile(
            join(standardLocation, file),
            join(storeLocation, fsLocation)
        )

        const bigPath = path.join(standardLocation, file)

        //create small size version of the image
        const fsLocationSmallSize = `${uuid()}.${ext}`
        const smallPath = path.join(storeLocation, fsLocationSmallSize)
        await sharp(bigPath).resize(250, 250, {
            fit: sharp.fit.inside,
            withoutEnlargement: true
        }).toFile(smallPath)

        //create medium size version of the image
        const fsLocationMediumSize = `${uuid()}.${ext}`
        const mediumPath = path.join(storeLocation, fsLocationMediumSize)
        await sharp(bigPath).resize(600, 600, {
            fit: sharp.fit.inside,
            withoutEnlargement: true
        }).toFile(mediumPath)

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
                fsLocationMediumSize,
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
