'use server'
import { ActionReturn } from "@/actions/type";
import errorHandeler from "@/prisma/errorHandler";
import type { CmsLink } from "@prisma/client";

export default async function create(name: string): Promise<ActionReturn<CmsLink>> {
    try {
        const cmsLink = await prisma.cmsLink.create({
            data: {
                name
            }
        })
        return { success: true, data: cmsLink }
    } catch (error) {
        return errorHandeler(error)
    }
    
}