import styles from './page.module.scss'
import Article from '@/cms/Article/Article'
import { readArticleAction } from '@/cms/articles/read'
import { notFound } from 'next/navigation'

type PropTypes = {
    params: Promise<{
        category: string
        name: string
    }>,
}

export default async function ArticleCategorArticley({ params }: PropTypes) {
    //This fixes æ, ø, å and spaces in the url
    const name = decodeURIComponent((await params).name)
    const category = decodeURIComponent((await params).category)
    const res = await readArticleAction({
        name,
        category
    })
    if (!res.success) return notFound()

    return (
        <div className={styles.wrapper}>
            <Article coverImageClass={styles.coverImage} article={res.data} />
        </div>
    )
}
