'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { ActionReturn } from '@/actions/type'
import type { ReturnType } from './ReturnType'
import { maxSections } from './ConfigVars'
import { addPart } from '@/cms/articleSections/update'
import type { Part } from '@/cms/articleSections/update'
import { ArticleSection } from '@prisma/client'

export default async function update(id: number, config: {
    name?: string,
}) : Promise<ActionReturn<ReturnType>> {
    try {
        const article = await prisma.article.update({
            where: {
                id,
            },
            data: {
                ...config,
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
        });

        if (!article) return {
            success: false,
            error: [{
                message: 'Artikkel ikke funnet',
            }],
        }

        const highestOrderSection = await prisma.articleSection.findMany({
            where: {
                articleId: id,
            },
            orderBy: {
                order: 'desc',
            },
            take: 1,
        });

        // Get the order of the highest order section, or 0 if there are no sections
        const nextOreder = highestOrderSection.length > 0 ? highestOrderSection[0].order + 1 : 0;


        const numberOfSections = await prisma.articleSection.count({
            where: {
                articleId: id,
            },
        });
        if (numberOfSections >= maxSections) return {
            success: false,
            error: [{
                message: `The maximum number of sections is ${maxSections}`,
            }],
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
                const newPart = await addPart(newSectionName, part)
            }
        }
        if (include['cmsImage']) {
            const newPart = await addPart(newSectionName, 'cmsImage')
            console.log(newPart)
        }

        return { success: true, data: updatedArticle }
    } catch (error) {
        return errorHandler(error)
    }
}

export async function moveSectionOrder(
    sectionId: number, 
    direction: 'UP' | 'DOWN'
) : Promise<ActionReturn<ArticleSection>> {
    try {
        //get section to move
        const section = await prisma.articleSection.findUnique({
            where: {
                id: sectionId,
            },
        })
        if (!section) return {
            success: false,
            error: [{
                message: 'Seksjon ikke funnet',
            }],
        }

        //find the section with the order one higher/lower than the current section
        const otherSection = await prisma.articleSection.findFirst({
            where: {
                order: direction === 'UP' ? {
                    lt: section.order,
                } : {
                    gt: section.order,
                },
            },
            orderBy: {
                order: direction === 'UP' ? 'desc' : 'asc',
            },
        })
        if (!otherSection) return {
            success: false,
            error: [{
                message: 'Seksjon kan ikke  flyttes opp/ned',
            }],
        }


        //flip thir order numbers
        const [updatedSection, updatedOtherSection] = await prisma.$transaction([
            prisma.articleSection.update({
                where: {
                    id: section.id,
                },
                data: {
                    order: otherSection.order,
                },
            }),
            prisma.articleSection.update({
                where: {
                    id: otherSection.id,
                },
                data: {
                    order: section.order,
                },
            }),
        ])

        if (!updatedSection || !updatedOtherSection) return {
            success: false,
            error: [{
                message: 'Noe uventet skjedde under flytting av seksjonen',
            }],
        }

        return { success: true, data: updatedSection }
    } catch (error) {
        return errorHandler(error)
    }
}
