import CreateInterestGroupForm from './CreateInterestGroupForm'
import InterestGroup from './InterestGroup'
import SpecialCmsParagraph from '@/cms/CmsParagraph/SpecialCmsParagraph'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import { Session } from '@/auth/Session'
import { interestGroupAuth } from '@/services/groups/interestGroups/auth'
import { readInterestGroupsAction } from '@/services/groups/interestGroups/actions'

export default async function InterestGroups() {
    const session = await Session.fromNextAuth()
    const interestGroupsRes = await readInterestGroupsAction()
    if (!interestGroupsRes.success) return <div>Failed to load interest groups</div> //TODO: Change to unwrap
    const interestGroups = interestGroupsRes.data

    const canCreate = interestGroupAuth.create.dynamicFields({}).auth(session)

    return (
        <PageWrapper title="Interessegrupper" headerItem={
            canCreate.authorized && (
                <AddHeaderItemPopUp PopUpKey="Create interest group">
                    <CreateInterestGroupForm />
                </AddHeaderItemPopUp>
            )
        }>
            <SpecialCmsParagraph special="INTEREST_GROUP_GENERAL_INFO" />
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
