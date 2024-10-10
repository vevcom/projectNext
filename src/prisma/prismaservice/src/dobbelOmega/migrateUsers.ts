import type { PrismaClient as PrismaClientPn, SEX } from '@/generated/pn'
import type { PrismaClient as PrismaClientVeven, enum_Users_sex } from '@/generated/veven'
import type { Limits } from './migrationLimits'
import upsertOrderBasedOnDate from './upsertOrderBasedOnDate'
import { type IdMapper, vevenIdToPnId } from './IdMapper'
import logger from '@/src/logger'

function makeEmailUnique<X extends { email: string | null, id: number }>(
    users: X[]
) : (X & { email: string })[] {
    return users.map(user => {
        let email = user.email ?? `dobbel@omega.${user.id}.no`
        if (!user.email) {
            logger.error(`User ${user.id} has no email`)
        } else {
            // Find users with same email if the email in null it is not a duplicate
            const duplicates = users.filter(u => u.email === user.email)
            if (duplicates.length > 1) {
                logger.error(`User ${user.id} has duplicate email ${user.email}`)
                email = `dobbel@omega.${user.id}.no`
            }
        }
        return { ...user, email }
    })
}

function makeUsernameUnique<X extends { username: string, id: number }>(
    users: X[]
) : (X & { username: string })[] {
    return users.map(user => {
        let username = user.username
        // Find users with same email if the email in null it is not a duplicate
        const duplicates = users.filter(u => u.username === user.username)
        if (duplicates.length > 1) {
            logger.error(`User ${user.id} has duplicate username ${user.username}`)
            username = username + user.id
        }
        return { ...user, username }
    })
}

/**
 * TODO: Need migrate reservations (mail reservations) ?, and flairs 
 * This function migrates users from Veven to PN. It only migrates to theUser model, not FeideAccounts
 * or Credentials. These should be linked when people log in for the first time.
 * If a user has the soelle field true on veven it will get a relation to the soelle group 
 * - else it is assumed to be a member and an inactive relation to the soelle group. 
 * i.e. no users are assumed to be external.
 * @param pnPrisma - PrismaClientPn
 * @param vevenPrisma - PrismaClientVeven
 * @param limits - Limits - used to limit the number of users to migrate
 */
