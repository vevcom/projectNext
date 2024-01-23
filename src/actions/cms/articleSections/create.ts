'use server'

import { ActionReturn } from "@/actions/type";
import type { ArticleSection } from "prisma/client";
import prisma from "@/prisma";
import { default as createCmsImage } from "@/actions/cms/images/create";
import { default as createCmsParagraph } from "@/actions/cms/paragraphs/create";

export default async function create(name: string): Promise<ActionReturn<ArticleSection>> {
    const cmsImage = await 

    const articleSection = await prisma.articleSection.create({
        data: {
            name
        }
    })
}