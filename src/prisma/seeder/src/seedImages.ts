import {
    seedImageConfig, seedSpecialImageConfig, seedLicenseConfig
} from './seedImagesConfig'
import { v4 as uuid } from 'uuid'
import sharp from 'sharp'
import { readdir, copyFile, mkdir } from 'fs/promises'
import path, { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { ImageSeedConfigBase } from './seedImagesConfig'
import type { Image, PrismaClient } from '@prisma/client'

const fileName = fileURLToPath(import.meta.url)
const directoryName = dirname(fileName)

export const imageSizes = {
    small: 180,
    medium: 450,
    large: 700,
}

const standardLocation = join(directoryName, '..', 'standard_store', 'images')
export const imageStoreLocation = join(directoryName, '..', '..', '..', '..', 'store', 'images')

export type SeederImage = ImageSeedConfigBase & Pick<Image, 'special'>

export async function seedImage(
    prisma: PrismaClient,
    fileLocation: string,
    files: string[],
    image: SeederImage
): Promise<Image | null> {
    const file = files.find(file_ => file_ === image.fsLocation)
    if (!file) throw new Error(`File ${image.fsLocation} not found in standard_store/images`)

    const ext = file.split('.')[1]
    if (!['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
        console.log(`skipping image ${file}`)
        return null
    }

    const bigPath = path.join(fileLocation, file)

    //full size version of the image
    const fsLocationOriginal = `${uuid()}.${ext}`
    await copyFile(
        bigPath,
        join(imageStoreLocation, fsLocationOriginal)
    )

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

    return await prisma.image.create({
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
            },
        }
    })
}

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

    await mkdir(imageStoreLocation, { recursive: true })

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
        await seedImage(prisma, standardLocation, files, image)
    }))
}

/**
 * A function to transform an object to an array
 * @param obj - the object to transform
 * @param fn - the function to transform the object with
 * @returns
 */
export function transformObject<KeyType extends string | number | symbol, ValueType, ReturnType>(
    obj: Record<KeyType, ValueType>, fn: (value: ValueType, key: KeyType) => ReturnType
): ReturnType[] {
    return Object.entries(obj).map(([key, value]) => fn(value as ValueType, key as KeyType))
}
