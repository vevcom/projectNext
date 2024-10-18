import styles from './InterestGroup.module.scss'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import ArticleSection from '@/components/Cms/ArticleSection/ArticleSection'
import { DestroyInterestGroupAuther, UpdateInterestGroupAuther } from '@/services/groups/interestGroups/Auther'
import { SettingsHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import { updateInterestGroupAction } from '@/actions/groups/interestGroups/update'
import { destroyInterestGroupAction } from '@/actions/groups/interestGroups/destroy'
import type { SessionMaybeUser } from '@/auth/Session'
import type { ExpandedInterestGroup } from '@/services/groups/interestGroups/Types'

type PropTypes = {
    interestGroup: ExpandedInterestGroup
    session: SessionMaybeUser
}

export default function InterestGroup({ interestGroup, session }: PropTypes) {
    const canUpdate = UpdateInterestGroupAuther.dynamicFields({ groupId: interestGroup.groupId }).auth(session)
    const canDestroy = DestroyInterestGroupAuther.dynamicFields({}).auth(session)

    const PopUpKey = `Update interest group ${interestGroup.name}`

    return (
        <div className={styles.interestGroup}>
            <h2>{interestGroup.name}</h2>
            <div className={styles.admin}>
                {
                    canUpdate.authorized || canDestroy.authorized ? (
                        <SettingsHeaderItemPopUp PopUpKey={PopUpKey}>
                            {
                                canUpdate.authorized && (
                                    <>
                                        <h2>Update interest group</h2>
                                        <Form
                                            refreshOnSuccess
                                            closePopUpOnSuccess={PopUpKey}
                                            action={updateInterestGroupAction.bind(
                                                null, { id: interestGroup.id }
                                            )}
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
                                        closePopUpOnSuccess={PopUpKey}
                                        action={destroyInterestGroupAction.bind(
                                            null, { id: interestGroup.id }
                                        )}
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
            <ArticleSection key={interestGroup.id} articleSection={interestGroup.articleSection} />
        </div>
    )
}
