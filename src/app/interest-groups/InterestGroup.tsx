import ArticleSection from '@/components/Cms/ArticleSection/ArticleSection'
import styles from './InterestGroup.module.scss'
import { ExpandedInterestGroup } from '@/services/groups/interestGroups/Types'
import { SessionMaybeUser } from '@/auth/Session'
import { UpdateInterestGroupAuther } from '@/services/groups/interestGroups/Auther'
import { SettingsHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import Form from '../_components/Form/Form'
import { updateInterestGroupAction } from '@/actions/groups/interestGroups/update'
import TextInput from '../_components/UI/TextInput'

type PropTypes = {
    interestGroup: ExpandedInterestGroup
    session: SessionMaybeUser
}

export default function InterestGroup({ interestGroup, session }: PropTypes) {
    const canUpdate = UpdateInterestGroupAuther.dynamicFields({ groupId: interestGroup.groupId }).auth(session)
    const canDestroy = UpdateInterestGroupAuther.dynamicFields({ groupId: interestGroup.groupId }).auth(session)

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

                        }
                        </SettingsHeaderItemPopUp>
                    ) : <></>
                }
            </div>
            <ArticleSection key={interestGroup.id} articleSection={interestGroup.articleSection} />
        </div>
    )
}
