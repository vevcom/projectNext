import ImageCard from '@/components/ImageCard/ImageCard'
import { JobTypeConfig } from '@/services/career/jobAds/ConfigVars'
import type { SimpleJobAd } from '@/services/career/jobAds/Types'
import React from 'react'

type PropTypes = {
    jobAd: SimpleJobAd
}

export default function JobAd({ jobAd }: PropTypes) {
    return (
        <ImageCard
            href={`/career/jobads/${jobAd.orderPublished}/${jobAd.articleName}`}
            title={jobAd.articleName}
            image={jobAd.coverImage}
            key={jobAd.id}
        >
            <p>{jobAd.companyName} - {JobTypeConfig[jobAd.type].label}</p>
            <i>{jobAd.description}</i>
        </ImageCard>
    )
}