export default async function migrateUsers(
    pnPrisma: PrismaClientPn,
    vevenPrisma: PrismaClientVeven,
    limits: Limits,
    imageIdMap: IdMapper
): Promise<IdMapper> {
    const users_ = await vevenPrisma.users.findMany({
        take: limits.users ? limits.users : undefined,
        include: {
            StudyProgrammes: {
                select: {
                    years: true
                }
            }
        }
    })
    const users = makeUsernameUnique(makeEmailUnique(users_))

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

    const classes = await pnPrisma.class.findMany({
        include: {
            group: true
        }
    })

    const yearIdMap = classes.reduce((acc, cur) => {
        acc[cur.year] = cur.id
        return acc
    }, {} as Record<number, number>)

    const userIdMap: IdMapper = []
    await Promise.all(users.map(async user => {
        const sexMap = {
            m: "MALE",
            f: "FEMALE",
            other: "OTHER",
        } satisfies Record<enum_Users_sex, SEX>
        const pnUser = await pnPrisma.user.create({
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
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
                archived: user.archived,
            }
        })

        userIdMap.push({ vevenId: user.id, pnId: pnUser.id })
        
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
        const yearsInProgramme = Math.min(user.StudyProgrammes?.years ?? 0, 5)
        switch (yearsInProgramme) {
        case 0:
            logger.error(`User ${user.id} has no years in programme or no programme`)
            break
        case 2:
            //ASSUME 2 years masters. The user can be member of 4 5 and 6 (siving)
            let yearOfStudy2 = user.yearOfStudy
            if (yearOfStudy2 < 4) {
                logger.error(`User ${user.id} is in 2 year programme but has year of study less than 4 - setting to 4`)
                yearOfStudy2 = 4
            }
            if (yearOfStudy2 > 6) {
                logger.error(`User ${user.id} is in 2 year programme but has year of study greater than 6 - setting to 6`)
                yearOfStudy2 = 6
            }
            if (yearOfStudy2 === 6) {
                const orderBecameSiving = user.order + 2
                await pnPrisma.membership.create({
                    data: {
                        groupId: yearIdMap[6],
                        userId: pnUser.id,
                        active: true,
                        admin: false,
                        order: orderBecameSiving,
                    }
                })
                await pnPrisma.membership.create({
                    data: {
                        groupId: yearIdMap[5],
                        userId: pnUser.id,
                        active: false,
                        admin: false,
                        order: orderBecameSiving - 1,
                    }
                })
                await pnPrisma.membership.create({
                    data: {
                        groupId: yearIdMap[4],
                        userId: pnUser.id,
                        active: false,
                        admin: false,
                        order: orderBecameSiving - 2,
                    }
                })
            } else if (yearOfStudy2 == 5) {
                const orderBecame5 = user.order + 1
                await pnPrisma.membership.create({
                    data: {
                        groupId: yearIdMap[5],
                        userId: pnUser.id,
                        active: true,
                        admin: false,
                        order: orderBecame5,
                    }
                })
                await pnPrisma.membership.create({
                    data: {
                        groupId: yearIdMap[4],
                        userId: pnUser.id,
                        active: false,
                        admin: false,
                        order: orderBecame5 - 1,
                    }
                })
            } else if (yearOfStudy2 == 4) {
                await pnPrisma.membership.create({
                    data: {
                        groupId: yearIdMap[4],
                        userId: pnUser.id,
                        active: true,
                        admin: false,
                        order: user.order,
                    }
                })
            } else {
                logger.error(`User ${user.id} is in a 2 year programme but not in year 4, 5 or 6`)
            }
            break
        case 3:
            //ASSUME 3 years bachelors. The user can be member of 1 2 and 3, and cannot be siving.
            let yearOfStudy3 = user.yearOfStudy
            if (yearOfStudy3 < 1) {
                logger.error(`User ${user.id} has year of study less than 1 - setting to 1`)
                yearOfStudy3 = 1
            }
            if (yearOfStudy3 > 3) {
                logger.error(`User ${user.id} has year of study greater than 3 - setting to 3`)
                yearOfStudy3 = 3
            }
            if (yearOfStudy3 === 1) {
                await pnPrisma.membership.create({
                    data: {
                        groupId: yearIdMap[1],
                        userId: pnUser.id,
                        active: true,
                        admin: false,
                        order: user.order,
                    }
                })
            } else if (yearOfStudy3 === 2) {
                await pnPrisma.membership.create({
                    data: {
                        groupId: yearIdMap[2],
                        userId: pnUser.id,
                        active: true,
                        admin: false,
                        order: user.order,
                    }
                })
                await pnPrisma.membership.create({
                    data: {
                        groupId: yearIdMap[1],
                        userId: pnUser.id,
                        active: false,
                        admin: false,
                        order: user.order - 1,
                    }
                })
            } else if (yearOfStudy3 === 3) {
                // This is a nut - it is hard to say if the user still is in 3. grade.
                // We will assume that the user is in 3. grade if the order is gte 103
                await pnPrisma.membership.create({
                    data: {
                        groupId: yearIdMap[3],
                        userId: pnUser.id,
                        active: user.order >= 103,
                        admin: false,
                        order: user.order,
                    }
                })
                await pnPrisma.membership.create({
                    data: {
                        groupId: yearIdMap[2],
                        userId: pnUser.id,
                        active: false,
                        admin: false,
                        order: user.order - 1,
                    }
                })
                await pnPrisma.membership.create({
                    data: {
                        groupId: yearIdMap[1],
                        userId: pnUser.id,
                        active: false,
                        admin: false,
                        order: user.order - 2,
                    }
                })
            }
            break
        case 5:
            // Assuming 5 year masters. The user can be member of 1 2 3 4 5 and 6 (siving)
            let yearOfStudy5 = user.yearOfStudy
            if (yearOfStudy5 < 1) {
                logger.error(`User ${user.id} is in 5 year programme but has year of study less than 1 - setting to 1`)
                yearOfStudy5 = 1
            }
            if (yearOfStudy5 > 6) {
                logger.error(`User ${user.id} is in 5 year programme but has year of study greater than 6 - setting to 6`)
                yearOfStudy5 = 6
            }
            if (yearOfStudy5 === 6) {
                const orderBecameSiving = user.order + 5 // Assume the user used 5 years to get to sivin
                await pnPrisma.membership.create({
                    data: {
                        groupId: yearIdMap[6],
                        userId: pnUser.id,
                        active: true,
                        admin: false,
                        order: orderBecameSiving,
                    }
                })
                for (let i = 5; i >= 1; i--) {
                    await pnPrisma.membership.create({
                        data: {
                            groupId: yearIdMap[i],
                            userId: pnUser.id,
                            active: false,
                            admin: false,
                            order: orderBecameSiving - i,
                        }
                    })
                }
            } else {
                for (let year=1; year <= yearOfStudy5; year++) {
                    await pnPrisma.membership.create({
                        data: {
                            groupId: yearIdMap[year],
                            userId: pnUser.id,
                            active: year === user.yearOfStudy,
                            admin: false,
                            order: user.order + year - 1,
                        }
                    })
                }
            }
        }
    }))
    return userIdMap
}