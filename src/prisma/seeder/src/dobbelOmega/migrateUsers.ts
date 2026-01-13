import upsertOrderBasedOnDate from './upsertOrderBasedOnDate'
import { type IdMapper, vevenIdToPnId } from './IdMapper'
import manifest from '@/seeder/src/logger'
import { Prisma, type PrismaClient as PrismaClientPn, type SEX } from '@prisma/client'
import type {
    Prisma as VevenPrisma,
    PrismaClient as PrismaClientVeven,
    enum_Users_sex as SEXVEVEN
} from '@/prisma-dobbel-omega/client'
import type { Limits } from './migrationLimits'

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

const sexMap = {
    // eslint-disable-next-line id-length
    m: 'MALE',
    // eslint-disable-next-line id-length
    f: 'FEMALE',
    other: 'OTHER',
} as const satisfies Record<SEXVEVEN, SEX>

type ExtendedMemberGroup = Prisma.OmegaMembershipGroupGetPayload<{
    include: {
        group: true,
    }
}>

const userIncluder = {
    StudyProgrammes: {
        select: {
            years: true,
        },
    },
    MoneySourceAccounts: {
        select: {
            NTNUCard: true,
        },
    },
} satisfies VevenPrisma.UsersInclude

type userExtended = VevenPrisma.UsersGetPayload<{
    include: typeof userIncluder
}>

export class UserMigrator {
    private userIdMap: Record<number, number> = {}
    private currentlyMigratingIds: Record<number, Promise<unknown>> = {}

    private pnPrisma: PrismaClientPn
    private vevenPrisma: PrismaClientVeven
    private imageIdMap: IdMapper


    private soelleGroup?: ExtendedMemberGroup
    private memberGroup?: ExtendedMemberGroup
    private classes: Prisma.ClassGetPayload<{
        include: {
            group: true
        }
    }>[] = []

    constructor(
        pnPrisma: PrismaClientPn,
        vevenPrisma: PrismaClientVeven,
        imageIdMap: IdMapper,
    ) {
        this.pnPrisma = pnPrisma
        this.vevenPrisma = vevenPrisma
        this.imageIdMap = imageIdMap
    }

    async initSpecialGroups() {
        this.soelleGroup = await this.pnPrisma.omegaMembershipGroup.findUniqueOrThrow({
            where: {
                omegaMembershipLevel: 'SOELLE' //Avsky!
            },
            include: {
                group: true
            }
        })
        this.memberGroup = await this.pnPrisma.omegaMembershipGroup.findUniqueOrThrow({
            where: {
                omegaMembershipLevel: 'MEMBER'
            },
            include: {
                group: true
            }
        })

        this.classes = await this.pnPrisma.class.findMany({
            include: {
                group: true
            }
        })
    }

    yearIdMap(x: number) {
        const year = this.classes.find(cls => cls.year === x)
        if (!year) {
            manifest.error(`Year ${x} not found - dobbelOmega failed :(`)
            throw new Error(`Year ${x} not found`)
        }
        return year.group.id
    }

    async migrateUsers(limits: Limits) {
        const users = await this.vevenPrisma.users.findMany({
            take: limits.users ? limits.users : undefined,
            select: {
                id: true,
            },
        })

        if (limits.users) {
            const extraUsers = await Promise.all([
                'theodokl104',
                'martiarm104',
                'johanhst103',
                'pauliusj103'
            ].map(async uname =>
                await this.vevenPrisma.users.findUnique({
                    where: {
                        username_order: {
                            username: uname.slice(0, -3),
                            order: Number(uname.slice(-3))
                        }
                    },
                    select: {
                        id: true,
                    }
                })
            ))

            extraUsers.forEach(user => {
                if (user) users.push(user)
            })
        }

        const userIds = users.map(user => user.id)
        return await this.migrateBulk(userIds)
    }

    async getPnUserId(vevenId: number) {
        if (!this.userIdMap[vevenId]) {
            await this.migrateUser(vevenId)
        }
        return this.userIdMap[vevenId]
    }

    async migrateUser(vevenId: number) {
        return await this.migrateBulk([vevenId])
    }

