import 'server-only'
import { createSourcelessImage } from './create'
import { readImageAuther, readImagePageAuther, readSpecialImageAuther } from './authers'
import { ServiceMethod } from '@/services/ServiceMethod'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { ServerError } from '@/services/error'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { SpecialImage } from '@prisma/client'
import { z } from 'zod'

/**
 * Reads a page of images in a collection by collectionId.
 */
export const readImagePage = ServiceMethod({
    auther: () => readImagePageAuther.dynamicFields({}),
    paramsSchema: readPageInputSchemaObject(
        z.number(),
        z.object({
            id: z.number(),
        }),
        z.object({
            collectionId: z.number(),
        }),
    ),
    method: async ({ prisma, params }) => {
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
export const readImage = ServiceMethod({
    auther: () => readImageAuther.dynamicFields({}),
    paramsSchema: z.object({
        id: z.number(),
    }),
    method: async ({ prisma, params: { id } }) => {
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
export const readSpecialImage = ServiceMethod({
    auther: () => readSpecialImageAuther.dynamicFields({}),
    paramsSchema: z.object({
        special: z.nativeEnum(SpecialImage)
    }),
    method: async ({ prisma, params: { special }, session }) => {
        const image = await prisma.image.findUnique({
            where: {
                special,
            },
        })

        if (!image) {
            return await createSourcelessImage.client(prisma).execute(
                { params: { name: special, special }, session }
            )
        }
        return image
    }
})

