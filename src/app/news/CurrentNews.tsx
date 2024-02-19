import styles from './CurrentNews.module.scss'
import { readNewsCurrent } from '@/actions/news/read'
import ImageCard from '@/components/ImageCard/ImageCard'
import React from 'react'

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
        <div className={styles.CurrentNews}>
            {
                news.length ? (
                    news.map(n => (
                        <ImageCard
                            key={n.id}
                            image={n.coverImage}
                            title={n.articleName}
                            href={`/news/${n.articleName}`}
                        >
                            {n.description}
                        </ImageCard>
                    ))
                ) : (
                    <i>Det er for tiden ingen nyheter</i>
                )
            }
        </div>
    )
}
