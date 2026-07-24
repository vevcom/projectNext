import { hashAndEncryptPassword } from '@/auth/passwordHash'
import { userOperations } from '@/services/users/operations'
import { standardStoreFiles } from '@/lib/standardStore/files'
import { defineSeedOperation } from '@/seeder/src/defineSeedOperation'
import { OmegaMembershipLevel, type Prisma } from '@/prisma-generated-pn-types'
import { v4 as uuid } from 'uuid'
import { randomInt } from 'crypto'
import type { PrismaClient } from '@/prisma-generated-pn-client'

export const seedDevUsers = defineSeedOperation(async (prisma: PrismaClient) => {
    const firstNames = [
        'Anne', 'Johan', 'Pål', 'Lars', 'Lasse', 'Leo', 'Noa',
        'Trude', 'Andreas', 'Nora', 'Knut', 'Anne', 'Sara',
        'Frikk', 'Merete', 'Klara', 'Britt Helen', 'Fiola',
        'Mika', 'Helle', 'Jesper',
    ]
    const devProfileImages = Object.entries(standardStoreFiles.devProfileImage)

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

    // Promise.all not possible here because db connection pool might be
    // overloaded from profile image uploads.
    for (let i = 0; i < firstNames.length; i++) {
        const firstName = firstNames[i]
        for (let j = 0; j < devProfileImages.length; j++) {
            const [lastName, devProfileImage] = devProfileImages[j]
            const username = `${firstName}${lastName}${i + 1}${j}`
                .toLowerCase()
                .replace(/å/g, 'aa') // special cases for norwegian letters
                .replace(/æ/g, 'ae')
                .replace(/ø/g, 'oe')
                .normalize('NFD') // decompose into letter + diacritics, i.e. 'é' -> 'e´'
                .replace(/[^a-zA-Z0-9]/g, '') // only keep ASCII alphanumeric characters

            const existingUser = await prisma.user.findUnique({
                where: { username },
                select: { id: true },
            })

            const user = existingUser ?? await prisma.user.create({
                data: {
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
                },
            })

            // Only uploaded the first time this dev user is created - re-seeding must not upload
            // (and immediately destroy) a fresh profile image on every run.
            if (!existingUser && Math.random() < 0.95) {
                await userOperations.updateProfileImage({
                    params: { username },
                    data: await devProfileImage.imageUploadData({
                        name: lastName,
                        alt: `Bilde av ${lastName}`,
                    }),
                })
            }

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
        }
    }

    const existingHarambe = await prisma.user.findUnique({
        where: { email: 'harambe@harambesen.io' },
        select: { id: true },
    })

    const harambe = existingHarambe ?? await prisma.user.create({
        data: {
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
            emailVerified: new Date(),
            acceptedTerms: new Date(),
        },
    })

    if (!existingHarambe) {
        await userOperations.updateProfileImage({
            params: { username: 'harambe' },
            data: await standardStoreFiles.harambe.imageUploadData({ name: 'Harambe', alt: 'Bilde av Harambe' }),
        })
    }

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

    const existingVever = await prisma.user.findUnique({
        where: { email: 'vever@vevcom.com' },
        select: { id: true },
    })

    const vever = existingVever ?? await prisma.user.create({
        data: {
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
})
