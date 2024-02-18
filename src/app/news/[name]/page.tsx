import { readNewsByIdOrName } from "@/actions/news/read"
import { notFound } from "next/navigation"
import Article from "@/cms/Article/Article"
import styles from './page.module.scss'

type PropTypes = {
    params: {
        name: string
    }
}


export default async function NewsArticle({ params }: PropTypes) {
    const name = decodeURIComponent(params.name)
    const res = await readNewsByIdOrName(name)
    if (!res.success) notFound()
    const news = res.data

    return (
        <div className={styles.wrapper}>
            <Article article={news.article} />
        </div>
    )
}