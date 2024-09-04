import styles from './Article.module.scss'
import AddSection from './AddSection'
import SectionMover from './SectionMover'
import ChangeName from './ChangeName'
import CmsImage from '@/cms/CmsImage/CmsImage'
import SlideInOnView from '@/components/SlideInOnView/SlideInOnView'
import ArticleSection from '@/cms/ArticleSection/ArticleSection'
import type { ExpandedArticle } from '@/cms/articles/Types'
import { faSleigh } from '@fortawesome/free-solid-svg-icons'

export type PropTypes = {
    article: ExpandedArticle,
    coverImageClass?: string,
    hideCoverImage?: boolean
}

export default function Article({ article, coverImageClass, hideCoverImage=false }: PropTypes) {
    return (
        <span className={styles.Article}>
            {hideCoverImage?<></>:(
            <span className={`${coverImageClass} ${styles.coverImage}`}>
                <CmsImage width={500} cmsImage={article.coverImage} />
                <SlideInOnView direction="bottom">
                    <ChangeName article={article} />
                </SlideInOnView>
            </span> 
        )}
            <article>
                {
                    article.articleSections.length ? (
                        article.articleSections.sort((a, b) => (a.order - b.order)).map((section, i) => (
                            <SlideInOnView direction="left" key={section.id}>
                                <span className={styles.moveSection}>
                                    <ArticleSection articleSection={section} />
                                    <SectionMover
                                        showUp={i !== 0}
                                        showDown={i !== article.articleSections.length - 1}
                                        articleId={article.id}
                                        sectionId={section.id}
                                        className={styles.moverComponent}
                                    />
                                </span>
                            </SlideInOnView>
                        ))
                    ) : (
                        <i className={styles.empty}>Denne artikkelen er tom</i>
                    )
                }
            </article>
            <div className={styles.addSection}>
                <AddSection articleId={article.id} currentNumberSections={article.articleSections.length} />
            </div>
        </span>
    )
}
