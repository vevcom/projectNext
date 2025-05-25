import styles from './page.module.scss'
import { readCommitteeParagraphAction } from '@/actions/groups/committees/read'
import CmsParagraph from '@/components/Cms/CmsParagraph/CmsParagraph'

export type PropTypes = {
    params: Promise<{
        shortName: string
    }>
}

export default async function Committee({ params }: PropTypes) {
    const paragraphRes = await readCommitteeParagraphAction((await params).shortName)
    if (!paragraphRes.success) throw new Error('Kunne ikke hente komitéparagraph')
    const paragraph = paragraphRes.data

    return (
        <div className={styles.wrapper}>
            <CmsParagraph cmsParagraph={paragraph} />
        </div>
    )
}
