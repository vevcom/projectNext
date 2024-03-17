import 'server-only'
import { articleRealtionsIncluder } from './ConfigVars'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { ExpandedArticle } from './Types'

/**
 * A function to create a new article. It will have no content (sections) and cover image will relate
 * to null. A category can be given to the article, but it is not required.
 * @param name - The name of the article to create. If null, a unique name will be generated.
 * @param config - { categoryId } The category to connect the article to
 * @returns - The created article with cover all contents
 */
export async function createArticle(name: string | null, config?: {
    categoryId: number,
}): Promise<ExpandedArticle> {
    // if name not given, create a unique new name
    let newName = ''
    if (name === null) {
        let i = 1
        newName = 'Ny artikkel'
        while (await prismaCall(() => prisma.article.findFirst({ where: { name: newName } }))) {
            newName = `Ny artikkel ${i++}`
        }
    }

    return await prismaCall(() => prisma.article.create({
        data: {
            name: name || newName,
            coverImage: {
                create: {}
            },
            articleCategory: config ? {
                connect: {
                    id: config.categoryId
                }
            } : undefined
        },
        include: articleRealtionsIncluder,
    }))
}
