import 'server-only'
import { createOmbulValidation } from './validation'
import { prismaCall } from '@/server/prismaCall'
import { readSpecialImageCollection } from '@/server/images/collections/read'
import { createCmsImage } from '@/server/cms/images/create'
import prisma from '@/prisma'
import { createFile } from '@/server/store/createFile'
import { createImage } from '@/server/images/create'
import type { CreateOmbulTypes } from './validation'
import type { Ombul } from '@prisma/client'

/**
 * Create a new Ombul.
 */
export async function createOmbul(
    rawdata: CreateOmbulTypes['Detailed']
): Promise<Ombul> {
    const { ombulFile: file, ombulCoverImage: cover, ...config } = createOmbulValidation.detailedValidate(rawdata)
    // Get the latest issue number if not provided
    const { year, issueNumber: givenIssueNumber, ...restOfConf } = config

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

    const coverImage = await createImage({
        name: fsLocation,
        alt: `cover of ${config.name}`,
        collectionId: ombulCoverCollection.id,
        file: cover,
    })

    const cmsCoverImage = await createCmsImage({ name: fsLocation }, coverImage)

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
