import '@pn-server-only'
import { licenseSchemas } from './schemas'
import { licenseAuth } from './auth'
import { ServerError } from '@/services/error'
import { defineOperation } from '@/services/serviceOperation'
import { z } from 'zod'

export const licenseOperations = {
    create: defineOperation({
        authorizer: () => licenseAuth.create.dynamicFields({}),
        dataSchema: licenseSchemas.create,
        operation: async ({ prisma, data }) => await prisma.license.create({
            data,
        }),
    }),
    readAll: defineOperation({
        authorizer: () => licenseAuth.destroy.dynamicFields({}),
        operation: async ({ prisma }) => await prisma.license.findMany()
    }),
    destroy: defineOperation({
        paramsSchema: z.object({
            id: z.number(),
        }),
        authorizer: () => licenseAuth.destroy.dynamicFields({}),
        operation: async ({ prisma, params }) => {
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
    update: defineOperation({
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: licenseSchemas.update,
        authorizer: () => licenseAuth.update.dynamicFields({}),
        operation: async ({ prisma, params, data }) => {
            await prisma.license.update({
                where: {
                    id: params.id
                },
                data
            })
        }
    }),
}
