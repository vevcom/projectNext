import ImageCard from '@/components/ImageCard/ImageCard'
import { readCurrentJobAdsAction } from '@/actions/career/jobAds/read'

type PropTypes = {
    not?: number
}

/**
 * @param not - pass it not: a id of a jobad to exclude from the list
 */
export default async function CurrentJobAds({ not }: PropTypes) {
    const res = await readCurrentJobAdsAction.bind(null, {})()
    console.log(res)
    if (!res.success) {
        throw res.error ?
            new Error(res.error[0].message) :
            new Error('unknown error reading jobad')
    }

    const jobAds = res.data.filter(n => n.id !== not)

    return (
        jobAds.length ? (
            jobAds.map(ad =>
                <ImageCard
                    href={`/career/jobads/${ad.orderPublished}/${ad.articleName}`}
                    title={ad.company}
                    image={ad.coverImage}
                    key={ad.id}
                >
                    <p>{ad.articleName}</p>
                    <i>{ad.description}</i>
                </ImageCard>
            )
        ) : (
            <i>Det er for tiden ingen jobbannonser</i>
        )
    )
}
