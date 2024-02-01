import styles from './Article.module.scss'
import ArticleSection from '@/cms/ArticleSection/ArticleSection'
import type { ReturnType } from '@/cms/articles/ReturnType'
import CmsImage from '../CmsImage/CmsImage'

type PropTypes = {
    article: ReturnType,
}

export default function Article({ article } : PropTypes) {
    return (
        <span className={styles.Article}>
            <CmsImage width={500} name={article.coverImage.name} />
            <article>
            {
                article.articleSections.map(section => (
                    <ArticleSection key={section.id} articleSection={section} />
                ))
            }
            </article>
        </span>
    )
}
