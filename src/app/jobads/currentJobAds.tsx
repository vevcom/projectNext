import ImageCard from '@/components/ImageCard/ImageCard'
import React from 'react'
import { readJobAdAction, readJobAdsCurrentAction } from '@/actions/jobAds/read'
import { ExpandedJobAd } from '@/server/jobAds/Types'
import { readJobAdsCurrent } from '@/server/jobAds/read'

type PropTypes = {
    not?: number
}

/**
 * pass it not: a id of a article to exclude from the list
 */
export default async function CurrentJobAds({ not }: PropTypes) {
    const res = await readJobAdsCurrentAction()
    if (!res.success) {
        throw res.error ?
            new Error(res.error[0].message) :
            new Error('unknown error reading news')
    }

    const jobAds = res.data.filter(n => n.id !== not)

    return (
        jobAds.length ? (
            jobAds.map(ad => <ImageCard href={`/jobads/${ad.orderPublished}/${ad.articleName}`} title={ad.company} image={ad.coverImage}><p>{ad.description}</p></ImageCard>)
        ) : (
            <i>Det er for tiden ingen jobbannonser</i>
        )
    )
}
