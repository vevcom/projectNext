'use server'
import { createOmbulSchema } from './schema'
import { createActionError, createPrismaActionError, createZodActionError } from '@/actions/error'
import { readSpecialImageCollection } from '@/images/collections/read'
import { createCmsImage } from '@/cms/images/create'
import prisma from '@/prisma'
import createFile from '@/server/store/createFile'
import { createOneImage } from '@/actions/images/create'
import { getUser } from '@/auth/user'
import type { ActionReturn } from '@/actions/Types'
import type { Ombul } from '@prisma/client'
import type { CreateOmbulSchemaType } from './schema'

/**
 * Create a new Ombul.
 * @param rawData includes a pdf file with the ombul issue optionaly year and issueNumber
 * @param CoverImageId is the id of the Image that will be used as the cover of the ombul
 */
export async function createOmbul(rawdata: FormData | CreateOmbulSchemaType): Promise<ActionReturn<Ombul>> {
    //Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: ['OMBUL_CREATE']
    })
    if (!authorized) {
        return createActionError(status)
    }

    const parse = createOmbulSchema.safeParse(rawdata)
    if (!parse.success) {
        return createZodActionError(parse)
    }
    const data = parse.data

    const year = data.year || new Date().getFullYear()

    // Get the latest issue number if not provided
    let latestIssueNumber = 1
    if (!data.issueNumber) {
        try {
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
        } catch (error) {
            return createPrismaActionError(error)
        }
    }
    const issueNumber = data.issueNumber || latestIssueNumber

    const name = data.name
    const description = data.description

    //upload the file to the store volume
    const ret = await createFile(data.ombulFile, 'ombul', ['pdf'])
    if (!ret.success) return ret
    const fsLocation = ret.data.fsLocation

    // create coverimage
    const ombulCoverCollectionRes = await readSpecialImageCollection('OMBULCOVERS')
    if (!ombulCoverCollectionRes.success) return ombulCoverCollectionRes
    const ombulCoverCollection = ombulCoverCollectionRes.data
    const coverImageRes = await createOneImage(data.ombulCoverImage, {
        name: fsLocation,
        alt: `cover of ${name}`,
        collectionId: ombulCoverCollection.id
    })
    if (!coverImageRes.success) return coverImageRes
    const coverImage = coverImageRes.data

    const cmsCoverImageRes = await createCmsImage(fsLocation, coverImage)
    if (!cmsCoverImageRes.success) return cmsCoverImageRes
    const cmsCoverImage = cmsCoverImageRes.data

    try {
        const ombul = await prisma.ombul.create({
            data: {
                description,
                year,
                issueNumber,
                name,
                coverImage: {
                    connect: {
                        id: cmsCoverImage.id
                    }
                },
                fsLocation,
            }
        })
        return {
            success: true,
            data: ombul
        }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
