import 'server-only'
import { destroyLicenseAuther } from './authers'
import { ServerError } from '@/services/error'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'

export const destroyLicense = ServiceMethod({
    paramsSchema: z.object({
        id: z.number(),
    }),
    auther: () => destroyLicenseAuther.dynamicFields({}),
    method: async ({ prisma, params }) => {
        const { name: licenseName } = await prisma.license.findUniqueOrThrow({
            where: { id: params.id },
            select: { name: true }
        })

        const imagesOfLicense = await prisma.image.findMany({
            where: {
                licenseName
            },
            take: 1
        })
        if (imagesOfLicense.length > 0) {
            throw new ServerError(
                'UNPERMITTED CASCADE',
                'Lisensen har bilder tilknyttet - slett bildene først eller endre lisensen på bildene'
            )
        }

        await prisma.license.delete({ where: { id: params.id } })
    }
})
