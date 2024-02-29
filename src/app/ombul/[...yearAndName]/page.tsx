import { readOmbul } from '@/actions/ombul/read'
import { notFound } from 'next/navigation'
import styles from './page.module.scss'

type PropTypes = {
    params: {
        yearAndName: string[]
    }
}

export default async function Ombul({ params }: PropTypes) {
    const year = parseInt(decodeURIComponent(params.yearAndName[0]), 10)
    const name = decodeURIComponent(params.yearAndName[1])
    if (!year || !name || params.yearAndName.length > 2) notFound()
    const ombulRes = await readOmbul({
        name,
        year
    })
    if (!ombulRes.success) notFound()
    const ombul = ombulRes.data
    return (
        <div className={styles.wrapper}>
            <h1>{ombul.name}</h1>
            <p>{ombul.description}</p>
            <embed src={`/store/ombul/${ombul.fsLocation}`} type="application/pdf" width="100%" height="600px" />
        </div>
    )
}