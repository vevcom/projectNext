import 'server-only'
import { createSourceless } from './create'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { ServerError } from '@/services/error'
import { SpecialImage } from '@prisma/client'
import type { ReadPageInput } from '@/lib/paging/Types'
import type { ImageDetails, ImageCursor } from '@/services/images/Types'

/**
 * Reads a page of images in a collection by collectionId.
 */
export const readPage = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: {
        paging: ReadPageInput<number, ImageCursor, ImageDetails>
    }) => {
        const { collectionId } = params.paging.details
        return await prisma.image.findMany({
            where: {
                collectionId,
            },
            ...cursorPageingSelection(params.paging.page)
        })
    }
})

/**
 * Reads an image by id.
 */
export const read = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, { id }: { id: number }) => {
        const image = await prisma.image.findUnique({
            where: {
                id,
            },
        })

        if (!image) throw new ServerError('NOT FOUND', 'Image not found')
        return image
    }
})

/**
 * Reads a special image by name (special atr.).
 * In the case that the special image does not exist (bad state) a "bad" image will be created.
 */
export const readSpecial = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, { special }: { special: SpecialImage }, session) => {
        if (!Object.values(SpecialImage).includes(special)) {
            throw new ServerError('BAD PARAMETERS', 'Bildet er ikke spesielt')
        }

        const image = await prisma.image.findUnique({
            where: {
                special,
            },
        })

        if (!image) {
            return await createSourceless.client(prisma).execute(
                { params: { name: special, special }, session }
            )
        }
        return image
    }
})

