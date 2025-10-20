import '@pn-server-only'
import { createOmbulValidation } from './validation'
import { prismaCall } from '@/services/prismaCall'
import { readSpecialImageCollection } from '@/services/images/collections/read'
import { cmsImageOperations } from '@/cms/images/operations'
import { prisma } from '@/prisma/client'
import { createFile } from '@/services/store/createFile'
import { imageOperations } from '@/services/images/operations'
import { notificationOperations } from '@/services/notifications/operations'
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
    const coverImage = await imageOperations.create({
        params: {
            collectionId: ombulCoverCollection.id,
        },
        data: {
            name: fsLocation,
            alt: `cover of ${config.name}`,
            file: cover,
        },
    })

    const cmsCoverImage = await cmsImageOperations.create({
        data: { imageId: coverImage.id },
    })

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
