
import styles from './page.module.scss'
import EditJobAd from './EditJobAd'
import { readJobAdAction } from '@/actions/jobAds/read'
import Article from '@/components/Cms/Article/Article'
import { notFound } from 'next/navigation'

type PropTypes = {
    params: {
        orderAndName: string[]
    }
}


export default async function JobAd({ params }: PropTypes) {
    if (params.orderAndName.length !== 2) notFound()
    const order = parseInt(decodeURIComponent(params.orderAndName[0]), 10)
    const name = decodeURIComponent(params.orderAndName[1])

    const jobAdRes = await readJobAdAction({ articleName: name, order })
    if (!jobAdRes.success) {
        if (jobAdRes.errorCode === 'NOT FOUND') notFound()
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
