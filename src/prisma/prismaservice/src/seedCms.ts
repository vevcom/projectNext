import standardCmsContents, { standardCategories } from './standardCmsContents'
import { unified } from 'unified'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { join } from 'path'
import { readFile } from 'fs/promises'
import type { PrismaClient } from '../generated/pn'
import type {
    SeedCmsImage,
    SeedCmsParagraph,
    SeedCmsLink,
    SeedArticleSection,
    SeedArticle,
    SeedCategories
} from './standardCmsContents'

export default async function seedCms(prisma: PrismaClient) {
    await Promise.all(standardCmsContents.cmsImages.map(async (cmsimage) => {
        await seedCmsImage(cmsimage, prisma)
    }))

    await Promise.all(standardCmsContents.cmsParagraphs.map(async (cmsparagraph) => {
        await seedCmsParagraph(cmsparagraph, prisma)
    }))

    await Promise.all(standardCmsContents.cmsLink.map(async (cmslink) => {
        await seedCmsLink(cmslink, prisma)
    }))

    await Promise.all(standardCmsContents.articleSections.map(async (articleSection) => {
        await seedArticleSection(articleSection, prisma)
    }))

    await Promise.all(standardCategories.map(async (category) => {
        await seedArticleCategories(category, prisma)
    }))

    await Promise.all(standardCmsContents.articles.map(async (article, i) => {
        await seedArticle({ ...article, id: i }, prisma)
    }))
}

async function seedCmsImage(cmsimage: SeedCmsImage, prisma: PrismaClient) {
    const image = await prisma.image.findUnique({
        where: {
            name: cmsimage.imageName
        }
    })
    if (!image) {
        throw new Error(`Tried to cennect CmsImage ${cmsimage.name} to 
        ${cmsimage.imageName}, but not the image was not found`)
    }

    return prisma.cmsImage.upsert({
        where: {
            name: cmsimage.name
        },
        update: {
            name: cmsimage.name,
        },
        create: {
            name: cmsimage.name,
            imageSize: cmsimage.imageSize || 'MEDIUM',
            image: {
                connect: {
                    id: image.id
                }
            }
        }
    })
}

async function seedCmsParagraph(cmssparagraph: SeedCmsParagraph, prisma: PrismaClient) {
    const contentMd = await readFile(join('./cms_paragraphs', cmssparagraph.file), 'utf-8')
    const contentHtml = (await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeFormat)
        .use(rehypeStringify)
        .process(contentMd)).value.toString()

    return prisma.cmsParagraph.upsert({
        where: {
            name: cmssparagraph.name
        },
        update: {
            name: cmssparagraph.name,
        },
        create: {
            name: cmssparagraph.name,
            contentMd,
            contentHtml,
        }
    })
}

async function seedCmsLink(cmsLink: SeedCmsLink, prisma: PrismaClient) {
    return prisma.cmsLink.upsert({
        where: {
            name: cmsLink.name
        },
        update: {
            name: cmsLink.name,
        },
        create: {
            name: cmsLink.name,
            url: cmsLink.url,
        }
    })
}

async function seedArticleSection(articleSection: SeedArticleSection & {order?: number}, prisma: PrismaClient) {
    const cmsImage = articleSection.cmsImage ?
        await seedCmsImage(articleSection.cmsImage, prisma) : undefined

    const cmsParagraph = articleSection.cmsParagraph ?
        await seedCmsParagraph(articleSection.cmsParagraph, prisma) : undefined

    const cmsLink = articleSection.cmsLink ?
        await seedCmsLink(articleSection.cmsLink, prisma) : undefined

    return prisma.articleSection.upsert({
        where: {
            name: articleSection.name
        },
        update: {
            name: articleSection.name,
        },
        create: {
            name: articleSection.name,
            imagePosition: articleSection.imagePosition,
            imageSize: articleSection.imageSize,
            order: articleSection.order,
            cmsImage: cmsImage ? {
                connect: {
                    id: cmsImage.id
                }
            } : {},
            cmsLink: cmsLink ? {
                connect: {
                    id: cmsLink.id
                }
            } : {},
            cmsParagraph: cmsParagraph ? {
                connect: {
                    id: cmsParagraph.id
                }
            } : {},
        }
    })
}

async function seedArticle(article: SeedArticle & {id: number}, prisma: PrismaClient) {
    const coverImage = await seedCmsImage(article.coverImage, prisma)
    const articleSections = await Promise.all(article.articleSections.map(
        async (articleSection, i) =>
            seedArticleSection({ ...articleSection, order: i }, prisma)
    ))

    return prisma.article.upsert({
        where: {
            id: article.id
        },
        update: {
            name: article.name,
        },
        create: {
            name: article.name,
            coverImage: {
                connect: {
                    id: coverImage.id
                }
            },
            articleSections: {
                connect: articleSections.map(section => ({ id: section.id }))
            },
            newsArticle:
                article.category === 'news' ? {
                    create: {
                        description: article.description,
                        endDateTime: (() => {
                            const date = new Date()
                            date.setDate(date.getDate() + 7)
                            return date
                        })(),
                        orderPublished: article.orderPublished,
                    }
                } : undefined,
            articleCategory:
                article.category === 'news' ? undefined : {
                    connect: {
                        name: article.category,
                    }
                },
        }
    })
}

async function seedArticleCategories(category: SeedCategories, prisma: PrismaClient) {
    return await prisma.articleCategory.upsert({
        where: {
            name: category.name
        },
        update: {
            name: category.name,
        },
        create: {
            ...category
        }
    })
}
