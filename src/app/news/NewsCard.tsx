import ImageCard from '@/components/ImageCard/ImageCard'
import type { SimpleNewsArticle } from '@/actions/news/Types'

type PropTypes = {
    news: SimpleNewsArticle
}

export default function NewsCard({ news }: PropTypes) {
    return (
        <ImageCard
            href={`/news/${news.articleName}`}
            title={news.articleName}
            image={news.coverImage}
        >
            <p>{news.description}</p>
        </ImageCard>
    )
}
