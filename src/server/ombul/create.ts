import 'server-only'
import { readSpecialImageCollection } from '@/server/images/collections/read'
import { createCmsImage } from '@/server/cms/images/create'
import prisma from '@/prisma'
import { createFile } from '@/server/store/createFile'
import { createImage } from '@/server/images/create'
import type { Ombul } from '@prisma/client'
import type { OmbulCreateConfig } from './Types'
import { prismaCall } from '../prismaCall'

/**
 * Create a new Ombul.
 */
export async function createOmbul(
    file: File,
    cover: File,
    config: OmbulCreateConfig,
): Promise<Ombul> {
    // Get the latest issue number if not provided
    const { year: givenYear, issueNumber: givenIssueNumber, ...restOfConf } = config

    const year = givenYear || new Date().getFullYear()

    let latestIssueNumber = 1
    if (!givenIssueNumber) {
        const ombul = await prismaCall(() => prisma.ombul.findFirst({
            where: {
                year
            },
            orderBy: {
                issueNumber: 'desc'
            }
        }))
        if (ombul) {
            latestIssueNumber = ombul.issueNumber + 1
        }
    }
    const issueNumber = givenIssueNumber || latestIssueNumber

    //upload the file to the store volume
    const ret = await createFile(file, 'ombul', ['pdf'])
    const fsLocation = ret.fsLocation

    // create coverimage
    const ombulCoverCollection = await readSpecialImageCollection('OMBULCOVERS')

    const coverImage = await createImage(cover, {
        name: fsLocation,
        alt: `cover of ${config.name}`,
        collectionId: ombulCoverCollection.id
    })

    const cmsCoverImage = await createCmsImage(fsLocation, {}, coverImage)

    const ombul = await prismaCall(() => prisma.ombul.create({
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
    }))
    return ombul
}
