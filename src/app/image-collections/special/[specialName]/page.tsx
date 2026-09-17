import styles from './page.module.scss'
import SpecialCollectionPanel from './SpecialCollectionPanel'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
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
        <PageWrapper title={collection.name}>
            {collection.description && <p className={styles.description}>{collection.description}</p>}
            <main>
                <SpecialCollectionPanel special={specialName} />
            </main>
        </PageWrapper>
    )
}
