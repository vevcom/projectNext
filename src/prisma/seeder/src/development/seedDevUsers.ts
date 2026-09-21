import { hashAndEncryptPassword } from '@/auth/passwordHash'
import { userOperations } from '@/services/users/operations'
import { standardStoreFiles } from '@/lib/standardStore/files'
import { defineSeedOperation } from '@/seeder/src/defineSeedOperation'
import { OmegaMembershipLevel, type Prisma } from '@/prisma-generated-pn-types'
import { v4 as uuid } from 'uuid'
import { randomInt } from 'crypto'
import type { PrismaClient } from '@/prisma-generated-pn-client'
import logger from '@/lib/logger'

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

    const devUserSpecs = firstNames.flatMap((firstName, i) => devProfileImages.map(([lastName, devProfileImage], j) => ({
        firstName,
        lastName,
        devProfileImage,
        email: uuid(),
        username: `${firstName}${lastName}${i + 1}${j}`
            .toLowerCase()
            .replace(/å/g, 'aa') // special cases for norwegian letters
            .replace(/æ/g, 'ae')
            .replace(/ø/g, 'oe')
            .normalize('NFD') // decompose into letter + diacritics, i.e. 'é' -> 'e´'
            .replace(/[^a-zA-Z0-9]/g, ''), // only keep ASCII alphanumeric characters
    })))

    const existingUsers = await prisma.user.findMany({
        where: { username: { in: devUserSpecs.map(spec => spec.username) } },
        select: { id: true, username: true },
    })
    const existingUsernames = new Set(existingUsers.map(user => user.username))
    const newDevUserSpecs = devUserSpecs.filter(spec => !existingUsernames.has(spec.username))

    const createdUsers = await prisma.user.createManyAndReturn({
        data: newDevUserSpecs.map(spec => ({
            firstname: spec.firstName,
            lastname: spec.lastName,
            email: spec.email,
            username: spec.username,
            studentCard: `${spec.username}s studentkort`,
            acceptedTerms: new Date(),
        })),
        select: { id: true, username: true },
    })

    const userIdByUsername = new Map([
        ...existingUsers.map(user => [user.username, user.id] as const),
        ...createdUsers.map(user => [user.username, user.id] as const),
    ])

    await prisma.credentials.createMany({
        data: newDevUserSpecs.map(spec => ({
            userId: userIdByUsername.get(spec.username)!,
            username: spec.username,
            email: spec.email,
            passwordHash,
        })),
    })

    // Profile images can't be batched with createMany - each upload resizes to several
    // sizes, converts to avif and writes files to the store before any db write happens,
    // so this stays the slow part. Batched (rather than one big Promise.all) so the cpu
    // and db connection pool aren't overloaded from too many uploads running at once.
    // Only uploaded the first time this dev user is created - re-seeding must not upload
    // (and immediately destroy) a fresh profile image on every run.
    const profileImageJobs = newDevUserSpecs
        .filter(() => Math.random() < 0.25)
        .map(spec => async () => userOperations.updateProfileImage({
            params: { username: spec.username },
            data: await spec.devProfileImage.imageUploadData({
                name: spec.lastName,
                alt: `Bilde av ${spec.lastName}`,
            }),
        }))

    const imageUploadBatchSize = 8
    for (let i = 0; i < profileImageJobs.length; i += imageUploadBatchSize) {
        await Promise.all(profileImageJobs.slice(i, i + imageUploadBatchSize).map(job => job()))
    }

    const memberships: Prisma.MembershipCreateManyInput[] = devUserSpecs.flatMap(spec => {
        const userId = userIdByUsername.get(spec.username)!

        const specMemberships: Prisma.MembershipCreateManyInput[] = [
            {
                groupId: memberGroup.groupId,
                userId,
                admin: false,
                active: true,
                order: latestOrder.order
            },
            {
                groupId: allStudyProgrammes[randomInt(allStudyProgrammes.length)].groupId,
                userId,
                admin: false,
                active: true,
                order: latestOrder.order
            },
            {
                groupId: allClasses[randomInt(allClasses.length)].groupId,
                userId,
                admin: false,
                active: true,
                order: latestOrder.order,
            },
        ]

        if (Math.random() > 0.8) {
            specMemberships.push({
                groupId: allCommittees[randomInt(allCommittees.length)].groupId,
                userId,
                admin: false,
                active: true,
                order: latestOrder.order
            })
        }

        return specMemberships
    })

    await prisma.membership.createMany({
        data: memberships,
        skipDuplicates: true,
    })

    await Promise.all(devUserSpecs
        .filter(() => Math.random() < 0.05)
        .map(spec => prisma.flair.update({
            where: {
                id: allFlairs[randomInt(allFlairs.length)].id,
            },
            data: {
                user: {
                    connect: {
                        id: userIdByUsername.get(spec.username)!
                    }
                }
            }
        })))

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
            ledgerAccount: {
                create: {
                    type: 'USER',
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
})
