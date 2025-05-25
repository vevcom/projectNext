import '@pn-server-only'
import { LicenseSchemas } from './schemas'
import { LicenseAuthers } from './authers'
import { ServerError } from '@/services/error'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'

export namespace LicenseMethods {
    export const create = ServiceMethod({
        auther: () => LicenseAuthers.create.dynamicFields({}),
        dataSchema: LicenseSchemas.create,
        method: async ({ prisma, data }) => await prisma.license.create({
            data,
        }),
    })
    export const readAll = ServiceMethod({
        auther: () => LicenseAuthers.destroy.dynamicFields({}),
        method: async ({ prisma }) => await prisma.license.findMany()
    })
    export const destroy = ServiceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        auther: () => LicenseAuthers.destroy.dynamicFields({}),
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
    export const update = ServiceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: LicenseSchemas.update,
        auther: () => LicenseAuthers.update.dynamicFields({}),
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
