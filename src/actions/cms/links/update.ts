'use server'

import type { ActionReturn } from "@/actions/type";
import prisma from "@/prisma";
import errorHandeler from "@/prisma/errorHandler";
import type { CmsLink } from "@prisma/client";
import { z } from "zod";

export default async function update(id: number, rawData: FormData) : Promise<ActionReturn<CmsLink>> {
    const schema = z.object({
        text: z.string(),
        url: z.string().url()
    })
    const parse = schema.safeParse({
        text: rawData.get('text'),
        url: rawData.get('url'),
    })

    if (!parse.success) {
        return { success: false, error: parse.error.issues }
    }

    const { text, url } = parse.data
    
    try {
        const cmsLink = await prisma.cmsLink.update({
            where: { id },
            data: { text, url }
        })
        return { success: true, data: cmsLink }
    } catch (error) {
        return errorHandeler(error)
    }
}