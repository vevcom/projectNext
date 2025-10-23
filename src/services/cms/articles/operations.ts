import '@pn-server-only'
import { articleRealtionsIncluder, maxSections } from './constants'
import { articleSchemas } from './schemas'
import { defineOperation, defineSubOperation } from '@/services/serviceOperation'
import { articleSectionOperations } from '@/cms/articleSections/operations'
import { ServerOnly } from '@/auth/auther/ServerOnly'
import logger from '@/lib/logger'
import { ServerError } from '@/services/error'
import { SpecialCmsArticle } from '@prisma/client'
import { z } from 'zod'
import { v4 } from 'uuid'
import type { ArticleSectionPart } from '@/cms/articleSections/types'

const create = defineOperation({
    authorizer: ServerOnly,
    dataSchema: articleSchemas.create,
    operation: async ({ prisma, data }) => {
        let newName = 'Ny artikkel'
        let i = 1
        if (!data.name) {
            const checkArticleExists = () => prisma.article.findFirst({ where: { name: newName } })

            const maxIter = 30
            while (i < maxIter && await checkArticleExists()) {
                newName = `Ny artikkel ${i++}`
            }
            if (i >= maxIter) {
                newName = v4()
            }
        }
        return await prisma.article.create({
            data: {
                name: name ?? newName,
                coverImage: {
                    create: {},
                }
            },
            include: articleRealtionsIncluder,
        })
    }
})

export const articleOperations = {
    create,
    destroy: defineOperation({
        authorizer: ServerOnly,
        paramsSchema: articleSchemas.params,
        operation: ({ prisma, params }) =>
            prisma.article.delete({
                where: {
                    id: params.articleId
                }
            })
    }),
    readSpecial: defineSubOperation({
        paramsSchema: () => z.object({
            special: z.nativeEnum(SpecialCmsArticle),
        }),
        operation: () => async ({ prisma, params }) => {
            const article = await prisma.article.findUnique({
                where: {
                    special: params.special,
                },
                include: articleRealtionsIncluder
            })
            if (!article) {
                logger.error(`Special article ${params.special} not found - creating it`)
                return create({ data: { special: params.special, name: `Regenerert spesiell ${params.special}` }, bypassAuth: true })
            }
            return {
                ...article,
                coverImage: article.coverImage
            }
        }
    }),
    /**
     * Update the article metadata like name
     */
    update: defineSubOperation({
        paramsSchema: () => articleSchemas.params,
        dataSchema: () => articleSchemas.update,
        operation: () => async ({ prisma, params, data }) =>
            prisma.article.update({
                where: { id: params.articleId },
                data,
                include: articleRealtionsIncluder,
            })
    }),
    addSection: defineSubOperation({
        paramsSchema: () => articleSchemas.params,
        dataSchema: () => articleSchemas.addSection,
        operation: () => async ({ prisma, params, data }) => {
            const article = await prisma.article.findUnique({
                where: {
                    id: params.articleId,
                },
            })
            if (!article) throw new ServerError('NOT FOUND', 'Artikkel ikke funnet.')

            const highestOrderSection = await prisma.articleSection.findMany({
                where: {
                    articleId: params.articleId,
                },
                orderBy: {
                    order: 'desc',
                },
                take: 1,
            })
            // Get the order of the highest order section, or 0 if there are no sections
            const nextOrder = highestOrderSection.length > 0 ? highestOrderSection[0].order + 1 : 0

            const numberOfSections = await prisma.articleSection.count({
                where: {
                    articleId: params.articleId,
                },
            })
            if (numberOfSections >= maxSections) {
                throw new ServerError('BAD PARAMETERS', `The maximum number of sections is ${maxSections}`)
            }

            const updatedArticle = await prisma.article.update({
                where: {
                    id: params.articleId,
                },
                data: {
                    articleSections: {
                        create: {
                            order: nextOrder,
                        },
                    },
                },
                include: articleRealtionsIncluder,
            })

            const addedArticleSectionId = updatedArticle.articleSections[updatedArticle.articleSections.length - 1].id

            for (const part of ['cmsParagraph', 'cmsLink', 'cmsImage'] satisfies ArticleSectionPart[]) {
                if (data.includeParts[part]) {
                    await articleSectionOperations.addPart.internalCall({
                        data: {
                            part,
                        },
                        params: {
                            articleSectionId: addedArticleSectionId
                        }
                    })
                }
            }
            return updatedArticle
        }
    }),
    reorderSections: defineSubOperation({
        paramsSchema: () => articleSchemas.params.extend({
            sectionId: z.number()
        }),
        opensTransaction: true,
        dataSchema: () => articleSchemas.reorderSections,
        operation: () => async ({ prisma, params, data }) => {
            const section = await prisma.articleSection.findUnique({
                where: {
                    articleId: params.articleId,
                    id: params.sectionId,
                },
            })
            if (!section) throw new ServerError('NOT FOUND', 'Seksjon ikke funnet.')

            //find the section with the order one higher/lower than the current section
            const otherSection = await prisma.articleSection.findMany({
                where: {
                    articleId: params.articleId,
                    order: data.direction === 'UP' ? {
                        lt: section.order,
                    } : {
                        gt: section.order,
                    },
                },
                orderBy: {
                    order: data.direction === 'UP' ? 'desc' : 'asc',
                },
                take: 1,
            }).then(
                res => (res.length > 0 ? res[0] : null)
            )
            if (!otherSection) throw new ServerError('BAD PARAMETERS', 'Seksjon kan ikke flyttes opp/ned.')

            //flip thir order numbers
            const tempOrder = -1 // Or any other value that won't violate the unique constraint

            // First, set the order of the section to the temporary value
            return await prisma.$transaction(async (tx) => {
                await tx.articleSection.update({
                    where: {
                        articleId: params.articleId,
                        id: section.id
                    },
                    data: { order: tempOrder },
                })
                const updatedOtherSection = await tx.articleSection.update({
                    where: {
                        articleId: params.articleId,
                        id: otherSection.id
                    },
                    data: { order: section.order },
                })
                // Finally, set the order of the section to the otherSection's original order
                const updatedSection = prisma.articleSection.update({
                    where: {
                        articleId: params.articleId,
                        id: section.id
                    },
                    data: { order: otherSection.order },
                })

                if (!updatedSection || !updatedOtherSection) {
                    throw new ServerError('UNKNOWN ERROR', 'Noe uventet skjedde under flytting av seksjonen.')
                }

                return updatedSection
            })
        }
    }),

    read: defineSubOperation({
        paramsSchema: () => articleSchemas.params,
        operation: () => async ({ prisma, params }) => {
            const article = await prisma.article.findUnique({
                where: {
                    id: params.articleId
                },
                include: articleRealtionsIncluder
            })
            if (!article) throw new ServerError('NOT FOUND', 'Artikkel ikke funnet.')
            return article
        }
    })
}
