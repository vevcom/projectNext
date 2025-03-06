import 'server-only'
import { ServiceMethod } from '@/services/ServiceMethod'
import { ReadBadgeAuther } from './Authers'
import { z } from 'zod'

export const readBadge = ServiceMethod({
    paramsSchema: z.object({
            id: z.number(),
        }),
    auther: () => ReadBadgeAuther.dynamicFields({}),
    method: async ({prisma, params: { id }}) => await prisma.badge.findUniqueOrThrow({
        where: {
            id
        },
        include: {
            cmsImage: true,
        }
    })
})

export const readAllBadges = ServiceMethod({
    auther: () => ReadBadgeAuther.dynamicFields({}),
    method: async ({prisma}) => await prisma.badge.findMany({
        include: {
            cmsImage: {include: {image: true}}
        }, 
        orderBy: {
            id: "asc"
        },
    })
})
