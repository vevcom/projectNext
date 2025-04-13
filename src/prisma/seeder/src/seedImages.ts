import { seedImageConfig, seedSpecialImageConfig, seedLicenseConfig } from './seedImagesConfig'
import { v4 as uuid } from 'uuid'
import sharp from 'sharp'
import { readdir, copyFile } from 'fs/promises'
import path, { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { PrismaClient } from '@prisma/client'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const imageSizes = {
    small: 180,
    medium: 450,
    large: 700,
}

const standardLocation = join(__dirname, '..', 'standard_store', 'images')
export const imageStoreLocation = join('usr', 'src', 'app', 'store', 'images')

/**
 * This functions seeds all images in standard_store/images,
 * both the ones that are special and the ones that are not.
 * All are seeded to the special collection 'STANDARDIMAGES'
 * @param pisama - the prisma client
 */
export default async function seedImages(prisma: PrismaClient) {
    // Seed all licenses
    await prisma.license.createMany({
        data: seedLicenseConfig
    })

    const files = await readdir(standardLocation)

    //Get the to bjects to a common format
    const seedSpecialImagesTransformed = transformObject(seedSpecialImageConfig, (value, key) => ({
        ...value,
        special: key
    }))
    const seedImagesTransformed = seedImageConfig.map((value) => ({
        ...value,
        special: null
    }))
    const allImages = [...seedSpecialImagesTransformed, ...seedImagesTransformed]

    //Seed all images
    await Promise.all(allImages.map(async (image) => {
        const file = files.find(file_ => file_ === image.fsLocation)
        if (!file) throw new Error(`File ${image.fsLocation} not found in standard_store/images`)

        const ext = file.split('.')[1]
        if (!['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
            console.log(`skipping image ${file}`)
            return
        }

        //full size version of the image
        const fsLocationOriginal = `${uuid()}.${ext}`
        await copyFile(
            join(standardLocation, file),
            join(imageStoreLocation, fsLocationOriginal)
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

        // Create Large size version of the image
        const fsLocationLargeSize = `${uuid()}.${ext}`
        const largePath = path.join(imageStoreLocation, fsLocationLargeSize)
        await sharp(bigPath).resize(imageSizes.large, imageSizes.large, {
            fit: sharp.fit.inside,
            withoutEnlargement: true
        }).toFile(largePath)

        //Delete all images with image.name
        await prisma.image.deleteMany({
            where: {
                name: image.name
            }
        })

        await prisma.image.create({
            data: {
                name: image.name,
                alt: image.alt,
                credit: image.credit,
                license: image.license ? {
                    connect: {
                        name: image.license
                    }
                } : undefined,
                fsLocationOriginal,
                fsLocationSmallSize,
                fsLocationMediumSize,
                fsLocationLargeSize,
                extOriginal: ext,
                special: image.special,
                collection: {
                    connect: {
                        name: image.collection
                    }
                }
            }
        })
    }))
}

/**
 * A function to transform an object to an array
 * @param obj - the object to transform
 * @param fn - the function to transform the object with
 * @returns
 */
export function transformObject<K extends string | number | symbol, T, U>(
    obj: Record<K, T>, fn: (value: T, key: K) => U
): U[] {
    return Object.entries(obj).map(([key, value]) => fn(value as T, key as K))
}
