import styles from './page.module.scss'
import CmsParagraph from '@/components/Cms/CmsParagraph/CmsParagraph'
import read from '@/actions/cms/paragraphs/read'

export default async function Articles() {
    const pargraphAction = await read('my_first_paragraph')

    //should never happen as default behaviour is to create if not found.
    if (!pargraphAction.success) throw new Error(pargraphAction.error ? pargraphAction.error[0].message : 'something unexpected happen in loading paragraph')

    const cmsParagraph = pargraphAction.data
    return (
        <main className={styles.wrapper}>
            <CmsParagraph cmsParagraph={cmsParagraph} />
        </main>
    )
}
