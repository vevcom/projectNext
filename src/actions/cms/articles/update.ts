'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { ActionReturn } from '@/actions/type'
import type { ReturnType } from './ReturnType'

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

export async function addSectionToArticle(id: number, include: {
    paragraph: boolean,
    image: boolean,
    link: boolean,
}) : Promise<ActionReturn<ReturnType>> {
    try {
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

        const article = await prisma.article.update({
            where: {
                id,
            },
            data: {
                articleSections: {
                    create: {
                        name: `section ${highestOrder + 1}`,
                        order: highestOrder + 1, // Increment the highest order
                        cmsParagraph: include.paragraph ? {
                            create: {
                                name: `section ${highestOrder + 1} paragraph`,
                            }
                        } : undefined,
                        cmsImage: include.image ? {
                            create: {
                                name: `section ${highestOrder + 1} image`,
                            }
                        } : undefined,
                        cmsLink: include.link ? {
                            create: {
                                name: `section ${highestOrder + 1} link`,
                            }
                        } : undefined,
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
        });
        return { success: true, data: article }
    } catch (error) {
        return errorHandler(error)
    }
}
