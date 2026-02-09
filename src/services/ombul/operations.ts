import '@pn-server-only'
import { ombulAuth } from './auth'
import { ombulSchemas } from './schemas'
import { defineOperation } from '@/services/serviceOperation'
import { cmsImageOperations } from '@/cms/images/operations'
import { ServerError } from '@/services/error'
import { destroyFile } from '@/services/store/destroyFile'
import { createFile } from '@/services/store/createFile'
import { readSpecialImageCollection } from '@/services/images/collections/read'
import { imageOperations } from '@/services/images/operations'
import { notificationOperations } from '@/services/notifications/operations'
import { z } from 'zod'

const read = defineOperation({
    authorizer: () => ombulAuth.read.dynamicFields({}),
    paramsSchema: z.union([
        z.object({
            id: z.number(),
            name: z.undefined().optional(),
            year: z.undefined().optional()
        }),
        z.object({
            id: z.undefined().optional(),
            name: z.string(),
            year: z.number()
        })
    ]),
    operation: ({ params, prisma }) =>
        prisma.ombul.findUniqueOrThrow({
            where: typeof params.id === 'number' ? {
                id: params.id
            } : {
                year_name: {
                    name: params.name,
                    year: params.year
                }
            },
            include: {
                coverImage: {
                    include: {
                        image: true
                    }
                }
            }
        })
})

const readAll = defineOperation({
    authorizer: () => ombulAuth.readAll.dynamicFields({}),
    operation: ({ prisma }) =>
        prisma.ombul.findMany({
            orderBy: [
                { year: 'desc' },
                { issueNumber: 'desc' },
            ],
            include: {
                coverImage: {
                    include: {
                        image: true
                    }
                }
            }
        })
})

const readLatest = defineOperation({
    authorizer: () => ombulAuth.readLatest.dynamicFields({}),
    operation: async ({ prisma }) => {
        const ombul = await prisma.ombul.findMany({
            orderBy: [
                { year: 'desc' },
                { issueNumber: 'desc' },
            ],
            take: 1,
        })
        return ombul[0]
    }
})

const updateCmsCoverImage = cmsImageOperations.update.implement({
    implementationParamsSchema: z.object({
        ombulId: z.number()
    }),
    authorizer: () => ombulAuth.updateCmsCoverImage.dynamicFields({}),
    ownershipCheck: async ({ params, implementationParams }) => {
        const ombul = await read({ params: { id: implementationParams.ombulId } })
        return ombul.coverImage.id === params.cmsImageId
    }
})

/**
 * A function to destroy an ombul, also deletes the file from the store, and the cmsImage on cascade
 * @param id - The id of the ombul to destroy
 * @returns
 */
const destroy = defineOperation({
    authorizer: () => ombulAuth.destroy.dynamicFields({}),
    paramsSchema: z.object({
        id: z.number()
    }),
    operation: async ({ params, prisma }) => {
        const ombul = await prisma.ombul.findUnique({
            where: {
                id: params.id
            },
            include: {
                coverImage: {
                    include: {
                        image: true
                    }
                }
            }
        })
        if (!ombul) throw new ServerError('NOT FOUND', 'Ombul ikke funnet.')

        await destroyFile('ombul', ombul.fsLocation)

        await prisma.ombul.delete({
            where: {
                id: params.id
            }
        })

        return ombul
    }
})

const create = defineOperation({
    authorizer: () => ombulAuth.create.dynamicFields({}),
    dataSchema: ombulSchemas.create,
    operation: async ({ data, prisma }) => {
        // Get the latest issue number if not provided
        const { ombulCoverImage, ombulFile, year, issueNumber: givenIssueNumber, ...restOfConf } = data

        let latestIssueNumber = 1
        if (!givenIssueNumber) {
            const ombul = await prisma.ombul.findFirst({
                where: {
                    year
                },
                orderBy: {
                    issueNumber: 'desc'
                }
            })
            if (ombul) {
                latestIssueNumber = ombul.issueNumber + 1
            }
        }
        const issueNumber = givenIssueNumber || latestIssueNumber

        //upload the file to the store volume
        const ret = await createFile(ombulFile, 'ombul', ['pdf'])
        const fsLocation = ret.fsLocation

        // create coverimage
        const ombulCoverCollection = await readSpecialImageCollection('OMBULCOVERS')
        const coverImage = await imageOperations.create({
            params: {
                collectionId: ombulCoverCollection.id,
            },
            data: {
                name: fsLocation,
                alt: `cover of ${restOfConf.name}`,
                file: ombulCoverImage,
            },
        })

        const cmsCoverImage = await cmsImageOperations.create({
            data: { imageId: coverImage.id },
            bypassAuth: true
        })

        const ombul = await prisma.ombul.create({
            data: {
                ...restOfConf,
                year,
                issueNumber,
                coverImage: {
                    connect: {
                        id: cmsCoverImage.id
                    }
                },
                fsLocation,
            }
        })

        notificationOperations.createSpecial({
            params: {
                special: 'NEW_OMBUL',
            },
            data: {
                title: 'Ny ombul',
                message: `Ny ombul er ute! ${ombul.name}`,
            },
            bypassAuth: true,
        })

        return ombul
    }
})

const update = defineOperation({
    authorizer: () => ombulAuth.update.dynamicFields({}),
    dataSchema: ombulSchemas.update,
    paramsSchema: z.object({
        id: z.number()
    }),
    operation: ({ data, prisma, params }) =>
        prisma.ombul.update({
            where: {
                id: params.id
            },
            data,
            include: {
                coverImage: {
                    include: {
                        image: true
                    }
                }
            }
        })
})

const updateFile = defineOperation({
    authorizer: () => ombulAuth.updateFile.dynamicFields({}),
    dataSchema: ombulSchemas.updateFile,
    paramsSchema: z.object({
        id: z.number()
    }),
    operation: async ({ data, prisma, params }) => {
        const ret = await createFile(data.ombulFile, 'ombul', ['pdf'])
        const fsLocation = ret.fsLocation

        const ombul = await prisma.ombul.findUnique({
            where: {
                id: params.id
            }
        })
        if (!ombul) throw new ServerError('NOT FOUND', 'Ombul ikke funnet')

        const oldFsLocation = ombul.fsLocation

        const ombulUpdated = await prisma.ombul.update({
            where: {
                id: params.id
            },
            data: {
                fsLocation
            },
            include: {
                coverImage: {
                    include: {
                        image: true
                    }
                }
            }
        })

        //delete the old file
        await destroyFile('ombul', oldFsLocation)

        return ombulUpdated
    }
})

export const ombulOperations = {
    read,
    readAll,
    readLatest,
    updateCmsCoverImage,
    destroy,
    create,
    update,
    updateFile
} as const
