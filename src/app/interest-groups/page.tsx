import SpecialCmsParagraph from "@/cms/CmsParagraph/SpecialCmsParagraph";
import PageWrapper from "@/components/PageWrapper/PageWrapper";

export default async function IntrestGroups() {
    return (
        <PageWrapper title="Interessegrupper">
            <SpecialCmsParagraph special="INTEREST_GROUP_GENERAL_INFO" />
        </PageWrapper>
    )
}