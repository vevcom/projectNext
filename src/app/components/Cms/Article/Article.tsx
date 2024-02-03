import styles from './Article.module.scss'
import ArticleSection from '@/cms/ArticleSection/ArticleSection'
import type { ReturnType } from '@/cms/articles/ReturnType'
import CmsImage from '../CmsImage/CmsImage'
import SlideInOnView from '../../SlideInOnView/SlideInOnView'

type PropTypes = {
    article: ReturnType,
}

export default function Article({ article } : PropTypes) {
    return (
        <span className={styles.Article}>
            <span className={styles.coverImage}>
                <CmsImage width={500} name={article.coverImage.name} />
                <h1 className={styles.title}>{article.name}</h1>
            </span>
            <article>
            
            {
                article.articleSections.sort((a, b) => (a.order - b.order)).map(section => (
                    <SlideInOnView>
                        <ArticleSection key={section.id} articleSection={section} />
                    </SlideInOnView>
                ))
            }
            </article>
        </span>
    )
}
