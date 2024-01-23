import type { ArticleSection } from "@prisma/client";
import type { ActionReturn } from "@/actions/type";
import prisma from "@/prisma";
import errorHandeler from "@/prisma/errorHandler";
import { default as createCmsImage } from "@/actions/cms/images/create";
import { default as createCmsParagraph } from "@/actions/cms/paragraphs/create";
import { default as createCmsLink } from "@/actions/cms/links/create";
import type { ReturnType } from "./ReturnType";

type Part = 'cmsLink' | 'cmsParagraph' | 'cmsImage'

export async function addPart(name: string, part: Part) : Promise<ActionReturn<ReturnType>> {
    try {
        const articleSection = await prisma.articleSection.findUnique({
            where: { name },
            include: { [part]: true }
        });
        if (!articleSection) {
            return { success: false, error: [{message: "ArticleSection not found"}] }
        }
        if (articleSection.cmsLink) {
            return { success: false, error: [{message: `ArticleSection already has ${part}`}] }
        }

        switch (part) {
            case 'cmsLink':
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
            
            case 'cmsParagraph':
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
            
            case 'cmsImage':
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

            default:
                break;
        }
        return { success: false, error: [{message: "Invalid part"}] }
    } catch (error) {
        return errorHandeler(error)
    }
}

export async function removePart(name: string, part: Part) : Promise<ActionReturn<ArticleSection>> {
    try {
        const articleSection = await prisma.articleSection.findUnique({
            where: { name },
            include: { cmsLink: true, cmsParagraph: true, cmsImage: true}
        });
        if (!articleSection) {
            return { success: false, error: [{message: "ArticleSection not found"}] }
        }
        if (!articleSection[part]) {
            return { success: false, error: [{message: `ArticleSection does not have ${part}`}] }
        }

        switch (part) {
            case 'cmsLink':
                await prisma.cmsLink.delete({ where: { id: articleSection.cmsLink?.id } })
                return {
                    success: true,
                    data: await prisma.articleSection.findUnique({
                        where: { name },
                        include: { cmsParagraph: true, cmsImage: true, cmsLink: true }
                    }) || articleSection
                }

            case 'cmsParagraph':
                await prisma.cmsParagraph.delete({ where: { id: articleSection.cmsParagraph?.id } })
                return {
                    success: true,
                    data: await prisma.articleSection.findUnique({
                        where: { name },
                        include: { cmsParagraph: true, cmsImage: true, cmsLink: true }
                    }) || articleSection
                }

            case 'cmsImage':
                await prisma.cmsImage.delete({ where: { id: articleSection.cmsImage?.id } })
                return {
                    success: true,
                    data: await prisma.articleSection.findUnique({
                        where: { name },
                        include: { cmsParagraph: true, cmsImage: true, cmsLink: true }
                    }) || articleSection
                }
            default:
                break;
        }
        return { success: false, error: [{message: "Invalid part"}] }
    } catch (error) {
        return errorHandeler(error)
    }
}