import type { PrismaClient as PrismaClientPn, SEX } from '@/generated/pn'
import type { PrismaClient as PrismaClientVeven, enum_Users_sex } from '@/generated/veven'
import type { Limits } from './migrationLimits'
import upsertOrderBasedOnDate from './upsertOrderBasedOnDate'
import { type IdMapper, vevenIdToPnId } from './IdMapper'

/**
 * This function migrates users from Veven to PN
 * @param pnPrisma - PrismaClientPn
 * @param vevenPrisma - PrismaClientVeven
 * @param limits - Limits - used to limit the number of users to migrate
 */
export default async function migrateUsers(
    pnPrisma: PrismaClientPn,
    vevenPrisma: PrismaClientVeven,
    limits: Limits,
    imageIdMap: IdMapper
) {
    const users = await vevenPrisma.users.findMany({
        take: limits.users ? limits.users : undefined,
    })
    const soelleGroup = await pnPrisma.omegaMembershipGroup.findUniqueOrThrow({
        where: {
            omegaMembershipLevel: 'SOELLE' //Avsky!
        },
        include: {
            group: true
        }
    })
    const memberGroup = await pnPrisma.omegaMembershipGroup.findUniqueOrThrow({
        where: {
            omegaMembershipLevel: 'MEMBER'
        },
        include: {
            group: true
        }
    })
    const { order: currentOrder } = await pnPrisma.omegaOrder.findFirstOrThrow({
        orderBy: {
            order: 'desc'
        }
    })

    const classes = await pnPrisma.class.findMany({
        include: {
            group: true
        }
    })

    const yearIdMap = classes.reduce((acc, cur) => {
        acc[cur.year] = cur.id
        return acc
    }, {} as Record<number, number>)

    Promise.all(users.map(async user => {
        const sexMap = {
            m: "MALE",
            f: "FEMALE",
            other: "OTHER",
        } satisfies Record<enum_Users_sex, SEX>
        const pnUser = await pnPrisma.user.create({
            data: {
                id: user.id,
                username: user.username,
                email: user.email ?? "dobbel@omega..no",
                firstname: user.firstname,
                lastname: user.lastname,
                bio: user.bio ?? "",
                acceptedTerms: undefined,
                sex: sexMap[user.sex],
                allergies: undefined,
                mobile: undefined,
                emailVerified: undefined,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                imageId: vevenIdToPnId(imageIdMap, user.ImageId),

            }
        })
        
        // Connect to correct membership group
        const membershipOrder = await pnPrisma.omegaOrder.upsert({
            where: { order: user.order },
            create: { order: user.order },
            update: { order: user.order },
        })

        const soelleOrder = await upsertOrderBasedOnDate(pnPrisma, user.createdAt)

        await pnPrisma.membership.create({
            data: {
                groupId: soelleGroup.id,
                userId: pnUser.id,
                active: user.soelle,
                admin: false,
                order: soelleOrder,
            }
        })

        if (!user.soelle) {
            await pnPrisma.membership.create({
                data: {
                    groupId: memberGroup.id,
                    userId: pnUser.id,
                    active: true,
                    admin: false,
                    order: membershipOrder.order,
                }
            })
        }
        
        // connect to correct class (year)
        if (user.yearOfStudy in [1, 2, 3, 4, 5]) {
            let year = user.yearOfStudy
            let order = currentOrder
            while (year > 0) {
                await pnPrisma.membership.create({
                    data: {
                        groupId: soelleGroup.id,
                        userId: pnUser.id,
                        active: false,
                        admin: false,
                        order: order,
                    }
                })
                year--
                order--
            }
        } else {
            if (user.yearOfStudy !== 6) {
                console.error(`${user.id} (vevvenId) had bad yearOfStudy`)
            }
        }
    }))
}