'use client'
import styles from './OldNewsList.module.scss'
import EndlessScroll from '@/app/components/PagingWrappers/EndlessScroll'
import { OldNewsPagingContext } from '@/context/paging/OldNewsPaging'
import NewsCard from '@/app/news/NewsCard'
import type { ReactNode } from 'react'

type PropTypes = {
    serverRendered: ReactNode
}

export default function OldNewsList({ serverRendered }: PropTypes) {
    return (
        <div className={styles.OldNewsList}>
            { serverRendered }
            <EndlessScroll
                pagingContext={OldNewsPagingContext}
                renderer={news => (
                    <NewsCard news={news} />
                )}
            />
        </div>
    )
}
