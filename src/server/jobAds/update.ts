import 'server-only'
import { updateJobAdValidation } from './validation'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { SimpleJobAd } from './Types'
import type { UpdateJobAdTypes } from './validation'

export async function updateJobAd(
    id: number,
    rawdata: UpdateJobAdTypes['Detailed']
): Promise<Omit<SimpleJobAd, 'coverImage'>> {
    const data = updateJobAdValidation.detailedValidate(rawdata)
    return await prismaCall(() => prisma.jobAd.update({
        where: { id },
        data,
    }))
}
