import React from 'react'
import { readNewsCurrent } from '@/actions/news/read'
import ImageCard from '@/components/ImageCard/ImageCard'

export default async function CurrentNews() {
    const res = await readNewsCurrent()
    if (!res.success) throw res.error ? 
        new Error(res.error[0].message) : 
        new Error('unknown error reading news')

    const news = res.data

    return (
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
    )
}
