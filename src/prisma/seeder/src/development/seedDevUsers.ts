import { hashAndEncryptPassword } from '@/auth/password'
import { v4 as uuid } from 'uuid'
import { Membership, OmegaMembershipLevel, Prisma, type PrismaClient } from '@prisma/client'
import { randomInt } from 'crypto'

export default async function seedDevUsers(prisma: PrismaClient) {
    const fn = [
        'anne', 'johan', 'pål', 'lars', 'lasse', 'leo', 'noa',
        'trude', 'andreas', 'nora', 'knut', 'anne', 'sara', 'frikk', 'merete', 'klara',
        'britt helen', 'fiola', 'mika', 'helle', 'jesper'
    ]

    const ln = [
        'hansen', 'johansen', 'olsen', 'larsen', 'larsen', 'leosdatter',
        'noasdatter', 'trudesdatter', 'lien', 'svendsen',
        'mattisen', 'mørk', 'ruud', 'hansen', 'johansen', 'olsen',
        'larsen', 'larsen', 'leosdatter', 'noasdatter', 'trudesdatter',
        'lien', 'svendsen', 'mattisen', 'mørk', 'ruud', 'hansen', 'johansen', 'olsen', 'larsen',
        'larsen', 'leosdatter', 'noasdatter', 'trudesdatter', 'lien',
        'svendsen', 'mattisen', 'mørk', 'ruud', 'hansen', 'johansen', 'olsen', 'larsen', 'larsen',
        // 'leosdatter', 'noasdatter', 'trudesdatter', 'lien', 'svendsen', 'mattisen',
        // 'mørk', 'ruud', 'hansen', 'johansen', 'olsen', 'larsen', 'larsen', 'leosdatter',
        // 'noasdatter', 'trudesdatter', 'lien', 'svendsen', 'mattisen', 'mørk',
        // 'ruud', 'hansen', 'johansen', 'olsen', 'larsen', 'larsen', 'leosdatter',
        // 'noasdatter', 'trudesdatter', 'lien', 'svendsen', 'mattisen', 'mørk', 'ruud', 'hansen', 'johansen',
        // 'olsen', 'larsen', 'larsen', 'leosdatter', 'noasdatter', 'trudesdatter',
        // 'lien', 'svendsen', 'mattisen', 'mørk', 'ruud', 'hansen', 'johansen', 'olsen', 'larsen', 'larsen', 'leosdatter',
        // 'noasdatter', 'trudesdatter', 'lien', 'svendsen', 'mattisen', 'mørk', 'ruud',
        // 'hansen', 'johansen', 'olsen', 'larsen', 'larsen', 'leosdatter',
        // 'noasdatter', 'trudesdatter', 'lien', 'svendsen', 'mattisen', 'mørk', 'ruud'
    ]

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

    Promise.all(fn.map(async (firstName, i) => {
        await Promise.all(ln.map(async (lastName, j) => {
            const user = await prisma.user.upsert({
                where: {
                    username: `${firstName}${i}${j}`
                },
                update: {

                },
                create: {
                    firstname: firstName,
                    lastname: lastName,
                    email: uuid(),
                    username: `${firstName}${i}${j}`,
                    studentCard: `${firstName}-${i}-${j}`,
                    credentials: {
                        create: {
                            passwordHash,
                        },
                    },
                    acceptedTerms: new Date(),
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

            if (Math.random() > 0.9) {
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
                    passwordHash: 'password',
                },
            },
            emailVerified: new Date(),
            acceptedTerms: new Date(),
        },
    })
    console.log(harambe)
    console.log(vever)
}

