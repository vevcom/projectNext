import styles from './School.module.scss'
import CmsImage from '@/cms/CmsImage/CmsImage'
import CmsParagraph from '@/cms/CmsParagraph/CmsParagraph'
import type { ExpandedSchool } from '@/services/schools/Types'

type PropTypes = {
    school: ExpandedSchool
}

export default function School({ school }: PropTypes) {
    return (
        <div className={styles.School}>
            <CmsImage cmsImage={school.cmsImage} width={200} />
            <CmsParagraph cmsParagraph={school.cmsParagraph} />
        </div>
    )
}
