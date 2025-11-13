import OldNewsList from './OldNewsList'
import NewsCard from '@/app/news/NewsCard'
import { OldNewsPagingProvider } from '@/contexts/paging/OldNewsPaging'
import { readOldNewsPageAction } from '@/services/news/actions'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
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
        <PageWrapper title="Nyhetsarkiv">
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