    private async createUser(user: userExtended) {
        let pnUser

        function collosionError(e: unknown) {
            if (!(e instanceof Prisma.PrismaClientKnownRequestError)) {
                throw e
            }

            if (e.code !== 'P2002') {
                throw e
            }

            const target = e.meta?.target as string[]
            const usernameCollision = target.includes('username')
            const emailCollision = target.includes('email')

            if (!usernameCollision && !emailCollision) {
                throw e
            }
            return [usernameCollision, emailCollision]
        }

        const userData = {
            username: user.username,
            email: user.email ?? `dobbel@omega.${user.id}.no`,
            firstname: user.firstname,
            lastname: user.lastname,
            bio: user.bio ?? '',
            acceptedTerms: undefined,
            sex: sexMap[user.sex],
            allergies: undefined,
            mobile: undefined,
            emailVerified: undefined,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            imageId: vevenIdToPnId(this.imageIdMap, user.ImageId),
            archived: user.archived,
        } satisfies Prisma.UserUncheckedCreateInput

        try {
            pnUser = await this.pnPrisma.user.create({
                data: userData
            })
        } catch (e) {
            const [usernameCollision, emailCollision] = collosionError(e)

            if (usernameCollision) {
                manifest.error(`User ${user.id} has a colliding username: ${user.username}. Generating new username.`)
                userData.username = `${user.username}${user.id}`
            }
            if (emailCollision) {
                manifest.error(`User ${user.id} has a colliding email: ${user.email}. Generating new email.`)
                userData.email = (user.email !== null) ? `dobbel@omega.${user.id}.no` : `dobbel2@omega.${user.id}.no`
            }

            pnUser = await this.pnPrisma.user.create({
                data: userData
            })
        }
        this.userIdMap[user.id] = pnUser.id

        // Try to add the studentCard, this can throw an unique contraint exception
        if (user.MoneySourceAccounts?.NTNUCard) {
            try {
                await this.pnPrisma.user.update({
                    where: {
                        id: pnUser.id
                    },
                    data: {
                        studentCard: user.MoneySourceAccounts?.NTNUCard
                    }
                })
            } catch (e) {
                console.error(
                    `Failed to conenct StudentCard to user. StudentCard: ${user.MoneySourceAccounts?.NTNUCard} `,
                    `User: ${pnUser} Error: ${e}`
                )
            }
        }

        return pnUser
    }

