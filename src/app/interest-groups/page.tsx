import CreateInterestGroupForm from './CreateInterestGroupForm'
import InterestGroup from './InterestGroup'
import SpecialCmsParagraph from '@/cms/CmsParagraph/SpecialCmsParagraph'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import { interestGroupAuth } from '@/services/groups/interestGroups/auth'
import {
    readInterestGroupsAction,
    readSpecialCmsParagraphGeneralInfoAction,
    updateSpecialCmsParagraphContentGeneralInfoAction
} from '@/services/groups/interestGroups/actions'
import { ServerSession } from '@/auth/session/ServerSession'

export default async function InterestGroups() {
    const interestGroupsRes = await readInterestGroupsAction()
    if (!interestGroupsRes.success) return <div>Failed to load interest groups</div> //TODO: Change to unwrap?
    const interestGroups = interestGroupsRes.data

    const session = await ServerSession.fromNextAuth()
    const canCreate = interestGroupAuth.create.dynamicFields({}).auth(session)
    const canEditGeneralInfo = interestGroupAuth.updateSpecialCmsParagraphContentGeneralInfo.dynamicFields(
        {}
    ).auth(
        session
    ).toJsObject()

    return (
        <PageWrapper title="Interessegrupper" headerItem={
            canCreate.authorized && (
                <AddHeaderItemPopUp PopUpKey="Create interest group">
                    <CreateInterestGroupForm />
                </AddHeaderItemPopUp>
            )
        }>
            <SpecialCmsParagraph
                canEdit={canEditGeneralInfo}
                special="INTEREST_GROUP_GENERAL_INFO"
                readSpecialCmsParagraphAction={readSpecialCmsParagraphGeneralInfoAction}
                updateCmsParagraphAction={updateSpecialCmsParagraphContentGeneralInfoAction}
            />
            <main>
                {
                    interestGroups.map(interestGroup => (
                        <InterestGroup session={session} key={interestGroup.id} interestGroup={interestGroup} />
                    ))
                }
            </main>
        </PageWrapper>
    )
}
