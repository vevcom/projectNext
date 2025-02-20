import JobAd from './JobAd'
import { readActiveJobAdsAction } from '@/actions/career/jobAds/read'

type PropTypes = {
    not?: number
}

/**
 * @param not - pass it not: a id of a jobad to exclude from the list
 */
export default async function CurrentJobAds({ not }: PropTypes) {
    const res = await readActiveJobAdsAction()
    if (!res.success) {
        throw res.error ?
            new Error(res.error[0].message) :
            new Error('unknown error reading jobad')
    }

    const jobAds = res.data.filter(n => n.id !== not)

    return (
        jobAds.length ? (
            jobAds.map(jobAd =>
                <JobAd jobAd={jobAd} key={jobAd.id} />
            )
        ) : (
            <i>Det er for tiden ingen jobbannonser</i>
        )
    )
}
