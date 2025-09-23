import NewsCard from './NewsCard'
import { readNewsCurrentIncludingDraftsAction } from '@/actions/news/read'
import React from 'react'

type PropTypes = {
    not?: number
}

/**
 * Shows all current news including drafts - for admin users
 * @param not - pass it not: a id of a news to exclude from the list
 */
export default async function CurrentNewsWithDrafts({ not }: PropTypes) {
    const res = await readNewsCurrentIncludingDraftsAction()
    if (!res.success) {
        throw res.error ?
            new Error(res.error[0].message) :
            new Error('unknown error reading news')
    }

    const news = res.data.filter(newsItem => newsItem.id !== not)
    const publishedNews = news.filter(item => item.visibility.published)
    const draftNews = news.filter(item => !item.visibility.published)

    return (
        <div>
            {draftNews.length > 0 && (
                <section>
                    <h3>Utkast ({draftNews.length})</h3>
                    {draftNews.map(newsItem =>
                        <NewsCard
                            key={newsItem.id}
                            news={newsItem}
                            showDraftStatus={true}
                        />
                    )}
                </section>
            )}

            {publishedNews.length > 0 && (
                <section>
                    <h3>Publiserte nyheter ({publishedNews.length})</h3>
                    {publishedNews.map(newsItem =>
                        <NewsCard
                            key={newsItem.id}
                            news={newsItem}
                        />
                    )}
                </section>
            )}

            {news.length === 0 && (
                <i>Det er for tiden ingen nyheter</i>
            )}
        </div>
    )
}
