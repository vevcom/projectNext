import styles from './School.module.scss'
import CmsImageClient from '@/cms/CmsImage/CmsImageClient'
import CmsLink from '@/cms/CmsLink/CmsLink'
import CmsImage from '@/cms/CmsImage/CmsImage'
import CmsParagraph from '@/cms/CmsParagraph/CmsParagraph'
import {
    updateSchoolCmsImageAction,
    updateSchoolCmsLinkAction,
    updateSchoolCmsParagraphContentAction
} from '@/services/education/schools/actions'
import { configureAction } from '@/services/configureAction'
import type { ExpandedSchool } from '@/services/education/schools/types'

type PropTypes = {
    school: ExpandedSchool
    asClient?: boolean
}

export default function School({ school, asClient = false }: PropTypes) {
    const updateCmsImageAction = configureAction(
        updateSchoolCmsImageAction,
        { implementationParams: { shortname: school.shortname } }
    )

    return (
        <div className={styles.School}>
            {
                asClient ? (
                    <CmsImageClient
                        className={styles.cmsImage}
                        classNameImage={styles.image}
                        cmsImage={school.cmsImage}
                        width={200}
                        updateCmsImageAction={updateCmsImageAction}
                    />
                ) : <CmsImage
                    className={styles.cmsImage}
                    classNameImage={styles.image}
                    cmsImage={school.cmsImage}
                    width={200}
                    updateCmsImageAction={updateCmsImageAction}
                />
            }

            <div className={styles.text}>
                <div className={styles.name}>
                    <h2>{school.name}</h2> <p>({school.shortname})</p>
                </div>
                <CmsParagraph
                    cmsParagraph={school.cmsParagraph}
                    updateCmsParagraphAction={
                        configureAction(
                            updateSchoolCmsParagraphContentAction,
                            { implementationParams: { shortname: school.shortname } }
                        )
                    }
                />
                <CmsLink
                    cmsLink={school.cmsLink}
                    className={styles.cmsLink}
                    color="primary"
                    updateCmsLinkAction={
                        configureAction(
                            updateSchoolCmsLinkAction,
                            { implementationParams: { shortname: school.shortname } }
                        )
                    }
                />
            </div>
        </div>
    )
}
