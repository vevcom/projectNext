import styles from './Article.module.scss'
import AddSection from './AddSection'
import SectionMover from './SectionMover'
import ChangeName from './ChangeName'
import CmsImage from '@/cms/CmsImage/CmsImage'
import SlideInOnView from '@/components/SlideInOnView/SlideInOnView'
import { configureAction } from '@/services/configureAction'
import ArticleSection, {
    type ArticleSectionActions
} from '@/cms/ArticleSection/ArticleSection'
import type { ReactNode } from 'react'
import type {
    AddSectionToArticleAction,
    ExpandedArticle,
    ReorderArticleSectionsAction,
    UpdateArticleAction
} from '@/cms/articles/types'
import type { UpdateCmsImageAction } from '@/cms/images/types'

export type PropTypes = {
    article: ExpandedArticle,
    coverImageClass?: string,
    hideCoverImage?: boolean
    noMargin?: boolean
    sideBarContent?: ReactNode
    sideBarClassName?: string
    actions: {
        updateCoverImageAction: UpdateCmsImageAction,
        updateArticleAction: UpdateArticleAction,
        addSectionToArticleAction: AddSectionToArticleAction,
        reorderArticleSectionsAction: ReorderArticleSectionsAction,
        articleSections: ArticleSectionActions
    }
}

export default function Article({
    article,
    coverImageClass,
    hideCoverImage = false,
    noMargin = false,
    sideBarContent,
    sideBarClassName,
    actions,
}: PropTypes) {
    return (
        <span className={styles.Article}>
            {hideCoverImage ? <></> : (
                <span className={`${coverImageClass} ${styles.coverImage}`}>
                    <CmsImage
                        width={500}
                        cmsImage={article.coverImage}
                        updateCmsImageAction={actions.updateCoverImageAction}
                    />
                    <SlideInOnView direction="bottom">
                        <ChangeName
                            article={article}
                            updateArticleAction={
                                configureAction(
                                    actions.updateArticleAction,
                                    { params: { articleId: article.id } }
                                )
                            }
                        />
                    </SlideInOnView>
                </span>
            )}
            <article className={noMargin ? styles.noMargin : undefined}>
                {
                    article.articleSections.length ? (
                        article.articleSections.sort((a, b) => (a.order - b.order)).map((section, i) => (
                            <SlideInOnView direction="left" key={section.id}>
                                <span className={styles.moveSection}>
                                    <ArticleSection actions={actions.articleSections} articleSection={section} />
                                    <SectionMover
                                        showUp={i !== 0}
                                        showDown={i !== article.articleSections.length - 1}
                                        className={styles.moverComponent}
                                        reorderArticleSectionsAction={
                                            configureAction(
                                                actions.reorderArticleSectionsAction,
                                                {
                                                    params: {
                                                        articleId: article.id,
                                                        sectionId: section.id
                                                    }
                                                }
                                            )
                                        }
                                    />
                                </span>
                            </SlideInOnView>
                        ))
                    ) : (
                        <i className={styles.empty}>Denne artikkelen er tom</i>
                    )
                }
            </article>
            {sideBarContent && (
                <aside className={`${styles.sideBar} ${sideBarClassName}`}>
                    {sideBarContent}
                </aside>
            )}
            <div className={styles.addSection}>
                <AddSection
                    currentNumberSections={article.articleSections.length}
                    addSectionToArticleAction={
                        configureAction(
                            actions.addSectionToArticleAction,
                            { params: { articleId: article.id } }
                        )
                    }
                />
            </div>
        </span>
    )
}
