import styles from './JobAd.module.scss'
import ImageCard from '@/components/ImageCard/ImageCard'
import { JobTypeConfig } from '@/services/career/jobAds/ConfigVars'
import type { SimpleJobAd } from '@/services/career/jobAds/Types'

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
            {!jobAd.active ? <p className={styles.inactive}>Inaktiv</p> : <></>}
            <p>{jobAd.companyName} - {JobTypeConfig[jobAd.type].label}</p>
            <i>{jobAd.description}</i>
        </ImageCard>
    )
}
