'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { ActionReturn } from '@/actions/type'
import type { ReturnType } from './ReturnType'
import { maxSections } from './ConfigVars'
import { addPart } from '@/cms/articleSections/update'
import type { Part } from '@/cms/articleSections/update'

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

export async function addSectionToArticle(id: number, include: Partial<Record<Part, boolean>>) : Promise<ActionReturn<ReturnType>> {
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
        const highestOrder = highestOrderSection.length > 0 ? highestOrderSection[0].order : 0;

        if (highestOrder >= maxSections) return {
            success: false,
            error: [{
                message: `The maximum number of sections is ${maxSections}`,
            }],
        }

        const newSectionName = `${article.name} section ${highestOrder + 1}`

        const updatedArticle = await prisma.article.update({
            where: {
                id,
            },
            data: {
                articleSections: {
                    create: {
                        name: newSectionName,
                        order: highestOrder + 1, // Increment the highest order 1
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
