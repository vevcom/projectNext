import ImageCard from '@/components/ImageCard/ImageCard'
import styles from './NewsCard.module.scss'
import type { SimpleNewsArticle } from '@/services/news/Types'

type PropTypes = {
    news: SimpleNewsArticle
    showDraftStatus?: boolean
}

export default function NewsCard({ news, showDraftStatus = false }: PropTypes) {
    const isPublished = news.visibility.published
    
    return (
        <div className={styles.NewsCardWrapper}>
            {showDraftStatus && !isPublished && (
                <div className={styles.draftBadge}>
                    Utkast
                </div>
            )}
            <ImageCard
                href={`/news/${news.orderPublished}/${news.articleName}`}
                title={news.articleName}
                image={news.coverImage}
            >
                <p>{news.description}</p>
            </ImageCard>
        </div>
    )
}
