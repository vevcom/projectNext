import 'server-only'
import { createPrismaActionError } from '@/actions/error'
import { readSpecialImageCollection } from '@/server/images/collections/read'
import { createCmsImage } from '@/server/cms/images/create'
import prisma from '@/prisma'
import { createFile } from '@/server/store/createFile'
import { createImage } from '@/server/images/create'
import type { ActionReturn } from '@/actions/Types'
import type { Ombul } from '@prisma/client'
import type { OmbulCreateConfig } from './Types'

/**
 * Create a new Ombul.
 */
export async function createOmbul(
    file: File,
    cover: File,
    config: OmbulCreateConfig,
): Promise<ActionReturn<Ombul>> {
    // Get the latest issue number if not provided
    const { year: givenYear, issueNumber: givenIssueNumber, ...restOfConf } = config

    const year = givenYear || new Date().getFullYear()

    let latestIssueNumber = 1
    if (!givenIssueNumber) {
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
    const issueNumber = givenIssueNumber || latestIssueNumber

    //upload the file to the store volume
    const ret = await createFile(file, 'ombul', ['pdf'])
    if (!ret.success) return ret
    const fsLocation = ret.data.fsLocation

    // create coverimage
    const ombulCoverCollectionRes = await readSpecialImageCollection('OMBULCOVERS')
    if (!ombulCoverCollectionRes.success) return ombulCoverCollectionRes
    const ombulCoverCollection = ombulCoverCollectionRes.data
    const coverImageRes = await createImage(cover, {
        name: fsLocation,
        alt: `cover of ${config.name}`,
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
        return {
            success: true,
            data: ombul
        }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
