import styles from './page.module.scss'
import OldNewsList from './OldNewsList'
import NewsCard from '@/app/news/NewsCard'
import { OldNewsPagingProvider } from '@/contexts/paging/OldNewsPaging'
import { readOldNewsPageAction } from '@/services/news/actions'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import type { PageSizeOldNews } from '@/contexts/paging/OldNewsPaging'

export default async function NewsArchive() {
    const pageSize: PageSizeOldNews = 20
    const res = await readOldNewsPageAction({
        params: {
            paging: {
                page: {
                    page: 0,
                    pageSize,
                    cursor: null,
                },
                details: undefined
            },
        }
    })
    if (!res.success) throw new Error('Failed to read news')
    const serverRendered = res.data

    return (
        <PageWrapper title="Nyhetsarkiv" headerItem={
            <Link href="/news" className={styles.backLink}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
        }>
            <OldNewsPagingProvider
                startPage={{
                    page: 1,
                    pageSize,
                }}
                details={undefined}
                serverRenderedData={serverRendered}
            >
                <OldNewsList serverRendered={serverRendered.map(news => <NewsCard key={news.id} news={news} />)} />
            </OldNewsPagingProvider>
        </PageWrapper>
    )
}
