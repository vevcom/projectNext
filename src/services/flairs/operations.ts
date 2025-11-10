import '@pn-server-only'
import { flairAuth } from './auth.ts'
import { defineOperation } from '@/services/serviceOperation'
import { ServerError } from '@/services/error'
import { createImageAction, readImageAction } from '@/services/images/actions'
import { z } from 'zod'
import type { Prisma } from '@prisma/client'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { File } from 'node:buffer'

export const flairOperations = {
    create: defineOperation({
        authorizer: () => flairAuth.edit.dynamicFields({}),
        dataSchema: z.object(
            {
                file: z.instanceof(File),
                flairName: z.string()
            }
        ),
        operation: async ({ prisma, data }) => {
            const flairImageCollection = await prisma.imageCollection.upsert({
                where: { special: 'FLAIRIMAGES' },
                update: {},
                create: {
                    name: 'FLAIRIMAGES',
                    special: 'FLAIRIMAGES',
                    visibility: {
                        connect: {
                            specialPurpose: 'FLAIR',
                        }
                    }
                }
            })
            const image = unwrapActionReturn(await createImageAction(
                { params: { collectionId: flairImageCollection.id } },
                {
                    data: {
                        file: data.file,
                        alt: data.flairName,
                        name: data.flairName,
                    }
                }
            ))
            return await prisma.flair.create({
                data: {
                    Image: {
                        connect: { id: image.id }
                    },
                    name: data.flairName,
                }
            })
        }
    }),
    read: defineOperation({
        authorizer: () => flairAuth.read.dynamicFields({}),
        paramsSchema: z.object({
            flairId: z.number(),
        }),
        operation: async ({ prisma, params: { flairId } }) => {
            const flair = await prisma.flair.findUnique({
                where: {
                    id: flairId,
                }
            })
            if (!flair) throw new ServerError('NOT FOUND', 'Flair not found')
            return unwrapActionReturn(await readImageAction({ params: { id: flair.imageId } }))
        }
    }),
    destroy: defineOperation({
        authorizer: () => flairAuth.edit.dynamicFields({}),
        paramsSchema: z.object({
            flairId: z.number(),
        }),
        operation: async ({ prisma, params: { flairId } }) => {
            const flair = await prisma.flair.delete({
                where: {
                    id: flairId,
                }
            })
            await prisma.image.delete({
                where: {
                    id: flair.imageId,
                }
            })
        }
    })
}
