import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { ServerError } from '@/services/error'

export const destroy = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: { id: number }) => {
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
