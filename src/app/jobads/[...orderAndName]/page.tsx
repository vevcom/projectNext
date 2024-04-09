
import { notFound } from 'next/navigation'
import styles from './page.module.scss'
import { readJobAdAction } from '@/actions/jobAds/read'
import Article from '@/app/components/Cms/Article/Article'
import EditJobAd from './EditJobAd'

type PropTypes = {
    params: {
        orderAndName: string[]
    }
}


export default async function JobAd({ params }: PropTypes) {
    if (params.orderAndName.length !== 2) notFound()
    const order = parseInt(decodeURIComponent(params.orderAndName[0]))
    const name = decodeURIComponent(params.orderAndName[1])

    const jobAdRes = await readJobAdAction({ articleName: name, order })
    if (!jobAdRes.success) {
        if (jobAdRes.errorCode === "NOT FOUND") notFound()
        throw new Error('Failed to read jobAd')
    }
    const jobAd = jobAdRes.data
    return (
        <div className={styles.wrapper}>
            <Article article={jobAd.article} />
            <EditJobAd jobAd={jobAd}/>
        </div>

    )
}
