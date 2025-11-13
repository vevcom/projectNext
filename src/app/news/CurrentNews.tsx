import NewsCard from './NewsCard'
import { readNewsCurrentAction } from '@/services/news/actions'
import React from 'react'

type PropTypes = {
    not?: number
}

/**
 * @param not - pass it not: a id of a news to exclude from the list
 * WARNING: This component must be server-side rendered
 */
export default async function CurrentNews({ not }: PropTypes) {
    const res = await readNewsCurrentAction()
    if (!res.success) {
        throw res.error ?
            new Error(res.error[0].message) :
            new Error('unknown error reading news')
    }

    const news = res.data.filter(newsItem => newsItem.id !== not)

    return (
        news.length ? (
            news.map(newsItem => <NewsCard key={newsItem.id} news={newsItem} />)
        ) : (
            <i>Det er for tiden ingen nyheter</i>
        )
    )
}
