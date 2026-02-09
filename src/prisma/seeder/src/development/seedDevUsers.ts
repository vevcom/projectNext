import { hashAndEncryptPassword } from '@/auth/passwordHash'
import { type SeederImage, seedImage } from '@/seeder/src/seedImages'
import { v4 as uuid } from 'uuid'
import { randomInt } from 'crypto'
import { readdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { PrismaClient } from '@/prisma-generated-pn-client'
import { OmegaMembershipLevel, type Prisma } from '@/prisma-generated-pn-types'

const fileName = fileURLToPath(import.meta.url)
const directoryName = dirname(fileName)
const profileImageFSLocation = join(directoryName, '..', '..', 'standard_store', 'images', 'dev_profile_images')

async function seedDevProfileImages(prisma: PrismaClient) {
    let files = await readdir(profileImageFSLocation)

    files = files.filter(file => {
        const filenameS = file.split('.')
        const ext = filenameS[filenameS.length - 1]
        return ext === 'jpg'
    })

    return await Promise.all(files.map(async file => {
        const fileS = file.split('.')

        const name = fileS[0]

        const imageConfig: SeederImage = {
            special: null,
            name,
            alt: `Bilde av ${name}`,
            credit: null,
            license: null,
            collection: 'PROFILEIMAGES',
            fsLocation: file,
        }

        return await seedImage(prisma, profileImageFSLocation, files, imageConfig)
    }))
}

export default async function seedDevUsers(prisma: PrismaClient) {
    const firstNames = [
        'Anne', 'Johan', 'Pål', 'Lars', 'Lasse', 'Leo', 'Noa',
        'Trude', 'Andreas', 'Nora', 'Knut', 'Anne', 'Sara',
        'Frikk', 'Merete', 'Klara', 'Britt Helen', 'Fiola',
        'Mika', 'Helle', 'Jesper',
    ]

    const profileImages = await seedDevProfileImages(prisma)

    const lastNames = profileImages.map(image => (image ? image.name.replaceAll('-', ' ') : 'Navnløs'))

    const passwordHash = await hashAndEncryptPassword('password')

    const latestOrder = await prisma.omegaOrder.findFirstOrThrow({
        orderBy: {
            order: 'desc',
        },
    })

    const memberGroup = await prisma.omegaMembershipGroup.findUniqueOrThrow({
        where: {
            omegaMembershipLevel: OmegaMembershipLevel.MEMBER
        }
    })

    const allStudyProgrammes = await prisma.studyProgramme.findMany()
    const allCommittees = await prisma.committee.findMany()
    const allClasses = await prisma.class.findMany()
    const allFlairs = await prisma.flair.findMany()

    Promise.all(firstNames.map(async (firstName, i) => {
        await Promise.all(lastNames.map(async (lastName, j) => {
            // Randomly remove profile images for 5% of users.
            const image = (Math.random() < 0.95) ? profileImages.find(img => (img?.name === lastName)) : undefined

            const username = `${firstName}${lastName}${i + 1}${j}`
                .toLowerCase()
                .replace(/å/g, 'aa') // special cases for norwegian letters
                .replace(/æ/g, 'ae')
                .replace(/ø/g, 'oe')
                .normalize('NFD') // decompose into letter + diacritics, i.e. 'é' -> 'e´'
                .replace(/[^a-zA-Z0-9]/g, '') // only keep ASCII alphanumeric characters

            const user = await prisma.user.upsert({
                where: {
                    username,
                },
                update: {

                },
                create: {
                    firstname: firstName,
                    lastname: lastName,
                    email: uuid(),
                    username,
                    studentCard: `${username}s studentkort`,
                    credentials: {
                        create: {
                            passwordHash,
                        },
                    },
                    acceptedTerms: new Date(),
                    ...(image ? {
                        image: {
                            connect: {
                                id: image.id,
                            },
                        },
                    } : {}),
                },
            })

            const memberships: Prisma.MembershipCreateManyInput[] = [
                {
                    groupId: memberGroup.groupId,
                    userId: user.id,
                    admin: false,
                    active: true,
                    order: latestOrder.order
                },
            ]

            const studyProgram = allStudyProgrammes[randomInt(allStudyProgrammes.length)]

            memberships.push({
                groupId: studyProgram.groupId,
                userId: user.id,
                admin: false,
                active: true,
                order: latestOrder.order
            })

            const classMember = allClasses[randomInt(allClasses.length)]
            memberships.push({
                groupId: classMember.groupId,
                userId: user.id,
                admin: false,
                active: true,
                order: latestOrder.order,
            })

            if (Math.random() > 0.8) {
                const committee = allCommittees[randomInt(allCommittees.length)]

                memberships.push({
                    groupId: committee.groupId,
                    userId: user.id,
                    admin: false,
                    active: true,
                    order: latestOrder.order
                })
            }

            await prisma.membership.createMany({
                data: memberships
            })

            if (Math.random() < 0.05) {
                const flair = allFlairs[randomInt(allFlairs.length)]

                await prisma.flair.update({
                    where: {
                        id: flair.id,
                    },
                    data: {
                        user: {
                            connect: {
                                id: user.id
                            }
                        }
                    }
                })
            }
        }))
    }))

    const harambeImage = await prisma.image.findFirst({
        where: {
            name: 'harambe'
        }
    })
    if (!harambeImage) {
        throw new Error('Harambe image not found')
    }

    const harambe = await prisma.user.upsert({
        where: {
            email: 'harambe@harambesen.io'
        },
        update: {

        },
        create: {
            firstname: 'Harambe',
            lastname: 'Harambesen',
            email: 'harambe@harambesen.io',
            mobile: '12345678',
            username: 'harambe',
            bio: 'Harambe did nothing wrong',
            studentCard: 'harambeCard',
            credentials: {
                create: {
                    passwordHash,
                },
            },
            image: {
                connect: {
                    id: harambeImage.id
                }
            },
            ledgerAccount: {
                create: {
                    type: 'USER',
                },
            },
            emailVerified: new Date(),
            acceptedTerms: new Date(),
        },
    })

    const studyProgrammeMTTK = await prisma.studyProgramme.findUniqueOrThrow({
        where: {
            code: 'MTTK',
        },
    })

    const harambecom = await prisma.committee.findUniqueOrThrow({
        where: {
            shortName: 'harcom'
        }
    })

    await prisma.membership.createMany({
        data: [
            {
                groupId: memberGroup.groupId,
                userId: harambe.id,
                admin: false,
                active: true,
                order: latestOrder.order
            },
            {
                groupId: studyProgrammeMTTK.groupId,
                userId: harambe.id,
                admin: false,
                active: true,
                order: latestOrder.order
            },
            {
                groupId: harambecom.groupId,
                userId: harambe.id,
                admin: false,
                active: true,
                order: latestOrder.order
            }
        ]
    })

    const vever = await prisma.user.upsert({
        where: {
            email: 'vever@vevcom.com'
        },
        update: {

        },
        create: {
            firstname: 'Vever',
            lastname: 'Vevsen',
            email: 'vever@vevcom.com',
            mobile: '98765432',
            username: 'vever',
            studentCard: 'vever',
            credentials: {
                create: {
                    passwordHash,
                },
            },
            ledgerAccount: {
                create: {
                    type: 'USER',
                },
            },
            emailVerified: new Date(),
            acceptedTerms: new Date(),
        },
    })

    await prisma.membership.createMany({
        data: [
            {
                groupId: memberGroup.groupId,
                userId: vever.id,
                admin: false,
                active: true,
                order: latestOrder.order
            },
            {
                groupId: studyProgrammeMTTK.groupId,
                userId: vever.id,
                admin: false,
                active: true,
                order: latestOrder.order
            },
        ]
    })

    console.log(harambe)
    console.log(vever)
}

