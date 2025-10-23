import { convertMdToHtml } from '@/seeder/src/seedCms'
import { readFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import type { Prisma, PrismaClient as PrismaClientPn } from '@prisma/client'
import type { PrismaClient as PrismaClientVeven } from '@/prisma-dobbel-omega/client'
import type { UserMigrator } from './migrateUsers'

const fileName = fileURLToPath(import.meta.url)
const directoryName = dirname(fileName)

async function readCommitteParagraph(filename: string): Promise<Prisma.CmsParagraphCreateInput> {
    const filepath = join(directoryName, '..', '..', 'cms_paragraphs', 'committees', filename)
    try {
        const content = await readFile(filepath, 'utf-8')

        return {
            contentMd: content,
            contentHtml: await convertMdToHtml(content),
        }
    } catch {
        return {}
    }
}

async function readCommitteArticle(filename: string): Promise<{ create: Prisma.ArticleSectionCreateInput } | undefined> {
    const paragraph = await readCommitteParagraph(filename)
    if (paragraph.contentMd) {
        return {
            create: {
                cmsParagraph: {
                    create: paragraph,
                },
            },
        }
    }
    return undefined
}

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

    // const latestOrder = (await pnPrisma.omegaOrder.findFirstOrThrow({
    //     orderBy: {
    //         order: 'desc',
    //     },
    //     select: {
    //         order: true,
    //     }
    // })).order

    await Promise.all(committees.map(async committee => {
        const committeeParagraph = await readCommitteParagraph(`${committee.shortName}_p.md`)
        const committeArticle = await readCommitteArticle(`${committee.shortName}_a.md`)

        const newCommittee = await pnPrisma.committee.create({
            data: {
                name: committee.name,
                shortName: committee.shortName,
                videoLink: committee.applicationVideo,
                logoImage: {
                    create: {
                        name: `Logo for ${committee.name}`
                    }
                },
                paragraph: {
                    create: committeeParagraph
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
                                name: `${committee.shortName}'s bilde`
                            }
                        },
                        articleSections: committeArticle
                    }
                },
                group: {
                    create: {
                        groupType: 'COMMITTEE',
                        order: 106,
                    },
                }
            }
        })

        await Promise.all(committee.CommitteeMembers.map(async member => {
            if (member.UserId === null) {
                console.warn(`${committee.shortName} has a member that is not connected to a user!`)
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
                    order: member.order,
                    title: member.position || undefined,
                }
            })
        }))

        await Promise.all(committee.CommitteeMembersHist.map(async member => {
            const pnUserId = await userMigrator.getPnUserId(member.UserId)
            await pnPrisma.membership.create({
                data: {
                    groupId: newCommittee.groupId,
                    userId: pnUserId,
                    active: false,
                    admin: member.admin,
                    order: member.order,
                    title: member.position || undefined,
                }
            })
        }))
    }))
}
