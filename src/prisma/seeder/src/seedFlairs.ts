import {
    standardStoreFiles,
    type StandardStoreFile
} from '@/lib/standardStore/files'
import type { FlairCreateInput } from '@/prisma-generated-pn/models'
import type { PrismaClient } from '@/prisma-generated-pn-client'

const flairConfig: {
    imageName: StandardStoreFile,
    data: Omit<FlairCreateInput, 'cmsImage'>
}[] = [
    {
        imageName: standardStoreFiles.kappemannPaske,
        data: {
            name: 'Påskekappe',
            rank: 1,
            colorR: 255,
            colorG: 255,
            colorB: 153,
        }
    },
    {
        imageName: standardStoreFiles.kappemannDiamant,
        data: {
            name: 'Diamantkappe',
            rank: 2,
            colorR: 0,
            colorG: 204,
            colorB: 255,
        }
    },
    {
        imageName: standardStoreFiles.kappemannGull,
        data: {
            name: 'Gullkappe',
            rank: 3,
            colorR: 255,
            colorG: 215,
            colorB: 0,
        }
    },
    {
        imageName: standardStoreFiles.kappemannSolv,
        data: {
            name: 'Solvkappe',
            rank: 4,
            colorR: 217,
            colorG: 217,
            colorB: 217,
        }
    },
    {
        imageName: standardStoreFiles.kappemannBronse,
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
