import { maxImageSize, minImageSize } from './constants'
import { Position } from '@/prisma-generated-pn-types'
import { z } from 'zod'

export const baseSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    imageSize: z.number().transform(val => {
        if (val < minImageSize) return minImageSize
        if (val > maxImageSize) return maxImageSize
        return val
    }),
    position: z.nativeEnum(Position),
    part: z.union([z.literal('cmsLink'), z.literal('cmsImage'), z.literal('cmsParagraph')])
})

export const articleSectionSchemas = {
    create: baseSchema.pick({
        name: true,
    }),
    update: baseSchema.pick({
        imageSize: true,
        position: true
    }).partial(),
    addPart: baseSchema.pick({
        part: true
    }),
    removePart: baseSchema.pick({
        part: true
    }),
    params: z.union([
        z.object({
            articleSectionId: z.number(),
            articleSectionName: z.undefined().optional()
        }),
        z.object({
            articleSectionId: z.undefined().optional(),
            articleSectionName: z.string()
        })
    ]),
} as const
