import '@pn-server-only'
import { searchAuth } from './auth'
import { searchSchemas } from './schemas'
import { defaultSearchResultLimit } from './constants'
import { defineOperation } from '@/services/serviceOperation'
import { standardImageCollectionOperations } from '@/services/images/standard/operations'
import { expandedImageIncluder } from '@/services/images/subservice/constants'

export const searchOperations = {
    searchUsers: defineOperation({
        paramsSchema: searchSchemas.searchUsers,
        authorizer: () => searchAuth.searchUsers.dynamicFields({}),
        operation: async ({ prisma, params }) => {
            const words = params.query.split(/\s+/).filter(Boolean)

            const defaultProfileImage = await standardImageCollectionOperations.readStandardImage({
                params: { standardImage: 'DEFAULT_PROFILE_IMAGE' },
            })

            const users = await prisma.user.findMany({
                take: params.limit ?? defaultSearchResultLimit,
                select: {
                    id: true,
                    username: true,
                    firstname: true,
                    lastname: true,
                    image: { include: expandedImageIncluder },
                },
                where: {
                    AND: words.map(word => ({
                        OR: [
                            { firstname: { contains: word, mode: 'insensitive' } },
                            { lastname: { contains: word, mode: 'insensitive' } },
                            { username: { contains: word, mode: 'insensitive' } },
                        ],
                    })),
                },
                orderBy: [{ lastname: 'asc' }, { firstname: 'asc' }],
            })

            return users.map(user => ({ ...user, image: user.image ?? defaultProfileImage }))
        }
    }),

    searchEvents: defineOperation({
        paramsSchema: searchSchemas.searchEvents,
        authorizer: () => searchAuth.searchEvents.dynamicFields({}),
        operation: async ({ prisma, params }) => await prisma.event.findMany({
            take: params.limit ?? defaultSearchResultLimit,
            select: {
                id: true,
                name: true,
                eventStart: true,
                coverImage: {
                    select: {
                        image: { include: expandedImageIncluder }
                    }
                }
            },
            where: {
                name: { contains: params.query, mode: 'insensitive' },
            },
            orderBy: { eventStart: 'desc' },
        })
    }),
} as const
