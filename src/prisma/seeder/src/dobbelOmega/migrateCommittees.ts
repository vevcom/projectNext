import { owIdToPnId } from './IdMapper'
import { cmsParagraphOperations } from '@/services/cms/paragraphs/operations'
import { readFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import type { PrismaClient as PrismaClientPn } from '@/prisma-generated-pn-client'
import type { Prisma } from '@/prisma-generated-pn-types'
import type { PrismaClient as PrismaClientOw } from '@/prisma-generated-ow-basic/client'
import type { UserMigrator } from './migrateUsers'
import type { IdMapper } from './IdMapper'

const fileName = fileURLToPath(import.meta.url)
const directoryName = dirname(fileName)

async function readCommitteMarkdown(filename: string): Promise<string> {
    const filepath = join(directoryName, '..', '..', 'cms_paragraphs', 'committees', filename)
    try {
        return await readFile(filepath, 'utf-8')
    } catch {
        return ''
    }
}

/**
 * Creates a CmsParagraph with rendered contentHtml by delegating to the same
 * cmsParagraphOperations.updateContent used by the live app, instead of duplicating
 * the markdown->html pipeline here.
 */
async function createCmsParagraph(pnPrisma: PrismaClientPn, markdown: string) {
    const paragraph = await pnPrisma.cmsParagraph.create({ data: {} })
    await cmsParagraphOperations.updateContent.internalCall({
        prisma: pnPrisma,
        params: { paragraphId: paragraph.id },
        data: { markdown },
    })
    return paragraph
}

async function createCommitteArticleSection(
    pnPrisma: PrismaClientPn,
    filename: string
): Promise<{ create: Prisma.ArticleSectionCreateInput } | undefined> {
    const markdown = await readCommitteMarkdown(filename)
    if (!markdown) return undefined
    const cmsParagraph = await createCmsParagraph(pnPrisma, markdown)
    return {
        create: {
            cmsParagraph: {
                connect: { id: cmsParagraph.id },
            },
        },
    }
}

export default async function migrateCommittees(
    pnPrisma: PrismaClientPn,
    owPrisma: PrismaClientOw,
    userMigrator: UserMigrator,
    imageIdMap: IdMapper,
) {
    const committees = await owPrisma.committees.findMany({
        include: {
            CommitteeMembers: true,
            CommitteeMembersHist: true,
        }
    })

    await Promise.all(committees.map(async committee => {
        const committeeParagraph = await createCmsParagraph(
            pnPrisma, await readCommitteMarkdown(`${committee.shortname}_p.md`)
        )
        const applicationParagraph = await createCmsParagraph(pnPrisma, committee.applicationText || '')
        const committeArticle = await createCommitteArticleSection(pnPrisma, `${committee.shortname}_a.md`)
        const logoImageId = owIdToPnId(imageIdMap, committee.ImageId)

        const newCommittee = await pnPrisma.committee.create({
            data: {
                name: committee.name,
                shortName: committee.shortname,
                videoLink: committee.applicationVideo,
                logoImage: logoImageId ? {
                    connect: {
                        id: logoImageId
                    }
                } : undefined,
                paragraph: {
                    connect: { id: committeeParagraph.id }
                },
                applicationParagraph: {
                    connect: { id: applicationParagraph.id }
                },
                committeeArticle: {
                    create: {
                        name: committee.name,
                        coverImage: {
                            create: {
                                name: `${committee.shortname}'s bilde`
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
