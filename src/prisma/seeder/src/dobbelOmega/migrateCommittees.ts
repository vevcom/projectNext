import type { PrismaClient as PrismaClientPn } from '@prisma/client'
import type { PrismaClient as PrismaClientVeven } from '@/prisma-dobbel-omega/client'
import type { UserMigrator } from './migrateUsers'

export default async function migrateCommittees(
    pnPrisma: PrismaClientPn,
    vevenPrisma: PrismaClientVeven,
    userMigrator: UserMigrator,
) {
    const committees = await vevenPrisma.committees.findMany({
        include: {
            CommitteeMembers: true,
            CommitteeMembersHist: true,
        }
    })

    await Promise.all(committees.map(async committee => {
        const newCommittee = await pnPrisma.committee.create({
            data: {
                name: committee.name,
                shortName: committee.shortname,
                videoLink: committee.applicationVideo,
                logoImage: {
                    create: {
                        name: `Logo for ${committee.name}`
                    }
                },
                paragraph: {
                    create: {}
                },
                applicationParagraph: {
                    create: {
                        contentMd: committee.applicationText || undefined,
                    }
                },
                committeeArticle: {
                    create: {
                        name: committee.name,
                        coverImage: {
                            create: {
                                name: `${committee.shortname}'s bilde`
                            }
                        }
                    }
                },
                group: {
                    create: {
                        groupType: 'COMMITTEE',
                        order: 104,
                    },
                }
            }
        })

        await Promise.all(committee.CommitteeMembers.map(async member => {
            if (member.UserId === null) {
                console.warn(`${committee.shortname} has a member that is not connected to a user!`)
                console.warn(member)
                return
            }
            const pnUserId = await userMigrator.getPnUserId(member.UserId)
            await pnPrisma.membership.create({
                data: {
                    groupId: newCommittee.groupId,
                    userId: pnUserId,
                    active: true,
                    admin: member.admin,
                    order: 104,
                }
            })
        }))
    }))
}
