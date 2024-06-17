import NewsCard from './NewsCard'
import { readNewsCurrentAction } from '@/actions/news/read'
import React from 'react'

type PropTypes = {
    not?: number
}

/**
 * @param not - pass it not: a id of a news to exclude from the list
 */
export default async function CurrentNews({ not }: PropTypes) {
    const res = await readNewsCurrentAction()
    if (!res.success) {
        throw res.error ?
            new Error(res.error[0].message) :
            new Error('unknown error reading news')
    }

    const news = res.data.filter(n => n.id !== not)

    return (
        news.length ? (
            news.map(n => <NewsCard key={n.id} news={n} />)
        ) : (
            <i>Det er for tiden ingen nyheter</i>
        )
    )
}
