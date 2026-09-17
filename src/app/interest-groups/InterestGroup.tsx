import styles from './InterestGroup.module.scss'
import InterestGroupSettings from './InterestGroupSettings'
import ArticleSection from '@/components/Cms/ArticleSection/ArticleSection'
import {
    updateInterestGroupArticleSectionAction,
    addPartToInterestGroupArticleSectionAction,
    removePartFromInterestGroupArticleSectionAction,
    updateInterestGroupCmsImageAction,
    updateInterestGroupCmsParagraphAction,
    updateInterestGroupCmsLinkAction
} from '@/services/groups/interestGroups/actions'
import { interestGroupAuth } from '@/services/groups/interestGroups/auth'
import { configureAction } from '@/services/configureAction'
import type { SessionMaybeUser } from '@/auth/session/Session'
import type { ExpandedInterestGroup } from '@/services/groups/interestGroups/types'

type PropTypes = {
    interestGroup: ExpandedInterestGroup
    session: SessionMaybeUser
}

export default function InterestGroup({ interestGroup, session }: PropTypes) {
    const canUpdate = interestGroupAuth.update.dynamicFields({ groupId: interestGroup.groupId }).auth(session)
    const canDestroy = interestGroupAuth.destroy.dynamicFields({}).auth(session)
    const canEditArticleSection = interestGroupAuth.updateArticleSection.dynamicFields({
        groupId: interestGroup.groupId
    }).auth(session).toJsObject()

    const cmsArticleActionConfig = { implementationParams: { interestGroupId: interestGroup.id } }

    return (
        <div className={styles.interestGroup}>
            <div className={styles.title}>
                <h2>{interestGroup.name}</h2>
                <InterestGroupSettings
                    interestGroupId={interestGroup.id}
                    interestGroupName={interestGroup.name}
                    canUpdate={canUpdate.toJsObject()}
                    canDestroy={canDestroy.toJsObject()}
                />
            </div>
            <ArticleSection
                canEdit={canEditArticleSection}
                key={interestGroup.id}
                articleSection={interestGroup.articleSection}
                actions={{
                    updateArticleSection: configureAction(
                        updateInterestGroupArticleSectionAction, cmsArticleActionConfig
                    ),
                    addPartToArticleSection: configureAction(
                        addPartToInterestGroupArticleSectionAction, cmsArticleActionConfig
                    ),
                    removePartFromArticleSection: configureAction(
                        removePartFromInterestGroupArticleSectionAction, cmsArticleActionConfig
                    ),
                    updateCmsImage: configureAction(
                        updateInterestGroupCmsImageAction, cmsArticleActionConfig
                    ),
                    updateCmsParagraph: configureAction(
                        updateInterestGroupCmsParagraphAction, cmsArticleActionConfig
                    ),
                    updateCmsLink: configureAction(
                        updateInterestGroupCmsLinkAction, cmsArticleActionConfig
                    ),
                }}
            />
        </div>
    )
}
