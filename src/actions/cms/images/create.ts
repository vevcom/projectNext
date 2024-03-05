'use server'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { Image, CmsImage } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function createCmsImage(name: string): Promise<ActionReturn<CmsImage & {image: Image | null}>> {
    try {
        const created = {
            ...await prisma.cmsImage.create({
                data: {
                    name,
                },
            }),
            image: null,
        }
        return { success: true, data: created }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
