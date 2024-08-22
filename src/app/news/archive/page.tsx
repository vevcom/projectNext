import OldNewsList from './OldNewsList'
import NewsCard from '@/app/news/NewsCard'
import OldNewsPagingProvider from '@/context/paging/OldNewsPaging'
import { readOldNewsPageAction } from '@/actions/news/read'
import PageWrapper from '@/app/components/PageWrapper/PageWrapper'
import type { PageSizeOldNews } from '@/context/paging/OldNewsPaging'

export default async function NewsArchive() {
    const pageSize: PageSizeOldNews = 20
    const res = await readOldNewsPageAction<PageSizeOldNews>({
        page: {
            page: 0,
            pageSize,
            cursor: null,
        },
        details: undefined
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
