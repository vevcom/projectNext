'use server'
import ombulSchema from './schema'
import { readSpecialImageCollection } from '../images/collections/read'
import { createCmsImage } from '../cms/images/create'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import createFile from '@/store/createFile'
import { getUser } from '@/auth'
import { createOneImage } from '@/actions/images/create'
import type { ActionReturn } from '@/actions/Types'
import type { Ombul } from '@prisma/client'

/**
 * Create a new Ombul.
 * @param rawData includes a pdf file with the ombul issue optionaly year and issueNumber
 * @param CoverImageId is the id of the Image that will be used as the cover of the ombul
 */
export async function createOmbul(rawdata: FormData): Promise<ActionReturn<Ombul>> {
    //Auth route
    const { user, status } = await getUser({
        permissions: ['OMBUL_CREATE']
    })
    if (!user) {
        return {
            success: false,
            error: [{
                message: status
            }]
        }
    }

    const parse = ombulSchema.safeParse(Object.fromEntries(rawdata.entries()))
    if (!parse.success) {
        return {
            success: false,
            error: parse.error.issues
        }
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
            return errorHandler(error)
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
        return errorHandler(error)
    }
}
