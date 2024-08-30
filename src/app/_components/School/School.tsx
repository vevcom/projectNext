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
            <CmsImage 
                className={styles.cmsImage} 
                classNameImage={styles.image}
                cmsImage={school.cmsImage}
                width={200} 
            />
            <div className={styles.text}>
                <h2>{school.name}</h2>
                <CmsParagraph cmsParagraph={school.cmsParagraph} />
            </div>
        </div>
    )
}
