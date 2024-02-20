import OldNewsPagingProvider from "@/context/paging/OldNewsPaging";
import type { PageSizeOldNews } from "@/context/paging/OldNewsPaging";
import { readOldNewsPage } from "@/actions/news/read";
import NewsCard from "../NewsCard";
import OldNewsList from "./OldNewsList";

export default async function NewsArchive() {
    const pageSize : PageSizeOldNews = 20
    const res = await readOldNewsPage<PageSizeOldNews>({
        page: {
            page: 0,
            pageSize: pageSize
        },
        details: undefined
    })
    if (!res.success) throw new Error('Failed to read news')
    const serverRendered = res.data

    return (
        <OldNewsPagingProvider
            startPage={{
                page: 1,
                pageSize: pageSize,
            }}
            details={undefined}
            serverRenderedData={serverRendered}
        >
            <OldNewsList serverRendered={serverRendered.map(news => <NewsCard news={news} />)} />
        </OldNewsPagingProvider>
    
    )
}