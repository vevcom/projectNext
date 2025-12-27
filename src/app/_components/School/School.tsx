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
import { schoolAuth } from '@/services/education/schools/auth'
import type { ExpandedSchool } from '@/services/education/schools/types'
import type{ SessionMaybeUser } from '@/auth/session/Session'

type PropTypes = {
    school: ExpandedSchool
    asClient?: boolean
    session: SessionMaybeUser
}

export default function School({ school, asClient = false, session }: PropTypes) {
    const updateCmsImageAction = configureAction(
        updateSchoolCmsImageAction,
        { implementationParams: { shortName: school.shortName } }
    )

    const canEditCmsImage = schoolAuth.updateCmsImage.dynamicFields({}).auth(session).toJsObject()
    const canEditCmsParagraph = schoolAuth.updateCmsParagraph.dynamicFields({}).auth(session).toJsObject()
    const canEditCmsLink = schoolAuth.updateCmsLink.dynamicFields({}).auth(session).toJsObject()

    return (
        <div className={styles.School}>
            {
                asClient ? (
                    <CmsImageClient
                        canEdit={canEditCmsImage}
                        className={styles.cmsImage}
                        classNameImage={styles.image}
                        cmsImage={school.cmsImage}
                        width={200}
                        updateCmsImageAction={updateCmsImageAction}
                    />
                ) : <CmsImage
                    canEdit={canEditCmsImage}
                    className={styles.cmsImage}
                    classNameImage={styles.image}
                    cmsImage={school.cmsImage}
                    width={200}
                    updateCmsImageAction={updateCmsImageAction}
                />
            }

            <div className={styles.text}>
                <div className={styles.name}>
                    <h2>{school.name}</h2> <p>({school.shortName})</p>
                </div>
                <CmsParagraph
                    cmsParagraph={school.cmsParagraph}
                    updateCmsParagraphAction={
                        configureAction(
                            updateSchoolCmsParagraphContentAction,
                            { implementationParams: { shortName: school.shortName } }
                        )
                    }
                    canEdit={canEditCmsParagraph}
                />
                <CmsLink
                    cmsLink={school.cmsLink}
                    className={styles.cmsLink}
                    color="primary"
                    updateCmsLinkAction={
                        configureAction(
                            updateSchoolCmsLinkAction,
                            { implementationParams: { shortName: school.shortName } }
                        )
                    }
                    canEdit={canEditCmsLink}
                />
            </div>
        </div>
    )
}
