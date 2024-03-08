import { v4 as uuid } from 'uuid'
import sharp from 'sharp'
import { readdir, copyFile } from 'fs/promises'
import path, { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { PrismaClient } from '@/generated/pn'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const imageSizes = {
    small: 250,
    medium: 600,
}

const standardLocation = join(__dirname, '..', 'standard_store', 'images')
export const imageStoreLocation = join(__dirname, '..', 'store', 'images')

/**
 * This functions seeds all images in standard_store/images,
 * both the ones that are special and the ones that are not.
 * All are seeded to the special collection 'STANDARDIMAGES'
 * @param pisama - the prisma client
 */
export default async function seedImages(prisma: PrismaClient) {
    const standardCollection = await prisma.imageCollection.findUnique({
        where: {
            special: 'STANDARDIMAGES',
        }
    })
    if (!standardCollection) {
        throw new Error('Standard collection not found')
    }

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
            join(imageStoreLocation, fsLocation)
        )

        const bigPath = path.join(standardLocation, file)

        //create small size version of the image
        const fsLocationSmallSize = `${uuid()}.${ext}`
        const smallPath = path.join(imageStoreLocation, fsLocationSmallSize)
        await sharp(bigPath).resize(imageSizes.small, imageSizes.small, {
            fit: sharp.fit.inside,
            withoutEnlargement: true
        }).toFile(smallPath)

        //create medium size version of the image
        const fsLocationMediumSize = `${uuid()}.${ext}`
        const mediumPath = path.join(imageStoreLocation, fsLocationMediumSize)
        await sharp(bigPath).resize(imageSizes.medium, imageSizes.medium, {
            fit: sharp.fit.inside,
            withoutEnlargement: true
        }).toFile(mediumPath)

        await prisma.image.upsert({
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
    }))
}
