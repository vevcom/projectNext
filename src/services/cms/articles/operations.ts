import '@pn-server-only'
import { articleRealtionsIncluder } from './constants'
import { articleSchemas } from './schemas'
import { defineOperation, defineSubOperation } from '@/services/serviceOperation'
import { ServerOnly } from '@/auth/auther/ServerOnly'
import logger from '@/lib/logger'
import { SpecialCmsArticle } from '@prisma/client'
import { z } from 'zod'
import { v4 } from 'uuid'

const create = defineOperation({
    authorizer: ServerOnly,
    dataSchema: articleSchemas.create,
    operation: async ({ prisma, data }) => {
        let newName = 'Ny artikkel'
        let i = 1
        if (!data.name) {
            const checkArticleExists = () => prisma.article.findFirst({ where: { name: newName } })

            const maxIter = 30
            while (i < maxIter && await checkArticleExists()) {
                newName = `Ny artikkel ${i++}`
            }
            if (i >= maxIter) {
                newName = v4()
            }
        }
        return await prisma.article.create({
            data: {
                name: name ?? newName,
                coverImage: {
                    create: {},
                }
            },
            include: articleRealtionsIncluder,
        })
    }
})

export const articleOperations = {
    create,

    readSpecial: defineSubOperation({
        paramsSchema: () => z.object({
            special: z.nativeEnum(SpecialCmsArticle),
        }),
        operation: () => async ({ prisma, params }) => {
            const article = await prisma.article.findUnique({
                where: {
                    special: params.special,
                },
                include: articleRealtionsIncluder
            })
            if (!article) {
                logger.error(`Special article ${params.special} not found - creating it`)
                return create({ data: { special: params.special, name: `Regenerert spesiell ${params.special}` } })
            }
            return {
                ...article,
                coverImage: article.coverImage
            }
        }
    })
}
