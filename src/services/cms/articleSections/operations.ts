import '@pn-server-only'
import { articleSectionSchemas } from './schemas'
import { articleSectionsRealtionsIncluder } from './constants'
import { ServerOnly } from '@/auth/auther/ServerOnly'
import { defineOperation, defineSubOperation } from '@/services/serviceOperation'
import { ServerError } from '@/services/error'
import { cmsImageOperations } from '@/cms/images/operations'
import { cmsParagraphOperations } from '@/cms/paragraphs/operations'
import { cmsLinkOperations } from '@/cms/links/operations'

const create = defineOperation({
    authorizer: ServerOnly,
    dataSchema: articleSectionSchemas.create,
    operation: ({ prisma, data }) =>
        prisma.articleSection.create({
            data,
            include: articleSectionsRealtionsIncluder
        })
})

const destroy = defineOperation({
    authorizer: ServerOnly,
    paramsSchema: articleSectionSchemas.params,
    operation: ({ prisma, params }) =>
        prisma.articleSection.delete({
            where: params.id ? { id: params.id } : { name: params.name },
            include: articleSectionsRealtionsIncluder
        })
})

export const articleSectionOperations = {
    create,
    destroy,
    /**
     * This is the function that updates an article section metadata about how the (cms)image is displayed
     * in the article section. It will also change the image size (resolution) based on the image size in
     * the article section
     * @param params - name or id
     * @param data - The position and size data
     */
    update: defineSubOperation({
        paramsSchema: () => articleSectionSchemas.params,
        dataSchema: () => articleSectionSchemas.update,
        operation: () => ({ prisma, params, data }) =>
            prisma.articleSection.update({
                where: params.id ? { id: params.id } : { name: params.name },
                data: {
                    imageSize: data.imageSize,
                    imagePosition: data.position,
                    cmsImage: data.imageSize ? {
                        update: {
                            imageSize: data.imageSize > 250 ? 'MEDIUM' : 'SMALL',
                        },
                    } : undefined,
                },
                include: articleSectionsRealtionsIncluder,
            })
    }),

    /**
     * This is the function that adds a part to an article section. The part can be a cmsImage, cmsParagraph.
     * If the part already exists in the article section, it will return an error
     * If it does not it will create the part and add it to the article section
     * @param params - The name or id of the article section to add the part to
     * @param part - The part to add to the article section cmsImage, cmsParagraph or cmsLink
     * @returns - The updated article section
     */
    addPart: defineSubOperation({
        paramsSchema: () => articleSectionSchemas.params,
        dataSchema: () => articleSectionSchemas.addPart,
        operation: () => async ({ prisma, params, data }) => {
            const where = params.id ? { id: params.id } : { name: params.name }

            const articleSection = await prisma.articleSection.findUnique({
                where,
                include: { [data.part]: true }
            })
            if (!articleSection) {
                throw new ServerError('NOT FOUND', 'ArticleSection not found')
            }
            if (articleSection[data.part]) {
                throw new ServerError('BAD PARAMETERS', `ArticleSection already has ${data.part}`)
            }

            switch (data.part) {
                case 'cmsImage':
                {
                    const cmsImage = await cmsImageOperations.create({ data: {}, bypassAuth: true })
                    return await prisma.articleSection.update({
                        where,
                        data: { cmsImage: { connect: { id: cmsImage.id } } },
                        include: articleSectionsRealtionsIncluder
                    })
                }
                case 'cmsParagraph':
                {
                    const cmsParagraph = await cmsParagraphOperations.create({ data: {}, bypassAuth: true })
                    return await prisma.articleSection.update({
                        where,
                        data: { cmsParagraph: { connect: { id: cmsParagraph.id } } },
                        include: articleSectionsRealtionsIncluder
                    })
                }
                case 'cmsLink':
                {
                    const cmsLink = await cmsLinkOperations.create({ data: { text: 'lenke', url: './' }, bypassAuth: true })
                    return await prisma.articleSection.update({
                        where,
                        data: { cmsLink: { connect: { id: cmsLink.id } } },
                        include: articleSectionsRealtionsIncluder
                    })
                }
                default:
                    break
            }
            throw new ServerError('BAD PARAMETERS', 'Invalid part')
        }
    }),

    /**
     * This is a function that removes a part from an article section. The part can be a cmsImage, cmsParagraph.
     * It does so by deleting the associated part from the database, in tern setting the part to null in the article section
     * If the attribute destroyOnEmpty is true, it will also remove the article section if all parts are removed
     * @param params - The name or id of the article section to remove the part from
     * @param part - The part to remove from the article section cmsImage, cmsParagraph or cmsLink
     * @param operationImplementationFields - destroyOnEmpty - this is an imporant atribute as when articles use a
     * articleSection it wishes to remove the article section if all parts are removed, but if a service only uses
     * one articleSection you do not want to delete it even if it has no content.
     * @returns - The updated article section
     */
    removePart: defineSubOperation({
        paramsSchema: () => articleSectionSchemas.params,
        dataSchema: () => articleSectionSchemas.removePart,
        operation: ({ destroyOnEmpty }: { destroyOnEmpty: boolean }) => async ({ prisma, params, data }) => {
            const where = params.id ? { id: params.id } : { name: params.name }
            const articleSection = await prisma.articleSection.findUnique({
                where,
                include: { cmsLink: true, cmsParagraph: true, cmsImage: true }
            })
            if (!articleSection) {
                throw new ServerError('NOT FOUND', 'ArticleSection not found')
            }
            if (!articleSection[data.part]) {
                throw new ServerError('BAD PARAMETERS', `ArticleSection does not have ${data.part}`)
            }

            switch (data.part) {
                case 'cmsLink':
                    if (articleSection.cmsLink) {
                        await cmsLinkOperations.destroy({
                            params: { id: articleSection.cmsLink.id },
                            bypassAuth: true
                        })
                    }
                    break
                case 'cmsParagraph':
                    if (articleSection.cmsParagraph) {
                        await cmsParagraphOperations.destroy({
                            params: { id: articleSection.cmsParagraph.id },
                            bypassAuth: true
                        })
                    }
                    break
                case 'cmsImage':
                    if (articleSection.cmsImage) {
                        await cmsImageOperations.destroy({
                            params: { id: articleSection.cmsImage.id },
                            bypassAuth: true
                        })
                    }
                    break
                default:
                    break
            }

            // check if all Parts are removed and if so, remove the articleSection,
            // but only if destroyOnEmpty is true
            const afterDelete = await prisma.articleSection.findUnique({
                where,
                include: { cmsParagraph: true, cmsImage: true, cmsLink: true }
            })
            if (!afterDelete) {
                throw new ServerError('UNKNOWN ERROR', 'Noe uventet skjedde etter sletting av del av artclesection')
            }
            if (
                destroyOnEmpty &&
                !afterDelete.cmsImage &&
                !afterDelete.cmsParagraph &&
                !afterDelete.cmsImage
            ) {
                return await destroy({
                    params: { id: articleSection.id },
                    bypassAuth: true
                })
            }

            return afterDelete
        }
    })
} as const
