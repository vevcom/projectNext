import type { SimpleReturnType } from "@/actions/news/ReturnType"
import ImageCard from '@/components/ImageCard/ImageCard'

type PropTypes = {
    news: SimpleReturnType
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
