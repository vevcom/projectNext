'use server'

import type { ActionReturn } from "@/actions/type";
import prisma from "@/prisma";
import errorHandeler from "@/prisma/errorHandler";
import type { CmsLink } from "@prisma/client";

export default async function update(
    id: number, 
    {name, url}: {
        name:string, 
        url: string
    }) : Promise<ActionReturn<CmsLink>> {
    try {
        const cmsLink = await prisma.cmsLink.update({
            where: { id },
            data: { name, url }
        })
        return { success: true, data: cmsLink }
    } catch (error) {
        return errorHandeler(error)
    }
}