    async migrateBulk(vevenIds: number[]) {
        const vevenIdsToMigrate = vevenIds.filter(id => !this.userIdMap[id])
        const waitForParalell: Promise<unknown>[] = []
        const resolveWhenFinished: ((value: unknown) => void)[] = []
        for (let i = vevenIdsToMigrate.length - 1; i >= 0; i--) {
            const id = vevenIdsToMigrate[i]
            if (this.currentlyMigratingIds.hasOwnProperty(id)) {
                waitForParalell.push(this.currentlyMigratingIds[id])
                vevenIdsToMigrate.splice(i, 1)
            } else {
                this.currentlyMigratingIds[id] = new Promise((resolve) => {
                    resolveWhenFinished.push(resolve)
                })
            }
        }

        if (vevenIdsToMigrate.length === 0 && resolveWhenFinished.length === 0) {
            await Promise.all(waitForParalell)
            return
        }

        const users = await this.vevenPrisma.users.findMany({
            where: {
                id: {
                    in: vevenIdsToMigrate,
                }
            },
            include: userIncluder,
        })
        // manifest.info(`Migrating ${users.length} users`)

        await Promise.all(users.map(async user => {
            const pnUser = await this.createUser(user)

            // Connect to correct membership group
            const membershipOrder = await this.pnPrisma.omegaOrder.upsert({
                where: { order: user.order },
                create: { order: user.order },
                update: { order: user.order },
            })

            const soelleOrder = await upsertOrderBasedOnDate(this.pnPrisma, user.createdAt)

            if (!this.soelleGroup || !this.memberGroup) {
                throw new Error('Cannot use th UserMigrator, before it is initialized.')
            }

            await this.pnPrisma.membership.create({
                data: {
                    groupId: this.soelleGroup.groupId,
                    userId: pnUser.id,
                    active: user.soelle,
                    admin: false,
                    order: soelleOrder,
                }
            })

            if (!user.soelle) {
                await this.pnPrisma.membership.create({
                    data: {
                        groupId: this.memberGroup.groupId,
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
                    manifest.error(`User ${user.id} has no years in programme or no programme`)
                    break
                case 2:
                {
                    //ASSUME 2 years masters. The user can be member of 4 5 and 6 (siving)
                    let yearOfStudy2 = user.yearOfStudy
                    if (yearOfStudy2 < 4) {
                        manifest.error(
                            `User ${user.id} is in 2 year programme but has year of study less than 4 - setting to 4`
                        )
                        yearOfStudy2 = 4
                    }
                    if (yearOfStudy2 > 6) {
                        manifest.error(
                            `User ${user.id} is in 2 year programme but has year of study greater than 6 - setting to 6`
                        )
                        yearOfStudy2 = 6
                    }
                    if (yearOfStudy2 === 6) {
                        const orderBecameSiving = user.order + 2
                        await this.pnPrisma.membership.create({
                            data: {
                                groupId: this.yearIdMap(6),
                                userId: pnUser.id,
                                active: true,
                                admin: false,
                                order: orderBecameSiving,
                            }
                        })
                        await this.pnPrisma.membership.create({
                            data: {
                                groupId: this.yearIdMap(5),
                                userId: pnUser.id,
                                active: false,
                                admin: false,
                                order: orderBecameSiving - 1,
                            }
                        })
                        await this.pnPrisma.membership.create({
                            data: {
                                groupId: this.yearIdMap(4),
                                userId: pnUser.id,
                                active: false,
                                admin: false,
                                order: orderBecameSiving - 2,
                            }
                        })
                    } else if (yearOfStudy2 === 5) {
                        const orderBecame5 = user.order + 1
                        await this.pnPrisma.membership.create({
                            data: {
                                groupId: this.yearIdMap(5),
                                userId: pnUser.id,
                                active: true,
                                admin: false,
                                order: orderBecame5,
                            }
                        })
                        await this.pnPrisma.membership.create({
                            data: {
                                groupId: this.yearIdMap(4),
                                userId: pnUser.id,
                                active: false,
                                admin: false,
                                order: orderBecame5 - 1,
                            }
                        })
                    } else if (yearOfStudy2 === 4) {
                        await this.pnPrisma.membership.create({
                            data: {
                                groupId: this.yearIdMap(4),
                                userId: pnUser.id,
                                active: true,
                                admin: false,
                                order: user.order,
                            }
                        })
                    } else {
                        manifest.error(`User ${user.id} is in a 2 year programme but not in year 4, 5 or 6`)
                    }
                    break
                }
                case 3:
                {
                    //ASSUME 3 years bachelors. The user can be member of 1 2 and 3, and cannot be siving.
                    let yearOfStudy3 = user.yearOfStudy
                    if (yearOfStudy3 < 1) {
                        manifest.error(`User ${user.id} has year of study less than 1 - setting to 1`)
                        yearOfStudy3 = 1
                    }
                    if (yearOfStudy3 > 3) {
                        manifest.error(`User ${user.id} has year of study greater than 3 - setting to 3`)
                        yearOfStudy3 = 3
                    }
                    if (yearOfStudy3 === 1) {
                        await this.pnPrisma.membership.create({
                            data: {
                                groupId: this.yearIdMap(1),
                                userId: pnUser.id,
                                active: true,
                                admin: false,
                                order: user.order,
                            }
                        })
                    } else if (yearOfStudy3 === 2) {
                        await this.pnPrisma.membership.create({
                            data: {
                                groupId: this.yearIdMap(2),
                                userId: pnUser.id,
                                active: true,
                                admin: false,
                                order: user.order,
                            }
                        })
                        await this.pnPrisma.membership.create({
                            data: {
                                groupId: this.yearIdMap(1),
                                userId: pnUser.id,
                                active: false,
                                admin: false,
                                order: user.order - 1,
                            }
                        })
                    } else if (yearOfStudy3 === 3) {
                        // This is a nut - it is hard to say if the user still is in 3. grade.
                        // We will assume that the user is in 3. grade if the order is gte 103
                        await this.pnPrisma.membership.create({
                            data: {
                                groupId: this.yearIdMap(3),
                                userId: pnUser.id,
                                active: user.order >= 103,
                                admin: false,
                                order: user.order,
                            }
                        })
                        await this.pnPrisma.membership.create({
                            data: {
                                groupId: this.yearIdMap(2),
                                userId: pnUser.id,
                                active: false,
                                admin: false,
                                order: user.order - 1,
                            }
                        })
                        await this.pnPrisma.membership.create({
                            data: {
                                groupId: this.yearIdMap(1),
                                userId: pnUser.id,
                                active: false,
                                admin: false,
                                order: user.order - 2,
                            }
                        })
                    }
                    break
                }
                case 5:
                {
                    // Assuming 5 year masters. The user can be member of 1 2 3 4 5 and 6 (siving)
                    let yearOfStudy5 = user.yearOfStudy
                    if (yearOfStudy5 < 1) {
                        manifest.error(
                            `User ${user.id} is in 5 year programme but has year of study less than 1 - setting to 1`
                        )
                        yearOfStudy5 = 1
                    }
                    if (yearOfStudy5 > 6) {
                        manifest.error(
                            `User ${user.id} is in 5 year programme but has year of study greater than 6 - setting to 6`
                        )
                        yearOfStudy5 = 6
                    }
                    if (yearOfStudy5 === 6) {
                        const orderBecameSiving = user.order + 5 // Assume the user used 5 years to get to sivin
                        await this.pnPrisma.membership.create({
                            data: {
                                groupId: this.yearIdMap(6),
                                userId: pnUser.id,
                                active: true,
                                admin: false,
                                order: orderBecameSiving,
                            }
                        })
                        for (let i = 5; i >= 1; i--) {
                            await this.pnPrisma.membership.create({
                                data: {
                                    groupId: this.yearIdMap(i),
                                    userId: pnUser.id,
                                    active: false,
                                    admin: false,
                                    order: orderBecameSiving - (6 - i),
                                }
                            })
                        }
                    } else {
                        for (let year = 1; year <= yearOfStudy5; year++) {
                            await this.pnPrisma.membership.create({
                                data: {
                                    groupId: this.yearIdMap(year),
                                    userId: pnUser.id,
                                    active: year === yearOfStudy5,
                                    admin: false,
                                    order: user.order + year - 1,
                                }
                            })
                        }
                    }
                    break
                }
                default:
                    manifest.error(`User ${user.id} has ${yearsInProgramme} years in programme - dobbelOmega failed :(`)
            }
        }))

        resolveWhenFinished.forEach(resolve => resolve(undefined))
        await Promise.all(waitForParalell)
    }
}
