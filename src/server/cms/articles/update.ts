import 'server-only'
import { articleRealtionsIncluder, maxSections } from '@/cms/articles/ConfigVars'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import { addArticleSectionPart } from '@/server/cms/articleSections/update'
import type { ArticleSectionPart } from '@/server/cms/articleSections/Types'
import type { ActionReturn } from '@/actions/Types'
import type { ArticleSection } from '@prisma/client'
import type { ExpandedArticle } from '@/cms/articles/Types'

/**
 * A function to update metadata of an article. This includes for ex. name.
 * @param id - The id of the article to update
 * @param data - The new data to update the article with
 * @returns
 */
export async function updateArticle(
    id: number,
    data: { name: string }
): Promise<ActionReturn<ExpandedArticle>> {
    try {
        const article = await prisma.article.update({
            where: { id },
            data,
            include: articleRealtionsIncluder,
        })
        return { success: true, data: article }
    } catch (error) {
        return createPrismaActionError(error)
    }
}

/**
 * A function to add a new article section to an article
 * @param id - The id of the article to add a section to
 * @param include - The parts to include in the new section
 * @returns
 */
export async function addSectionToArticle(
    id: number,
    include: Partial<Record<ArticleSectionPart, boolean>>
): Promise<ActionReturn<ExpandedArticle>> {
    try {
        const article = await prisma.article.findUnique({
            where: {
                id,
            },
        })

        if (!article) {
            return createActionError('NOT FOUND', 'Artikkel ikke funnet.')
        }

        const highestOrderSection = await prisma.articleSection.findMany({
            where: {
                articleId: id,
            },
            orderBy: {
                order: 'desc',
            },
            take: 1,
        })

        // Get the order of the highest order section, or 0 if there are no sections
        const nextOreder = highestOrderSection.length > 0 ? highestOrderSection[0].order + 1 : 0


        const numberOfSections = await prisma.articleSection.count({
            where: {
                articleId: id,
            },
        })
        if (numberOfSections >= maxSections) {
            return createActionError('BAD PARAMETERS', `The maximum number of sections is ${maxSections}`)
        }

        const newSectionName = `${article.name} section ${nextOreder}`

        const updatedArticle = await prisma.article.update({
            where: {
                id,
            },
            data: {
                articleSections: {
                    create: {
                        name: newSectionName,
                        order: nextOreder,
                    },
                },
            },
            include: articleRealtionsIncluder,
        })

        for (const part of ['cmsParagraph', 'cmsLink', 'cmsImage'] as const) {
            if (include[part]) {
                await addArticleSectionPart(newSectionName, part)
            }
        }

        return { success: true, data: updatedArticle }
    } catch (error) {
        return createPrismaActionError(error)
    }
}

/**
 * A function to move a section in an article up or down
 * @param id - The id of the article to move a section in
 * @param sectionId - The id of the section to move
 * @param direction - The direction to move the section in
 * @returns
 */
export async function moveSectionOrder(
    id: number,
    sectionId: number,
    direction: 'UP' | 'DOWN'
): Promise<ActionReturn<ArticleSection>> {
    //TODO: auth on visability

    try {
        //get section to move
        const section = await prisma.articleSection.findUnique({
            where: {
                articleId: id,
                id: sectionId,
            },
        })
        if (!section) {
            return createActionError('NOT FOUND', 'Seksjon ikke funnet.')
        }

        //find the section with the order one higher/lower than the current section
        const otherSection = await prisma.articleSection.findMany({
            where: {
                articleId: id,
                order: direction === 'UP' ? {
                    lt: section.order,
                } : {
                    gt: section.order,
                },
            },
            orderBy: {
                order: direction === 'UP' ? 'desc' : 'asc',
            },
            take: 1,
        }).then(sections => sections[0])
        if (!otherSection) {
            return createActionError('BAD PARAMETERS', 'Seksjon kan ikke flyttes opp/ned.')
        }


        //flip thir order numbers
        const tempOrder = -1 // Or any other value that won't violate the unique constraint

        // First, set the order of the section to the temporary value
        await prisma.articleSection.update({
            where: {
                articleId: id,
                id: section.id
            },
            data: { order: tempOrder },
        })
        const updatedOtherSection = await prisma.articleSection.update({
            where: {
                articleId: id,
                id: otherSection.id
            },
            data: { order: section.order },
        })
        // Finally, set the order of the section to the otherSection's original order
        const updatedSection = await prisma.articleSection.update({
            where: {
                articleId: id,
                id: section.id
            },
            data: { order: otherSection.order },
        })


        if (!updatedSection || !updatedOtherSection) {
            return createActionError('UNKNOWN ERROR', 'Noe uventet skjedde under flytting av seksjonen.')
        }

        return { success: true, data: updatedSection }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
