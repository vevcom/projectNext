import styles from './page.module.scss'
import CreateCommitteeForm from './CreateCommitteeForm'
import ImageSelectionProvider from '@/contexts/ImageSelection'
import ImageList from '@/components/Image/ImageList/ImageList'
import ImagePagingProvider from '@/contexts/paging/ImagePaging'
import { readSpecialImageCollectionAction } from '@/actions/images/collections/read'
import PopUpProvider from '@/contexts/PopUp'
import { readSpecialImageAction } from '@/actions/images/read'
import type { PageSizeImage } from '@/contexts/paging/ImagePaging'

export default async function adminCommittee() {
    const committeeLogoCollectionRes = await readSpecialImageCollectionAction('COMMITTEELOGOS')
    if (!committeeLogoCollectionRes.success) throw new Error('Kunne ikke finne komitelogoer')
    const { id: collectionId } = committeeLogoCollectionRes.data

    const defaultCommitteeLogoRes = await readSpecialImageAction.bind(
        null, { special: 'DAFAULT_COMMITTEE_LOGO' }
    )()
    if (!defaultCommitteeLogoRes.success) throw new Error('Kunne ikke finne standard komitelogo')
    const defaultCommitteeLogo = defaultCommitteeLogoRes.data

    const pageSize: PageSizeImage = 30

    return (
        <ImagePagingProvider
            serverRenderedData={[]}
            details={{
                collectionId,
            }}
            startPage={{
                page: 0,
                pageSize,
            }}
        >
            <PopUpProvider>
                <ImageSelectionProvider
                    defaultImage={defaultCommitteeLogo}
                    defaultSelectionMode={true}
                >
                    <div className={styles.wrapper}>
                        <div className={styles.imgSelection}>
                            <ImageList withUpload />
                        </div>
                        <div className={styles.form}>
                            <CreateCommitteeForm />
                        </div>
                    </div>
                </ImageSelectionProvider>
            </PopUpProvider>
        </ImagePagingProvider>
    )
}
