import styles from './page.module.scss'
import EditNews from './EditNews'
import CurrentNews from '@/app/news/CurrentNews'
import Article from '@/cms/Article/Article'
import {
    readNewsAction,
    updateNewsArticleAction,
    updateNewsArticleAddSectionAction,
    updateNewsArticleCmsImageAction,
    updateNewsArticleCmsLinkAction,
    updateNewsArticleCmsParagraphAction,
    updateNewsArticleCoverImageAction,
    updateNewsArticleReorderSectionsAction,
    updateNewsArticleSectionAction,
    updateNewsArticleSectionsAddPartAction,
    updateNewsArticleSectionsRemovePartAction
} from '@/services/news/actions'
import SlideInOnView from '@/components/SlideInOnView/SlideInOnView'
import { decodeVevenUriHandleError } from '@/lib/urlEncoding'
import { configureAction } from '@/services/configureAction'
import { newsAuth } from '@/services/news/auth'
import { ServerSession } from '@/auth/session/ServerSession'
import { notFound } from 'next/navigation'

type PropTypes = {
    params: Promise<{
        nameAndId: string
    }>
}

export default async function NewsArticle({ params }: PropTypes) {
    const idAndName = (await params).nameAndId
    const res = await readNewsAction({ params: { id: decodeVevenUriHandleError(idAndName) } })
    if (!res.success) notFound()
    const news = res.data

    const canEdit = newsAuth.updateArticle.dynamicFields({}).auth(
        await ServerSession.fromNextAuth()
    ).toJsObject()
    return (
        <div className={styles.wrapper}>
            <Article
                canEdit={canEdit}
                article={news.article}
                actions={{
                    updateArticleAction: configureAction(
                        updateNewsArticleAction,
                        { implementationParams: { newsId: news.id } }
                    ),
                    updateCoverImageAction: configureAction(
                        updateNewsArticleCoverImageAction,
                        { implementationParams: { newsId: news.id } }
                    ),
                    addSectionToArticleAction: configureAction(
                        updateNewsArticleAddSectionAction,
                        { implementationParams: { newsId: news.id } }
                    ),
                    reorderArticleSectionsAction: configureAction(
                        updateNewsArticleReorderSectionsAction,
                        { implementationParams: { newsId: news.id } }
                    ),
                    articleSections: {
                        updateCmsParagraph: configureAction(
                            updateNewsArticleCmsParagraphAction,
                            { implementationParams: { newsId: news.id } }
                        ),
                        updateCmsImage: configureAction(
                            updateNewsArticleCmsImageAction,
                            { implementationParams: { newsId: news.id } }
                        ),
                        updateCmsLink: configureAction(
                            updateNewsArticleCmsLinkAction,
                            { implementationParams: { newsId: news.id } }
                        ),
                        updateArticleSection: configureAction(
                            updateNewsArticleSectionAction,
                            { implementationParams: { newsId: news.id } }
                        ),
                        addPartToArticleSection: configureAction(
                            updateNewsArticleSectionsAddPartAction,
                            { implementationParams: { newsId: news.id } }
                        ),
                        removePartFromArticleSection: configureAction(
                            updateNewsArticleSectionsRemovePartAction,
                            { implementationParams: { newsId: news.id } }
                        )
                    }
                }}
            />
            <SlideInOnView>
                <EditNews news={news}>
                    <div className={styles.moreNews}>
                        <h1>Flere nyheter</h1>
                        <div>
                            <CurrentNews not={news.id} />
                        </div>
                    </div>
                </EditNews>
            </SlideInOnView>
        </div>
    )
}
