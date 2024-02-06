import styles from './Article.module.scss'
import CmsImage from '@/cms/CmsImage/CmsImage'
import SlideInOnView from '@/components/SlideInOnView/SlideInOnView'
import ArticleSection from '@/cms/ArticleSection/ArticleSection'
import type { ReturnType } from '@/cms/articles/ReturnType'
import AddSection from './AddSection'

type PropTypes = {
    article: ReturnType,
}

export default function Article({ article } : PropTypes) {
    return (
        <span className={styles.Article}>
            <span className={styles.coverImage}>
                <CmsImage width={500} name={article.coverImage.name} />
                <SlideInOnView direction="bottom">
                    <h1 className={styles.title}>{article.name}</h1>
                </SlideInOnView>
            </span>
            <article>
                {
                    article.articleSections.sort((a, b) => (a.order - b.order)).map(section => (
                        <SlideInOnView direction="left" key={section.id}>
                            <ArticleSection articleSection={section} />
                        </SlideInOnView>
                    ))
                }
            </article>
            <div className={styles.addSection}>
                <AddSection articleId={article.id} currentNumberSections={article.articleSections.length} />
            </div>
        </span>
    )
}
