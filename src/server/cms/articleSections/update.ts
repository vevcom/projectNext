import 'server-only'
import { maxImageSize, minImageSize, articleSectionsRealtionsIncluder } from '@/cms/articleSections/ConfigVars'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import { createCmsImage } from '@/server/cms/images/create'
import { createCmsParagraph } from '@/server/cms/paragraphs/create'
import { createCmsLink } from '@/server/cms/links/create'
import type { ImageSize, ArticleSection, Position } from '@prisma/client'
import type { ExpandedArticleSection } from '@/cms/articleSections/Types'
import type { ActionReturn } from '@/actions/Types'

/**
 * This is the function that updates an article section metadata about how the (cms)image is displayed
 * in the article section. It will also change the image size (resolution) based on the image size in
 * the article section
 * @param nameOrId - The name or id of the article section to update
 * @param changes - The changes to make to the article section. imageSize is the size of 
 * the image in pixels, imagePosition is the position of the image in the article section
 * @returns 
 */
export async function updateArticleSection(nameOrId: string, changes: {
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
            where: { 
                name: typeof nameOrId === 'string' ? nameOrId : undefined, 
                id: typeof nameOrId === 'number' ? nameOrId : undefined
            },
            data: {
                ...changes,
                cmsImage: {
                    update: {
                        imageSize: newCmsImageResolution,
                    },
                },
            },
            include: articleSectionsRealtionsIncluder
        })
        return { success: true, data: articleSection }
    } catch (error) {
        return createPrismaActionError(error)
    }
}