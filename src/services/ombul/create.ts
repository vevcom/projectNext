import '@pn-server-only'
import { createOmbulValidation } from './validation'
import { prismaCall } from '@/services/prismaCall'
import { readSpecialImageCollection } from '@/services/images/collections/read'
import { createCmsImage } from '@/services/cms/images/create'
import prisma from '@/prisma'
import { createFile } from '@/services/store/createFile'
import { ImageMethods } from '@/services/images/methods'
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

    const coverImage = await ImageMethods.create.client(prisma).execute({
        params: {
            collectionId: ombulCoverCollection.id,
        },
        data: {
            name: fsLocation,
            alt: `cover of ${config.name}`,
            file: cover,
        },
        session: null
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
