import '@pn-server-only'
import { specialCollectionsSpecialVisibilityMap } from './ConfigVars'
import prisma from '@/prisma'
import logger from '@/lib/logger'
import { prismaCall } from '@/services/prismaCall'
import { ServerError } from '@/services/error'
import { readSpecialVisibility } from '@/services/visibility/read'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { ImageMethods } from '@/services/images/methods'
import type { SpecialCollection, ImageCollection, Image } from '@prisma/client'
import type {
    ExpandedImageCollection,
    ImageCollectionCursor,
    ImageCollectionPageReturn
} from '@/services/images/collections/Types'
import type { VisibilityFilter } from '@/auth/getVisibilityFilter'
import type { ReadPageInput } from '@/lib/paging/Types'


/**
 * Reads an image collection by id or name
 * @param idOrName - the id or name of the image collection
 * @returns the image collection in actionrturn
 */
export async function readImageCollection(
    idOrName: number | string
): Promise<ExpandedImageCollection> {
    const collection = await prismaCall(() => prisma.imageCollection.findUnique({
        where: typeof idOrName === 'number' ? {
            id: idOrName,
        } : {
            name: idOrName,
        },
        include: {
            coverImage: true,
        }
    }))
    if (!collection) throw new ServerError('NOT FOUND', 'Collection not found')
    return collection
}

/**
 * returns a page of image collections, orders by createdAt (and then name)
 * @param page - the page to read of the Page type
 * @returns - A page of image collections
 */
export async function readImageCollectionsPage<const PageSize extends number>(
    { page }: ReadPageInput<PageSize, ImageCollectionCursor>,
    visibilityFilter: VisibilityFilter
): Promise<ImageCollectionPageReturn[]> {
    const collections = await prismaCall(() => prisma.imageCollection.findMany({
        where: visibilityFilter,
        include: {
            coverImage: true,
            images: {
                take: 1
            },
            _count: {
                select: {
                    images: true
                }
            }
        },
        orderBy: [
            { createdAt: 'desc' },
            { name: 'asc' }
        ],
        ...cursorPageingSelection(page)
    }))

    const lensCamera = await ImageMethods.readSpecial.client(prisma).execute({
        params: {
            special: 'DEFAULT_IMAGE_COLLECTION_COVER'
        },
        session: null //TODO: pass session
    })

    const chooseCoverImage = (collection: {
        coverImage: Image | null,
        images: Image[]
    }) => {
        if (collection.coverImage) return collection.coverImage
        if (collection.images[0]) return collection.images[0]
        if (lensCamera) return lensCamera
        return null
    }
    const returnData = collections.map(collection => ({
        ...collection,
        coverImage: chooseCoverImage(collection),
        numberOfImages: collection._count.images,
    }))

    return returnData
}

export async function readSpecialImageCollection(special: SpecialCollection): Promise<ImageCollection> {
    const collection = await prismaCall(() => prisma.imageCollection.findUnique({
        where: {
            special
        }
    }))
    if (!collection) {
        logger.warn(`Special collection ${special} did not exist, creating it`)
        const permissionLevels = specialCollectionsSpecialVisibilityMap[special]
        const visability = await readSpecialVisibility(permissionLevels.specialVisibility)

        const newCollection = await prismaCall(() => prisma.imageCollection.create({
            data: {
                name: special,
                special,
                visibility: {
                    connect: {
                        id: visability.id
                    }
                }
            }
        }))
        return newCollection
    }
    return collection
}
