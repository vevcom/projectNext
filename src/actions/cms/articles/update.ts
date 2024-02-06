'use server'
import { maxSections } from './ConfigVars'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { ActionReturn } from '@/actions/type'
import { addPart } from '@/cms/articleSections/update'
import { ArticleSection } from '@prisma/client'
import { z } from 'zod'
import type { Part } from '@/cms/articleSections/update'
import type { ReturnType } from './ReturnType'

export default async function update(id: number, rawData: FormData) : Promise<ActionReturn<ReturnType>> {
    const schema = z.object({
        name: z.string().min(2).max(20)
    })
    const parse = schema.safeParse({
        name: rawData.get('name'),
    })

    if (!parse.success) {
        return {
            success: false,
            error: parse.error.issues
        }
    }
    const data = parse.data

    try {
        const article = await prisma.article.update({
            where: {
                id,
            },
            data: {
                ...data,
            },
            include: {
                coverImage: true,
                articleSections: {
                    include: {
                        cmsImage: true,
                        cmsParagraph: true,
                        cmsLink: true,
                    }
                }
            }
        })
        return { success: true, data: article }
    } catch (error) {
        return errorHandler(error)
    }
}

export async function addSectionToArticle(
    id: number,
    include: Partial<Record<Part, boolean>>
) : Promise<ActionReturn<ReturnType>> {
    try {
        const article = await prisma.article.findUnique({
            where: {
                id,
            },
        })

        if (!article) {
            return {
                success: false,
                error: [{
                    message: 'Artikkel ikke funnet',
                }],
            }
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
            return {
                success: false,
                error: [{
                    message: `The maximum number of sections is ${maxSections}`,
                }],
            }
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
            include: {
                coverImage: true,
                articleSections: {
                    include: {
                        cmsImage: true,
                        cmsParagraph: true,
                        cmsLink: true,
                    }
                }
            }
        })

        for (const part of ['cmsParagraph', 'cmsLink', 'cmsImage'] as const) {
            if (include[part]) {
                await addPart(newSectionName, part)
            }
        }

        return { success: true, data: updatedArticle }
    } catch (error) {
        return errorHandler(error)
    }
}

export async function moveSectionOrder(
    id: number,
    sectionId: number,
    direction: 'UP' | 'DOWN'
) : Promise<ActionReturn<ArticleSection>> {
    try {
        //get section to move
        const section = await prisma.articleSection.findUnique({
            where: {
                articleId: id,
                id: sectionId,
            },
        })
        if (!section) {
            return {
                success: false,
                error: [{
                    message: 'Seksjon ikke funnet',
                }],
            }
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
            return {
                success: false,
                error: [{
                    message: 'Seksjon kan ikke  flyttes opp/ned',
                }],
            }
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
            return {
                success: false,
                error: [{
                    message: 'Noe uventet skjedde under flytting av seksjonen',
                }],
            }
        }

        return { success: true, data: updatedSection }
    } catch (error) {
        console.log(error)
        return errorHandler(error)
    }
}
