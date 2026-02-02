import type { FlairCreateInput } from '@/prisma-generated-pn/models'
import type { PrismaClient } from '@/prisma-generated-pn-client'

const flairConfig: {
    imageName: string,
    data: Omit<FlairCreateInput, 'cmsImage'>
}[] = [
    {
        imageName: 'kappemann_paske',
        data: {
            name: 'Påskekappe',
            rank: 1,
            colorR: 255,
            colorG: 255,
            colorB: 153,
        }
    },
    {
        imageName: 'kappemann_diamant',
        data: {
            name: 'Diamantkappe',
            rank: 2,
            colorR: 0,
            colorG: 204,
            colorB: 255,
        }
    },
    {
        imageName: 'kappemann_gull',
        data: {
            name: 'Gullkappe',
            rank: 3,
            colorR: 255,
            colorG: 215,
            colorB: 0,
        }
    },
    {
        imageName: 'kappemann_solv',
        data: {
            name: 'Solvkappe',
            rank: 4,
            colorR: 217,
            colorG: 217,
            colorB: 217,
        }
    },
    {
        imageName: 'kappemann_bronse',
        data: {
            name: 'Bronsekappe',
            rank: 5,
            colorR: 255,
            colorG: 153,
            colorB: 0,
        }
    },
]

export default async function seedFlairs(prisma: PrismaClient) {
    await Promise.all(flairConfig.map(async config => {
        const image = await prisma.image.findFirstOrThrow({
            where: {
                name: config.imageName
            }
        })

        await prisma.flair.create({
            data: {
                ...config.data,
                cmsImage: {
                    create: {
                        image: {
                            connect: {
                                id: image.id
                            }
                        }
                    }
                }
            }
        })
    }))
}
