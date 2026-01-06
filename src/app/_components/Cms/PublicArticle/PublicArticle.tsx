import Article, { type PropTypes } from '@/cms/Article/Article'
import { configureAction } from '@/services/configureAction'
import {
    updatePublicArticleAction,
    updatePublicArticleAddSectionAction,
    updatePublicArticleCmsImageAction,
    updatePublicArticleCmsLinkAction,
    updatePublicArticleCmsParagraphAction,
    updatePublicArticleCoverImageAction,
    updatePublicArticleReorderSectionsAction,
    updatePublicArticleSectionAction,
    updatePublicArticleSectionsAddPartAction,
    updatePublicArticleSectionsRemovePartAction
} from '@/services/publicArticles/actions'
import React from 'react'

function PublicArticle(props: Omit<PropTypes, 'actions'>) {
    return (
        <Article {...props} actions={{
            updateArticleAction: configureAction(
                updatePublicArticleAction,
                { implementationParams: undefined }
            ),
            updateCoverImageAction: configureAction(
                updatePublicArticleCoverImageAction,
                { implementationParams: undefined }
            ),
            addSectionToArticleAction: configureAction(
                updatePublicArticleAddSectionAction,
                { implementationParams: undefined }
            ),
            reorderArticleSectionsAction: configureAction(
                updatePublicArticleReorderSectionsAction,
                { implementationParams: undefined }
            ),
            articleSections: {
                updateCmsParagraph: configureAction(
                    updatePublicArticleCmsParagraphAction,
                    { implementationParams: undefined }
                ),
                updateCmsImage: configureAction(
                    updatePublicArticleCmsImageAction,
                    { implementationParams: undefined }
                ),
                updateCmsLink: configureAction(
                    updatePublicArticleCmsLinkAction,
                    { implementationParams: undefined }
                ),
                updateArticleSection: configureAction(
                    updatePublicArticleSectionAction,
                    { implementationParams: undefined }
                ),
                addPartToArticleSection: configureAction(
                    updatePublicArticleSectionsAddPartAction,
                    { implementationParams: undefined }
                ),
                removePartFromArticleSection: configureAction(
                    updatePublicArticleSectionsRemovePartAction,
                    { implementationParams: undefined }
                )
            }
        }} />
    )
}

export default PublicArticle
