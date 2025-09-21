import '@pn-server-only'
import { LicenseSchemas } from './schemas'
import { LicenseAuthers } from './authers'
import { ServerError } from '@/services/error'
import { serviceMethod } from '@/services/serviceMethod'
import { z } from 'zod'

export namespace LicenseMethods {
    export const create = serviceMethod({
        authorizer: () => LicenseAuthers.create.dynamicFields({}),
        dataSchema: LicenseSchemas.create,
        method: async ({ prisma, data }) => await prisma.license.create({
            data,
        }),
    })
    export const readAll = serviceMethod({
        authorizer: () => LicenseAuthers.destroy.dynamicFields({}),
        method: async ({ prisma }) => await prisma.license.findMany()
    })
    export const destroy = serviceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        authorizer: () => LicenseAuthers.destroy.dynamicFields({}),
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
    export const update = serviceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: LicenseSchemas.update,
        authorizer: () => LicenseAuthers.update.dynamicFields({}),
        method: async ({ prisma, params, data }) => {
            await prisma.license.update({
                where: {
                    id: params.id
                },
                data
            })
        }
    })
}
