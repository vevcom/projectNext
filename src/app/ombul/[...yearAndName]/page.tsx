import { readOmbul } from '@/actions/ombul/read'
import { notFound } from 'next/navigation'
import styles from './page.module.scss'
import PdfDocument from '@/components/PdfDocument/PdfDocument'
import Link from 'next/link'

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

    const path = `/store/ombul/${ombul.fsLocation}`

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h1>{ombul.name}</h1>
                <p>{ombul.description}</p>
            </div>
            <main>
                <PdfDocument src={path} />
            </main>
            <div className={styles.nav}>
                <div className={styles.download}>
                    <a href={path} download>Last ned</a>
                </div>
                <div className={styles.openInBrowser}>
                    <Link href={path} target='blank'>Åpne i ny fane</Link>
                </div>
            </div>
        </div>
    )
}