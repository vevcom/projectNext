import styles from './School.module.scss'
import CmsImageClient from '@/cms/CmsImage/CmsImageClient'
import CmsLink from '@/cms/CmsLink/CmsLink'
import CmsImage from '@/cms/CmsImage/CmsImage'
import CmsParagraph from '@/cms/CmsParagraph/CmsParagraph'
import type { ExpandedSchool } from '@/education/schools/Types'

type PropTypes = {
    school: ExpandedSchool
    asClient?: boolean
}

export default function School({ school, asClient = false }: PropTypes) {
    return (
        <div className={styles.School}>
            {
                asClient ? (
                    <CmsImageClient
                        className={styles.cmsImage}
                        classNameImage={styles.image}
                        cmsImage={school.cmsImage}
                        width={200}
                    />
                ) : <CmsImage
                    className={styles.cmsImage}
                    classNameImage={styles.image}
                    cmsImage={school.cmsImage}
                    width={200}
                />
            }

            <div className={styles.text}>
                <h2>{school.name}</h2>
                <CmsParagraph cmsParagraph={school.cmsParagraph} />
                <CmsLink cmsLink={school.cmsLink} />
            </div>
        </div>
    )
}
