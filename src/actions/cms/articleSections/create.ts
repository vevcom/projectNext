'use server'

import { ActionReturn } from "@/actions/type";
import prisma from "@/prisma";
import { default as createCmsImage } from "@/actions/cms/images/create";
import { default as createCmsParagraph } from "@/actions/cms/paragraphs/create";
import { default as createCmsLink } from "@/actions/cms/links/create";
import errorHandeler from "@/prisma/errorHandler";
import type { ReturnType } from "./ReturnType";


export default async function create(name: string): Promise<ActionReturn<ReturnType>> {
    const cmsImageRes = await createCmsImage(`${name}_image`)
    if (!cmsImageRes.success) return cmsImageRes
    const cmsImage = cmsImageRes.data

    const cmsParagraphRes = await createCmsParagraph(`${name}_paragraph`)
    if (!cmsParagraphRes.success) return cmsParagraphRes
    const cmsParagraph = cmsParagraphRes.data

    const cmsLinkRes = await createCmsLink(`${name}_link`)
    if (!cmsLinkRes.success) return cmsLinkRes
    const cmsLink = cmsLinkRes.data

    try {
        const articleSection = await prisma.articleSection.create({
            data: {
                name,
                cmsImage: {
                    connect: {
                        id: cmsImage.id
                    }
                },
                cmsParagraph: {
                    connect: {
                        id: cmsParagraph.id
                    }
                },
                cmsLink: {
                    connect: {
                        id: cmsLink.id
                    }
                }
            },
            include: {
                cmsImage: true,
                cmsParagraph: true,
                cmsLink: true
            }
        })
        return { success: true, data: articleSection }
    } catch (error) {
        return errorHandeler(error)
    }
}