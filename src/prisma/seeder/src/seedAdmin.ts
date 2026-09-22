import { hashAndEncryptPassword } from '@/auth/passwordHash'
import { Permission } from '@/prisma-generated-pn-types'
import type { PrismaClient as PrismaClientPn } from '@/prisma-generated-pn-client'

/**
 * Seeds a single admin user with every permission, in its own ManualGroup, so there is
 * always a way to log in and debug a fresh environment - migrated/production users have
 * no password credentials (only Feide), which isn't reachable from every deployment.
 * Skipped unless SEED_ADMIN_USERNAME/EMAIL/PASSWORD are all set, so it stays opt-in per
 * environment rather than creating a guessable account on every deployment.
 */
export default async function seedAdmin(prisma: PrismaClientPn) {
    const username = process.env.SEED_ADMIN_USERNAME
    const email = process.env.SEED_ADMIN_EMAIL
    const password = process.env.SEED_ADMIN_PASSWORD

    if (!username || !email || !password) {
        console.log('SEED_ADMIN_USERNAME/EMAIL/PASSWORD not set, skipping admin seed')
        return
    }

    const latestOrder = await prisma.omegaOrder.findFirstOrThrow({
        orderBy: { order: 'desc' },
    })

    const existingGroup = await prisma.manualGroup.findUnique({
        where: { shortName: 'admin' },
    })

    const adminGroup = existingGroup ?? await prisma.group.create({
        data: {
            groupType: 'MANUAL_GROUP',
            order: latestOrder.order,
            manualGroup: {
                create: {
                    name: 'Admin',
                    shortName: 'admin',
                },
            },
            permissions: {
                create: Object.values(Permission).map(permission => ({ permission })),
            },
        },
        include: {
            manualGroup: true,
        },
    }).then(group => group.manualGroup)

    if (!adminGroup) {
        throw new Error('Failed to seed admin group')
    }

    const existingUser = await prisma.user.findUnique({
        where: { username },
        select: { id: true },
    })

    const user = existingUser ?? await prisma.user.create({
        data: {
            username,
            email,
            firstname: 'Admin',
            lastname: 'Admin',
            credentials: {
                create: {
                    passwordHash: await hashAndEncryptPassword(password),
                },
            },
            emailVerified: new Date(),
            acceptedTerms: new Date(),
        },
    })

    await prisma.membership.upsert({
        where: {
            userId_groupId_order: {
                userId: user.id,
                groupId: adminGroup.groupId,
                order: latestOrder.order,
            },
        },
        update: {},
        create: {
            userId: user.id,
            groupId: adminGroup.groupId,
            admin: true,
            active: true,
            order: latestOrder.order,
        },
    })

    console.log(`Seeded admin user "${username}"`)
}
