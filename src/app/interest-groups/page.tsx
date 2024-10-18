import { readInterestGroupsAction } from "@/actions/groups/interestGroups/read";
import SpecialCmsParagraph from "@/cms/CmsParagraph/SpecialCmsParagraph";
import PageWrapper from "@/components/PageWrapper/PageWrapper";
import ArticleSection from "@/components/Cms/ArticleSection/ArticleSection";
import styles from './page.module.scss'
import { AddHeaderItemPopUp } from "@/components/HeaderItems/HeaderItemPopUp";
import CreateInterestGroupForm from "./CreateInterestGroupForm";
import { CreateInterestGroupAuther } from "@/services/groups/interestGroups/Auther";

export default async function InterestGroups() {
    const { session, ...interestGroupsRes } = await readInterestGroupsAction.bind(null, {})()
    if (!interestGroupsRes.success) return <div>Failed to load interest groups</div> //TODO: Change to unwrap
    const interestGroups = interestGroupsRes.data

    const canCreate = CreateInterestGroupAuther.dynamicFields({}).auth(session)

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
                    <div className={styles.interestGroup}>
                        <h2>{interestGroup.name}</h2>
                        <ArticleSection key={interestGroup.id} articleSection={interestGroup.articleSection} />
                    </div>
                ))
            }
            </main>
        </PageWrapper>
    )
}