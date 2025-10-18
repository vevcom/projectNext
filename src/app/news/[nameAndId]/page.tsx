import styles from './page.module.scss'
import EditNews from './EditNews'
import CurrentNews from '@/app/news/CurrentNews'
import Article from '@/cms/Article/Article'
import { readNewsAction } from '@/services/news/actions'
import SlideInOnView from '@/components/SlideInOnView/SlideInOnView'
import { decodeVevenUriHandleError } from '@/lib/urlEncoding'
import { notFound } from 'next/navigation'

type PropTypes = {
    params: Promise<{
        nameAndId: string
    }>
}

export default async function NewsArticle({ params }: PropTypes) {
    const idAndName = (await params).nameAndId
    const res = await readNewsAction(decodeVevenUriHandleError(idAndName))

    if (!res.success) notFound()
    const news = res.data

    return (
        <div className={styles.wrapper}>
            <Article article={news.article} />
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
