import styles from './page.module.scss'
import CreateCommitteeForm from './CreateCommitteeForm'
import ImageSelectionProvider from '@/context/ImageSelection'
import ImageList from '@/app/components/Image/ImageList/ImageList'
import ImagePagingProvider from '@/context/paging/ImagePaging'
import { readSpecialImageCollection } from '@/actions/images/collections/read'
import PopUpProvider from '@/context/PopUp'
import { readSpecialImage } from '@/actions/images/read'
import type { PageSizeImage } from '@/context/paging/ImagePaging'

export default async function adminCommittee() {
    const committeeLogoCollectionRes = await readSpecialImageCollection('COMMITEELOGOS')
    if (!committeeLogoCollectionRes.success) throw new Error('Kunne ikke finne komitelogoer')
    const { id: collectionId } = committeeLogoCollectionRes.data

    const defaultCommitteeLogoRes = await readSpecialImage('DAFAULT_COMMITTEE_LOGO')
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
                            <CreateCommitteeForm defaultImage={defaultCommitteeLogo} />
                        </div>
                    </div>
                </ImageSelectionProvider>
            </PopUpProvider>
        </ImagePagingProvider>
    )
}
