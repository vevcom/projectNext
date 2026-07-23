import styles from './page.module.scss'
import SpecialCollectionPanel from './SpecialCollectionPanel'
import { specialImagePanels } from '@/services/images/specialPanels/constants'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { notFound } from 'next/navigation'
import type { SpecialCollection } from '@/prisma-generated-pn-types'

type PropTypes = {
    params: Promise<{
        specialName: string
    }>
}

const isSpecialCollection = (value: string): value is SpecialCollection => value in specialImagePanels

export default async function SpecialImageCollection({ params }: PropTypes) {
    const specialName = decodeURIComponent((await params).specialName)
    if (!isSpecialCollection(specialName)) notFound()

    const collection = unwrapActionReturn(await specialImagePanels[specialName].readCollectionAction())

    return (
        <div className={styles.wrapper}>
            <h1>{collection.name}</h1>
            <i>{collection.description}</i>
            <main>
                <SpecialCollectionPanel special={specialName} />
            </main>
        </div>
    )
}
