import '@pn-server-only'
import { articleRealtionsIncluder } from './ConfigVars'
import { createArticleValidation } from './validation'
import { prisma } from '@/prisma/client'
import { prismaCall } from '@/services/prismaCall'
import type { CreateArticleTypes } from './validation'
import type { ExpandedArticle } from './Types'

/**
 * A function to create a new article. It will have no content (sections) and cover image will relate
 * to null. A category can be given to the article, but it is not required.
 * @param name - The name of the article to create. If null, a unique name will be generated.
 * @param config - { categoryId } The category to connect the article to
 * @returns - The created article with cover all contents
 */
export async function createArticle(
    rawData: CreateArticleTypes['Detailed'],
    categoryId?: number,
): Promise<ExpandedArticle> {
    const { name } = createArticleValidation.detailedValidate(rawData)

    // if name not given, create a unique new name
    let newName = 'Ny artikkel'
    if (!name) {
        let i = 1

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
