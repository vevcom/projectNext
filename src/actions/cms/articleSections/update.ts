'use server'
import { maxImageSize, minImageSize } from './ConfigVars'
import { destroyArticleSection } from './destroy'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { createCmsImage } from '@/actions/cms/images/create'
import { createCmsParagraph } from '@/actions/cms/paragraphs/create'
import { createCmsLink } from '@/actions/cms/links/create'
import type { ImageSize, ArticleSection, Position } from '@prisma/client'
import type { ExpandedArticleSection } from './Types'
import type { ActionReturn } from '@/actions/Types'


export async function updateArticleSection(name: string, changes: {
    imageSize?: number,
    imagePosition?: Position,
}): Promise<ActionReturn<ExpandedArticleSection>> {
    try {
        //Sets the image resolution based on the image size
        let newCmsImageResolution: ImageSize | undefined = undefined

        if (changes.imageSize) {
            if (changes.imageSize > maxImageSize) {
                changes.imageSize = maxImageSize
            }
            if (changes.imageSize < minImageSize) {
                changes.imageSize = minImageSize
            }
            newCmsImageResolution = 'SMALL'
            if (changes.imageSize > 250) {
                newCmsImageResolution = 'MEDIUM'
            }
        }

        const articleSection = await prisma.articleSection.update({
            where: { name },
            data: {
                ...changes,
                cmsImage: {
                    update: {
                        imageSize: newCmsImageResolution,
                    },
                },
            },
            include: { cmsParagraph: true, cmsImage: true, cmsLink: true }
        })
        return { success: true, data: articleSection }
    } catch (error) {
        return errorHandler(error)
    }
}

export type Part = 'cmsLink' | 'cmsParagraph' | 'cmsImage'

export async function addArticleSectionPart(name: string, part: Part): Promise<ActionReturn<ExpandedArticleSection>> {
    try {
        const articleSection = await prisma.articleSection.findUnique({
            where: { name },
            include: { [part]: true }
        })
        if (!articleSection) {
            return { success: false, error: [{ message: 'ArticleSection not found' }] }
        }
        if (articleSection.cmsLink) {
            return { success: false, error: [{ message: `ArticleSection already has ${part}` }] }
        }

        switch (part) {
            case 'cmsImage':
            {
                const cmsImage = await createCmsImage(`${name}_image`)
                if (!cmsImage.success) return cmsImage
                return {
                    success: true,
                    data: await prisma.articleSection.update({
                        where: { name },
                        data: { cmsImage: { connect: { id: cmsImage.data.id } } },
                        include: { cmsParagraph: true, cmsImage: true, cmsLink: true }
                    })
                }
            }
            case 'cmsParagraph':
            {
                const cmsParagraph = await createCmsParagraph(`${name}_paragraph`)
                if (!cmsParagraph.success) return cmsParagraph
                return {
                    success: true,
                    data: await prisma.articleSection.update({
                        where: { name },
                        data: { cmsParagraph: { connect: { id: cmsParagraph.data.id } } },
                        include: { cmsParagraph: true, cmsImage: true, cmsLink: true }
                    })
                }
            }
            case 'cmsLink':
            {
                const cmsLink = await createCmsLink(`${name}_link`)
                if (!cmsLink.success) return cmsLink
                return {
                    success: true,
                    data: await prisma.articleSection.update({
                        where: { name },
                        data: { cmsLink: { connect: { id: cmsLink.data.id } } },
                        include: { cmsParagraph: true, cmsImage: true, cmsLink: true }
                    })
                }
            }
            default:
                break
        }
        return { success: false, error: [{ message: 'Invalid part' }] }
    } catch (error) {
        return errorHandler(error)
    }
}

export async function removeArticleSectionPart(name: string, part: Part): Promise<ActionReturn<ArticleSection>> {
    try {
        const articleSection = await prisma.articleSection.findUnique({
            where: { name },
            include: { cmsLink: true, cmsParagraph: true, cmsImage: true }
        })
        if (!articleSection) {
            return { success: false, error: [{ message: 'ArticleSection not found' }] }
        }
        if (!articleSection[part]) {
            return { success: false, error: [{ message: `ArticleSection does not have ${part}` }] }
        }

        switch (part) {
            case 'cmsLink':
                await prisma.cmsLink.delete({ where: { id: articleSection.cmsLink?.id } })
                break
            case 'cmsParagraph':
                await prisma.cmsParagraph.delete({ where: { id: articleSection.cmsParagraph?.id } })
                break
            case 'cmsImage':
                await prisma.cmsImage.delete({ where: { id: articleSection.cmsImage?.id } })
                break
            default:
                break
        }


        // check if all Parts are removed and if so, remove the articleSection,
        // but only if destroyOnEmpty is true
        const afterDelete = await prisma.articleSection.findUnique({
            where: { name },
            include: { cmsParagraph: true, cmsImage: true, cmsLink: true }
        })
        if (!afterDelete) {
            return {
                success: false,
                error: [{ message: 'Noe uventet skjedde etter sletting av del av artclesection' }]
            }
        }
        if (
            articleSection.destroyOnEmpty &&
            !afterDelete.cmsImage &&
            !afterDelete.cmsParagraph &&
            !afterDelete.cmsImage
        ) {
            const destroyRes = await destroyArticleSection(name)
            if (!destroyRes.success) {
                return {
                    success: false,
                    error: [{ message: 'Greide ikke slette artikkelseksjonen' }]
                }
            }
            return { success: true, data: destroyRes.data }
        }

        return {
            success: true,
            data: afterDelete
        }
    } catch (error) {
        return errorHandler(error)
    }
}
