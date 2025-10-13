import '@pn-server-only'
import { prisma } from '@/prisma/client'
import { ServerError } from '@/services/error'
import { prismaCall } from '@/services/prismaCall'
import type { SpecialCmsImage } from '@prisma/client'
import type { ExpandedCmsImage } from '@/cms/images/types'

/**
 * Read a cms image including the image associated with it
 * @param name - name of the cms image the image
 * @returns - The cms image
 */
export async function readCmsImage(name: string): Promise<ExpandedCmsImage> {
    const cmsImage = await prismaCall(() => prisma.cmsImage.findUnique({
        where: {
            name,
        },
        include: {
            image: true,
        }
    }))
    if (!cmsImage) throw new ServerError('NOT FOUND', `${name} Cms Image not found`)
    return cmsImage
}

/**
 * WARNING: You should assure that the special atr. is Special before calling this function
 * Reads a special cmsImage.
 * @param special SpecialCmsImage
 * @returns ExpandedCmsImage
 */
export async function readSpecialCmsImage(special: SpecialCmsImage): Promise<ExpandedCmsImage> {
    const cmsImage = await prisma.cmsImage.findUnique({
        where: {
            special,
        },
        include: {
            image: true,
        }
    })
    if (!cmsImage) throw new ServerError('NOT FOUND', `${special} Cms Image not found`)
    return cmsImage
}
