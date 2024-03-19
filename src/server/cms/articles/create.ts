import 'server-only'
import { articleRealtionsIncluder } from './ConfigVars'
import { createArticleSchema } from './schema'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { CreateArticleType } from './schema'
import type { ExpandedArticle } from './Types'

/**
 * A function to create a new article. It will have no content (sections) and cover image will relate
 * to null. A category can be given to the article, but it is not required.
 * @param name - The name of the article to create. If null, a unique name will be generated.
 * @param config - { categoryId } The category to connect the article to
 * @returns - The created article with cover all contents
 */
export async function createArticle(
    rawData: CreateArticleType,
    categoryId?: number,
): Promise<ExpandedArticle> {
    const { name } = createArticleSchema.detailedValidate(rawData)

    // if name not given, create a unique new name
    let newName: string
    if (name === null) {
        let i = 1
        newName = 'Ny artikkel'

        const checkArticleExists = () => prismaCall(() => prisma.article.findFirst({ where: { name: newName } }))

        while (await prismaCall(checkArticleExists)) {
            newName = `Ny artikkel ${i++}`
        }
    }

    return await prismaCall(() => prisma.article.create({
        data: {
            name: name ?? newName,
            coverImage: {
                create: {},
            },
            articleCategory: categoryId ? {
                connect: {
                    id: categoryId,
                },
            } : undefined,
        },
        include: articleRealtionsIncluder,
    }))
}
