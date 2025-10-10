import '@pn-server-only'
import { licenseSchemas } from './schemas'
import { licenseAuthers } from './authers'
import { ServerError } from '@/services/error'
import { serviceMethod } from '@/services/serviceMethod'
import { z } from 'zod'

export const licenseMethods = {
    create: serviceMethod({
        authorizer: () => licenseAuthers.create.dynamicFields({}),
        dataSchema: licenseSchemas.create,
        method: async ({ prisma, data }) => await prisma.license.create({
            data,
        }),
    }),
    readAll: serviceMethod({
        authorizer: () => licenseAuthers.destroy.dynamicFields({}),
        method: async ({ prisma }) => await prisma.license.findMany()
    }),
    destroy: serviceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        authorizer: () => licenseAuthers.destroy.dynamicFields({}),
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
    }),
    update: serviceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: licenseSchemas.update,
        authorizer: () => licenseAuthers.update.dynamicFields({}),
        method: async ({ prisma, params, data }) => {
            await prisma.license.update({
                where: {
                    id: params.id
                },
                data
            })
        }
    }),
}
