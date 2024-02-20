import styles from './CurrentNews.module.scss'
import { readNewsCurrent } from '@/actions/news/read'
import React from 'react'
import NewsCard from './NewsCard'

type PropTypes = {
    not?: number
}

/**
 * pass it not: a id of a article to exclude from the list
 */
export default async function CurrentNews({ not }: PropTypes) {
    const res = await readNewsCurrent()
    if (!res.success) {
        throw res.error ?
            new Error(res.error[0].message) :
            new Error('unknown error reading news')
    }

    const news = res.data.filter(n => n.id !== not)

    return (
        news.length ? (
            news.map(n => <NewsCard news={n} />)
        ) : (
            <i className={styles.nonews}>Det er for tiden ingen nyheter</i>
        )
    )
}
