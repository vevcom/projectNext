import standardCmsContents from './standardCmsContents'
import type { 
    SeedCmsImage, 
    SeedCmsParagraph,
    SeedCmsLink,
    SeedArticleSection,
    SeedArticle,
} from './standardCmsContents'
import type { PrismaClient } from '@prisma/client'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { unified } from 'unified'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'

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

    await Promise.all(standardCmsContents.articles.map(async (article) => {
        await seedArticle(article, prisma)
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

async function seedArticleSection(articleSection: SeedArticleSection, prisma: PrismaClient) {
    const cmsImage = articleSection.cmsImage ? await seedCmsImage(articleSection.cmsImage, prisma) : undefined
    const cmsParagraph = articleSection.cmsParagraph ? await seedCmsParagraph(articleSection.cmsParagraph, prisma) : undefined
    const cmsLink = articleSection.cmsLink ? await seedCmsLink(articleSection.cmsLink, prisma) : undefined

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
            cmsImage:  {
                connect: cmsImage
            },
            cmsLink: {
                connect: cmsLink
            },
            cmsParagraph: {
                connect: cmsParagraph
            }
        }
    })
}

async function seedArticle(article: SeedArticle, prisma: PrismaClient) {
    const coverImage = await seedCmsImage(article.coverImage, prisma)
    const articleSections = await Promise.all(article.articleSections.map(async (articleSection) => {
        return seedArticleSection(articleSection, prisma)
    }))

    return prisma.article.upsert({
        where: {
            name: article.name
        },
        update: {
            name: article.name,
        },
        create: {
            name: article.name,
            coverImage: {
                connect: coverImage
            },
            articleSections: {
                connect: articleSections.map(section => ({ id: section.id }))
            }
        }
    })
}