import styles from './InterestGroup.module.scss'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import ArticleSection from '@/components/Cms/ArticleSection/ArticleSection'
import { SettingsHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import {
    updateInterestGroupAction,
    destroyInterestGroupAction,
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

    const popUpKey = `Update interest group ${interestGroup.name}`

    const cmsArticleActionConfig = { implementationParams: { interestGroupId: interestGroup.id } }

    return (
        <div className={styles.interestGroup}>
            <h2>{interestGroup.name}</h2>
            <div className={styles.admin}>
                {
                    canUpdate.authorized || canDestroy.authorized ? (
                        <SettingsHeaderItemPopUp popUpKey={popUpKey}>
                            {
                                canUpdate.authorized && (
                                    <>
                                        <h2>Oppdater interessegruppe</h2>
                                        <Form
                                            refreshOnSuccess
                                            closePopUpOnSuccess={popUpKey}
                                            action={
                                                updateInterestGroupAction.bind(null, ({ params: { id: interestGroup.id } }))
                                            }
                                            submitText="Endre"
                                        >
                                            <TextInput
                                                defaultValue={interestGroup.name}
                                                name="name"
                                                label="Navn"
                                            />
                                            <TextInput
                                                defaultValue={interestGroup.shortName}
                                                name="shortName"
                                                label="Kortnavn"
                                            />
                                        </Form>
                                    </>
                                )
                            }
                            {
                                canDestroy.authorized && (
                                    <Form
                                        refreshOnSuccess
                                        closePopUpOnSuccess={popUpKey}
                                        action={
                                            destroyInterestGroupAction.bind(null, ({ params: { id: interestGroup.id } }))
                                        }
                                        submitText="Slett"
                                        submitColor="red"
                                        confirmation={{
                                            confirm: true,
                                            text: `Er du sikker på at du vil slette ${interestGroup.name}?`
                                        }}
                                    />
                                )
                            }
                        </SettingsHeaderItemPopUp>
                    ) : <></>
                }
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
